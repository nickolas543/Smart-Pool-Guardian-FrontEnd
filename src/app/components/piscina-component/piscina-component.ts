import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { PiscinaService } from '../../services/piscina-service';

import { PiscinasPorUsuarioDTO } from '../../models/dtos/PiscinasPorUsuarioDTO';
import { MedicionService } from '../../services/medicion-service';
import { NavbarComponent } from "../dashboard-main/navbar-component/navbar-component";
import { SidebarComponent } from "../dashboard-main/sidebar-component/sidebar-component";
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-piscinas',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './piscina-component.html',
  styleUrl: './piscina-component.css'
})
export class PiscinasComponent implements OnInit {

  piscinas = signal<PiscinasPorUsuarioDTO[]>([]);
  alertas: any[] = [];

  idUsuario = 0;

  // Datos de ejemplo para la vista — reemplazar por datos reales del backend.
  ejemplos = [
    {
      estado: 'alerta',
      badge: 'Alerta de temperatura',
      nombre: 'Club Social Norte',
      usuario: 'Admin_Comercial',
      temp: 31.5,
      ph: 7.6,
      cloro: 1.2,
      phWarn: false,
      tiempo: 'Hace 5 min',
    },
    {
      estado: 'optimo',
      badge: 'Óptimo',
      nombre: 'Residencia Silva',
      usuario: 'm.silva89',
      temp: 26.0,
      ph: 7.4,
      cloro: 2.5,
      phWarn: false,
      tiempo: 'Hace 12 min',
    },
    {
      estado: 'atencion',
      badge: 'Atención pH',
      nombre: 'Complejo Deportivo Sur',
      usuario: 'dir_deportes',
      temp: 27.2,
      ph: 8.2,
      cloro: 1.8,
      phWarn: true,
      tiempo: 'Hace 1 hora',
    },
  ];

  // Resumen general (datos de ejemplo).
  resumen = {
    total: 3,
    critico: 1,
    atencion: 1,
  };

  constructor(
    private piscinaService: PiscinaService,
    private route: ActivatedRoute,
    private medicionService: MedicionService
  ) { }

  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (!this.obtenerIdUsuario()) {
      return;
    }
    this.cargarPiscinas();
    this.cargarAlertas();
  }

  private obtenerIdUsuario(): boolean {

    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const token = sessionStorage.getItem('token');

    if (!token) {
      return false;
    }

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);

    this.idUsuario = Number(decodedToken.id);

    return true;
  }

  cargarPiscinas() {

    this.piscinaService.listPiscinas(this.idUsuario).subscribe({
      next: (data) => {
        this.piscinas.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    });

  }

  eliminar(idPiscina: number) {

    if (!confirm('¿Eliminar piscina?')) {
      return;
    }

    this.piscinaService
      .eliminar(this.idUsuario, idPiscina)
      .subscribe({

        next: () => {

          this.cargarPiscinas();

        },

        error: (err) => {

          console.error(err);

        }
      });

  }
  cargarAlertas() {

    this.medicionService
      .obtenerAlertas(this.idUsuario)
      .subscribe({

        next: (data: any) => {

          if (Array.isArray(data)) {
            this.alertas = data;
          }

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

}