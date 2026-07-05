import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment.development';
import { MedicionDetalleDTO } from '../models/dtos/MedicionDetalleDTO';
import { MedicionDTO } from '../models/dtos/MedicionDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class MedicionService {
  private url = `${base_url}/api/mediciones`;

  constructor(private http:HttpClient){}

  registrar(medicion: MedicionDTO) {
    return this.http.post<MedicionDTO>(`${this.url}/registrar`, medicion);
  }

  obtenerAlertas(idUsuario:number){
    return this.http.get(
      `${this.url}/prediccion-algas/${idUsuario}`, { responseType: 'text' }
    );
  }

  listarPorPiscina(idPiscina: number) {
    return this.http.get<any[]>(`${this.url}/listar/${idPiscina}`);
  }

  obtenerDetalle(idDetalle: number) {
    return this.http.get<MedicionDetalleDTO>(`${this.url}/buscar-id/${idDetalle}`);
  }

  promedioPhPorPiscina() {
    return this.http.get<any[]>(`${this.url}/promedio-nivel-ph-piscina`);
  }

  temperaturasMasAltas() {
    return this.http.get<any[]>(`${this.url}/piscina-con-temperaturas-mas-altas`);
  }

}
