import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class EvaluacionService {

   private url = `${base_url}/api/evaluacion`;

  constructor(private http: HttpClient) {}

  filtrar(estadoG: string, fecha: string) {
    return this.http.get<any[]>(`${this.url}/evaluacion-filtro/${estadoG}/${fecha}`);
  }
  
}
