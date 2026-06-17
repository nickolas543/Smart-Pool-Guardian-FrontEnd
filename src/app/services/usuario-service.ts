import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { UsuarioRequestDTO } from '../models/request/UsuarioRequestDTO';
const base_url = environment.base;
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = `${base_url}/api/usuarios`

  constructor(private http: HttpClient){}

  insert(u: UsuarioRequestDTO){
    u.rolId = 1;
    return this.http.post(`${this.url}/registrar`, u);
  }

}
