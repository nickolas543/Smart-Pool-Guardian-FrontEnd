import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.development';

import { PiscinasPorUsuarioDTO } from '../models/dtos/PiscinasPorUsuarioDTO';
import { PiscinaRequestDTO } from '../models/request/PiscinaRequestDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class PiscinaService {

  private url = `${base_url}/api/piscinas`;

  constructor(private http: HttpClient) {}

  registrar(
      idUsuario:number,
      piscina:PiscinaRequestDTO
  ){
    return this.http.post(
      `${this.url}/registrar/${idUsuario}`,
      piscina
    );
  }

  actualizar(
      idUsuario:number,
      idPiscina:number,
      piscina:PiscinaRequestDTO
  ){
    return this.http.put(
      `${this.url}/${idUsuario}/${idPiscina}`,
      piscina
    );
  }

  eliminar(
      idUsuario:number,
      idPiscina:number
  ){
    return this.http.delete(
      `${this.url}/${idUsuario}/${idPiscina}`
    );
  }

  listPiscinas(idUsuario: number) {
    return this.http.get<PiscinasPorUsuarioDTO[]>(`${this.url}/listar`, {
      params: {
        idUsuario: idUsuario.toString()
      }
    });
  }
}
