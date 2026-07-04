import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PiscinaService } from '../../services/piscina-service';
import { MedicionService } from '../../services/medicion-service';
import { NavbarComponent } from '../dashboard-main/navbar-component/navbar-component';
import { SidebarComponent } from '../dashboard-main/sidebar-component/sidebar-component';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PiscinaRequestDTO } from '../../models/request/PiscinaRequestDTO';
import { FormsModule } from '@angular/forms';

interface PiscinaVista {
  piscinaId: number;
  nombre: string;
  volumen: number;
  estado: 'alerta' | 'optimo' | 'atencion';
  badge: string;
  temp: number;
  ph: number;
  cloro: number;
  phWarn: boolean;
  tiempo: string;
}

@Component({
  selector: 'app-piscinas',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, FormsModule],
  templateUrl: './piscina-component.html',
  styleUrl: './piscina-component.css',
})
export class PiscinasComponent implements OnInit {
  piscinas = signal<PiscinaVista[]>([]);
  idUsuario = 0;
  resumen = { total: 0, critico: 0, atencion: 0 };

  private platformId = inject(PLATFORM_ID);

  constructor(
    private piscinaService: PiscinaService,
    private route: ActivatedRoute,
    private medicionService: MedicionService,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = sessionStorage.getItem('token');
    if (!token) return;

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    this.idUsuario = Number(decodedToken.id);

    this.cargarPiscinas();
  }


  cargarPiscinas() {
    this.piscinaService.listPiscinas(this.idUsuario).subscribe({
      next: (piscinas) => {
        if (piscinas.length === 0) {
          this.piscinas.set([]);
          this.actualizarResumen();
          return;
        }

        // Primero mostramos las piscinas sin mediciones
        const vistas: PiscinaVista[] = piscinas.map((p) => ({
          piscinaId: p.piscinaId,
          nombre: p.nombrePiscina,
          volumen: p.volumen,
          estado: 'optimo' as 'optimo',
          badge: 'Sin mediciones',
          temp: 0,
          ph: 0,
          cloro: 0,
          phWarn: false,
          tiempo: 'Sin mediciones',
        }));

        this.piscinas.set(vistas);
        this.actualizarResumen();

        // Luego intentamos cargar mediciones por cada piscina
        piscinas.forEach((p) => {
          this.medicionService.listarPorPiscina(p.piscinaId).subscribe({
            next: (mediciones: any[]) => {
              if (!mediciones || mediciones.length === 0) return;

              const ultima = mediciones[mediciones.length - 1];
              if (!ultima?.medicionId) return;

              this.medicionService.obtenerDetalle(ultima.medicionId).subscribe({
                next: (detalle) => {
                  const lista = [...this.piscinas()];
                  const idx = lista.findIndex((v) => v.piscinaId === p.piscinaId);
                  if (idx === -1) return;

                  lista[idx] = {
                    ...lista[idx],
                    ph: detalle.nivelPh,
                    cloro: detalle.nivelCloro,
                    temp: detalle.temperatura,
                    estado: this.calcularEstado(detalle.nivelPh, detalle.temperatura),
                    badge: this.calcularBadge(detalle.nivelPh, detalle.temperatura),
                    phWarn: detalle.nivelPh < 7.2 || detalle.nivelPh > 7.8,
                    tiempo: this.calcularTiempo(ultima.fechaMedicion),
                  };

                  this.piscinas.set(lista);
                  this.actualizarResumen();
                },
                error: () => {},
              });
            },
            error: () => {},
          });
        });
      },
      error: (err) => console.error(err),
    });
  }

  calcularEstado(ph: number, temp: number): 'alerta' | 'optimo' | 'atencion' {
    if (temp > 30) return 'alerta';
    if (ph < 7.2 || ph > 7.8) return 'atencion';
    return 'optimo';
  }

  calcularBadge(ph: number, temp: number): string {
    if (temp > 30) return 'Alerta de temperatura';
    if (ph < 7.2 || ph > 7.8) return 'Atención pH';
    return 'Óptimo';
  }

  calcularTiempo(fecha: string): string {
    if (!fecha) return 'Sin datos';
    const diff = Date.now() - new Date(fecha).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Hace ${hrs} hora${hrs > 1 ? 's' : ''}`;
    return `Hace ${Math.floor(hrs / 24)} día(s)`;
  }

  actualizarResumen() {
    const lista = this.piscinas();
    this.resumen = {
      total: lista.length,
      critico: lista.filter((p) => p.estado === 'alerta').length,
      atencion: lista.filter((p) => p.estado === 'atencion').length,
    };
  }

  eliminar(idPiscina: number) {
    if (!confirm('¿Eliminar piscina?')) return;
    this.piscinaService.eliminar(this.idUsuario, idPiscina).subscribe({
      next: () => this.cargarPiscinas(),
      error: (err) => console.error(err),
    });
  }

  // Modal
  mostrarModal = signal<boolean>(false);
  form = { nombrePiscina: '', volumen: 0 };

  abrirModal() {
    this.form = { nombrePiscina: '', volumen: 0 };
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  registrar() {
    if (!this.form.nombrePiscina || !this.form.volumen) return;

    const dto = new PiscinaRequestDTO();
    dto.nombrePiscina = this.form.nombrePiscina;
    dto.volumen = this.form.volumen;

    this.piscinaService.registrar(this.idUsuario, dto).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarPiscinas();
      },
      error: (err) => console.error(err),
    });
  }
}
