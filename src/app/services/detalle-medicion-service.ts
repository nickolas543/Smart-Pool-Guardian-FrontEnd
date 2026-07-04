import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment.development';
import { MedicionDetalleDTO } from '../models/dtos/MedicionDetalleDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class DetalleMedicionService {
  private url = `${base_url}/api/detalles-medicion`;

  constructor(private http: HttpClient) {}

  registrar(detalle: MedicionDetalleDTO) {
    return this.http.post(`${this.url}/registrar`, detalle);
  }

  // Recibe el id de la medición como path variable.
  buscarPorMedicion(idMedicion: number) {
    return this.http.get<MedicionDetalleDTO>(`${this.url}/buscar-id/${idMedicion}`);
  }
}
