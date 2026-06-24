import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { NotificacionResponseDTO } from '../models/response/NotificacionResponseDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private url = `${base_url}/api/notificaciones`;

  constructor(private http: HttpClient) {}

  listar(usuarioId: number): Observable<NotificacionResponseDTO[]> {
    return this.http.get<NotificacionResponseDTO[]>(
      `${this.url}?usuarioId=${usuarioId}`
    );
  }

  listarLeidas(usuarioId: number): Observable<NotificacionResponseDTO[]> {
    return this.http.get<NotificacionResponseDTO[]>(
      `${this.url}/leidos/?usuarioId=${usuarioId}`
    );
  }

  listarNoLeidas(usuarioId: number): Observable<NotificacionResponseDTO[]> {
    return this.http.get<NotificacionResponseDTO[]>(
      `${this.url}/no-leidos/?usuarioId=${usuarioId}`
    );
  }

  marcarLeida(
    usuarioId: number,
    notificacionId: number
  ): Observable<any> {
    return this.http.put(
      `${this.url}/actualizar-leido/${usuarioId}/${notificacionId}`,
      {}
    );
  }
}