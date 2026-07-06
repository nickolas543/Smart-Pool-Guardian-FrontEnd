import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { RolRequestDTO } from '../models/request/RolRequestDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RolService {
  
  private url = `${base_url}/api/roles`;

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<RolRequestDTO[]>(`${this.url}/listar`);
  }

  crear(rol: RolRequestDTO) {
    return this.http.post<RolRequestDTO>(`${this.url}/registrar`, rol);
  }

}
