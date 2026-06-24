import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificacionService } from '../../services/notificacion-service';
import { NotificacionResponseDTO } from '../../models/response/NotificacionResponseDTO';

@Component({
  selector: 'app-notificacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificacion-component.html',
  styleUrl: './notificacion-component.css'
})
export class NotificacionComponent implements OnInit {

  notificaciones: NotificacionResponseDTO[] = [];

  usuarioId = 1; // temporal

  filtro = 'todas';

  constructor(
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.notificacionService
      .listar(this.usuarioId)
      .subscribe({
        next: (data) => {
          this.notificaciones = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  mostrarTodas() {
    this.notificacionService
      .listar(this.usuarioId)
      .subscribe(data => {
        this.notificaciones = data;
      });
  }

  mostrarLeidas() {
    this.notificacionService
      .listarLeidas(this.usuarioId)
      .subscribe(data => {
        this.notificaciones = data;
      });
  }

  mostrarNoLeidas() {
    this.notificacionService
      .listarNoLeidas(this.usuarioId)
      .subscribe(data => {
        this.notificaciones = data;
      });
  }

  marcarComoLeida(notificacion: NotificacionResponseDTO) {

    this.notificacionService
      .marcarLeida(
        this.usuarioId,
        notificacion.idNotificacion
      )
      .subscribe({
        next: () => {
          notificacion.leido = true;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}