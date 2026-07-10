import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment.development';
import { MedicionDetalleDTO } from '../models/dtos/MedicionDetalleDTO';
import { MedicionDTO } from '../models/dtos/MedicionDTO';
import { MedPorTipoResponseDTO } from '../models/dtos/MedPorTipoResponseDTO';
import { PhResponseDTO } from '../models/dtos/PhResponseDTO';
import { TemperaturaMasAltaResponseDTO } from '../models/dtos/TemperaturaMasAltaResponseDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class MedicionService {
  private url = `${base_url}/api/mediciones`;
  private urlDetalles = `${base_url}/api/detalles-medicion`;

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

  // El endpoint real vive en /api/detalles-medicion
  promedioPhPorPiscina() {
    return this.http.get<PhResponseDTO[]>(`${this.urlDetalles}/promedio-nivel-ph-piscina`);
  }

  // El endpoint real vive en /api/detalles-medicion
  temperaturasMasAltas() {
    return this.http.get<TemperaturaMasAltaResponseDTO[]>(`${this.urlDetalles}/piscina-con-temperaturas-mas-altas`);
  }

  obtenerPorTipoYPiscina(idPiscina: number, tipo: string) {
    return this.http.get<MedPorTipoResponseDTO[]>(
      `${this.url}/obtener-tipo-mediciones-por-piscina/${idPiscina}/${encodeURIComponent(tipo)}`
    );
  }

}
