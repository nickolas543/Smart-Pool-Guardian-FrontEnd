import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PiscinaService } from '../../services/piscina-service';

import { PiscinasPorUsuarioDTO } from '../../models/dtos/PiscinasPorUsuarioDTO';
import { MedicionService } from '../../services/medicion-service';

@Component({
  selector: 'app-piscinas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './piscina-component.html',
  styleUrl: './piscina-component.css'
})
export class PiscinasComponent implements OnInit {

  piscinas: PiscinasPorUsuarioDTO[] = [];
  alertas:any[]=[];

  idUsuario = 1;

  constructor(
    private piscinaService: PiscinaService,
    private medicionService: MedicionService
  ) {}

  ngOnInit(): void {
    this.cargarPiscinas();
    this.cargarAlertas();
  }

  cargarPiscinas() {

    this.piscinaService
      .listar(this.idUsuario)
      .subscribe({
        next: (data) => {

          this.piscinas = data;

          console.log(data);

        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  eliminar(idPiscina:number){

    if(!confirm('¿Eliminar piscina?')){
      return;
    }

    this.piscinaService
      .eliminar(this.idUsuario,idPiscina)
      .subscribe({

        next: () => {

          this.cargarPiscinas();

        },

        error: (err) => {

          console.error(err);

        }
      });

  }
  cargarAlertas(){

  this.medicionService
      .obtenerAlertas(this.idUsuario)
      .subscribe({

        next:(data:any)=>{

          if(Array.isArray(data)){
            this.alertas=data;
          }

        },

        error:(err)=>{

          console.error(err);

        }

      });

}

}