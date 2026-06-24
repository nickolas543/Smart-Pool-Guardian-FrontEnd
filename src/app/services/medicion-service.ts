import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment.development';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class MedicionService {
  private url = `${base_url}/api/mediciones`;

  constructor(private http:HttpClient){}

  obtenerAlertas(idUsuario:number){
    return this.http.get(
      `${this.url}/prediccion-algas/${idUsuario}`, { responseType: 'text' }
    );
  }

}
