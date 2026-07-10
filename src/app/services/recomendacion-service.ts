import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { RecoCriticaResponseDTO } from '../models/dtos/RecoCriticaResponseDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RecomendacionService {

  private url = `${base_url}/api/recomendaciones`;

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<any[]>(`${this.url}`);
  }

  porEvaluacionesCriticas() {
    return this.http.get<RecoCriticaResponseDTO[]>(`${this.url}/recomendaciones-por-evaluaciones-criticas/`);
  }

  porPiscina(piscinaId: number) {
    return this.http.get<string>(`${this.url}/piscina/${piscinaId}`, {
      responseType: 'text' as 'json'
    });
  }
  
}
