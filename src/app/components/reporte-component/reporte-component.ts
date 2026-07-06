import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../dashboard-main/sidebar-component/sidebar-component";
import { NavbarComponent } from "../dashboard-main/navbar-component/navbar-component";
import { UsuarioService } from '../../services/usuario-service';
import { UsuariosInactivosDTO } from '../../models/dtos/UsuariosInactivosDTO';

@Component({
  selector: 'app-reporte-component',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent],
  templateUrl: './reporte-component.html',
  styleUrl: './reporte-component.css',
})
export class ReporteComponent implements OnInit {

  usuarioHistorial = signal<UsuariosInactivosDTO[]>([]);
  cargandoHistorial = signal(false);

  paginaActual = signal(0);
  readonly tamPagina = 5;

  usuariosPagina = computed<UsuariosInactivosDTO[]>(() => {
    const hist = this.usuarioHistorial();
    const inicio = this.paginaActual() * this.tamPagina;
    return hist.slice(inicio, inicio + this.tamPagina);
  });

  totalPaginas = computed(() => {
    const hist = this.usuarioHistorial();
    return Math.ceil(hist.length / this.tamPagina);
  });

  constructor(private uS: UsuarioService) {}

  ngOnInit(): void {
    this.cargarInactivos();
  }

  cargarInactivos(): void {
    this.cargandoHistorial.set(true);
    this.uS.obtenerInactivos().subscribe({
      next: (data) => {
        this.usuarioHistorial.set(data);
        this.paginaActual.set(0);
        this.cargandoHistorial.set(false);
      },
      error: (err) => {
        console.error('Error al listar usuarios inactivos', err);
        this.cargandoHistorial.set(false);
      },
    });
  }

  // ===== Paginación =====
  paginaSiguiente(): void {
    if (this.paginaActual() < this.totalPaginas() - 1) {
      this.paginaActual.update((p) => p + 1);
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 0) {
      this.paginaActual.update((p) => p - 1);
    }
  }
}
