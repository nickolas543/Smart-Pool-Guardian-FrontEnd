import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { UsuarioRequestDTO } from '../models/request/UsuarioRequestDTO';
import { JwtRequestDTO } from '../models/request/JwtRequestDTO';
import { Observable } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private urlUsuarios = `${base_url}/api/usuarios`;

  constructor(private http: HttpClient) {}

  // Mantiene tu registro igual
  insert(u: UsuarioRequestDTO) {
    u.rolId = 1;
    return this.http.post(`${this.urlUsuarios}/registrar`, u);
  }

  login(credentials: JwtRequestDTO): Observable<any> {
    return this.http.post<any>(`${base_url}/login`, credentials);
  }

  obtenerInactivos() {
    return this.http.get<any[]>(`${this.urlUsuarios}/reporte-usuarios-inactivos`);
  }
}
