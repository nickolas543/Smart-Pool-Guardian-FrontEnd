import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { EvaluacionPorFiltroDTO } from '../models/dtos/EvaluacionPorFiltroDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class EvaluacionService {

   private url = `${base_url}/api/evaluacion`;

  constructor(private http: HttpClient) {}

  filtrar(estadoG: string, fecha: string) {
    return this.http.get<EvaluacionPorFiltroDTO[]>(
      `${this.url}/evaluacion-filtro/${encodeURIComponent(estadoG)}/${fecha}`
    );
  }

}
