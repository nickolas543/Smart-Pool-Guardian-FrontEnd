import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { SidebarComponent } from './sidebar-component/sidebar-component';
import { NavbarComponent } from './navbar-component/navbar-component';
import { PiscinaService } from '../../services/piscina-service';
import { NotificacionService } from '../../services/notificacion-service';
import { MedicionService } from '../../services/medicion-service';
import { RecomendacionService } from '../../services/recomendacion-service';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { PiscinasPorUsuarioDTO } from '../../models/dtos/PiscinasPorUsuarioDTO';
import { NotificacionResponseDTO } from '../../models/response/NotificacionResponseDTO';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-dashboard-main',
  imports: [SidebarComponent, NavbarComponent, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css',
})
export class DashboradMain implements OnInit {
  id: number = 0;
  usuariosInactivos = signal<number>(0);
  role: string = '';

  // Cards
  piscinas = signal<PiscinasPorUsuarioDTO[]>([]);
  notificacionesNoLeidas = signal<NotificacionResponseDTO[]>([]);
  alertaAlgas = signal<string>('');
  recomendacionesCriticas = signal<any[]>([]);

  // Recomendacion por piscina
  recomendacionPiscina = signal<string>('');
  piscinaSeleccionada = signal<number | null>(null);

  // Stats
  totalPiscinas = signal<number>(0);
  totalNotifs = signal<number>(0);

  private platformId = inject(PLATFORM_ID);

  constructor(
    private route: ActivatedRoute,
    private pS: PiscinaService,
    private nS: NotificacionService,
    private mS: MedicionService,
    private rS: RecomendacionService,
    private usuarioS: UsuarioService,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const helper = new JwtHelperService();
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const decodedToken = helper.decodeToken(token);
    this.id = Number(decodedToken.id);

    if (!token) return;
    const decoded = helper.decodeToken(token);
    this.role = decoded.roles ?? '';

    this.cargarPiscinas();
    this.cargarNotificaciones();

    if (this.isAdminOrDev()) {
      this.cargarInactivos();
      this.cargarRecomendaciones();
      this.cargarAlertas();
    }
  }

  cargarPiscinas() {
    this.pS.listPiscinas(this.id).subscribe((data) => {
      this.piscinas.set(data);
      this.totalPiscinas.set(data.length);
    });
  }

  cargarNotificaciones() {
    this.nS.listarNoLeidas(this.id).subscribe((data) => {
      this.notificacionesNoLeidas.set(data);
      this.totalNotifs.set(data.length);
    });
  }

  cargarAlertas() {
    this.mS.obtenerAlertas(this.id).subscribe((data) => {
      this.alertaAlgas.set(data);
    });
  }

  cargarRecomendaciones() {
    this.rS.porEvaluacionesCriticas().subscribe((data) => {
      this.recomendacionesCriticas.set(data);
    });
  }

  cargarInactivos() {
    this.usuarioS.obtenerInactivos().subscribe((data) => {
      this.usuariosInactivos.set(data.length);
    });
  }

  seleccionarPiscina(piscinaId: number) {
    this.piscinaSeleccionada.set(piscinaId);
    this.recomendacionPiscina.set('');
    this.rS.porPiscina(piscinaId).subscribe({
      next: (data) => this.recomendacionPiscina.set(data),
      error: (err) => console.error(err),
    });
  }

  isAdmin(): boolean {
    return this.role.includes('ADMIN');
  }

  isDev(): boolean {
    return this.role.includes('DEV');
  }

  isAdminOrDev(): boolean {
    return this.isAdmin() || this.isDev();
  }
}