import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PiscinaService } from '../../services/piscina-service';

import { PiscinasPorUsuarioDTO } from '../../models/dtos/PiscinasPorUsuarioDTO';
import { MedicionService } from '../../services/medicion-service';
import { NavbarComponent } from "../dashboard-main/navbar-component/navbar-component";
import { SidebarComponent } from "../dashboard-main/sidebar-component/sidebar-component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-piscinas',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './piscina-component.html',
  styleUrl: './piscina-component.css'
})
export class PiscinasComponent implements OnInit {

  piscinas: PiscinasPorUsuarioDTO[] = [];
  alertas:any[]=[];

  idUsuario = 1;

  // Datos de ejemplo para la vista — reemplazar por datos reales del backend.
  ejemplos = [
    {
      estado: 'alerta',
      badge: 'Alerta de temperatura',
      nombre: 'Club Social Norte',
      usuario: 'Admin_Comercial',
      temp: 31.5,
      ph: 7.6,
      cloro: 1.2,
      phWarn: false,
      tiempo: 'Hace 5 min',
    },
    {
      estado: 'optimo',
      badge: 'Óptimo',
      nombre: 'Residencia Silva',
      usuario: 'm.silva89',
      temp: 26.0,
      ph: 7.4,
      cloro: 2.5,
      phWarn: false,
      tiempo: 'Hace 12 min',
    },
    {
      estado: 'atencion',
      badge: 'Atención pH',
      nombre: 'Complejo Deportivo Sur',
      usuario: 'dir_deportes',
      temp: 27.2,
      ph: 8.2,
      cloro: 1.8,
      phWarn: true,
      tiempo: 'Hace 1 hora',
    },
  ];

  // Resumen general (datos de ejemplo).
  resumen = {
    total: 3,
    critico: 1,
    atencion: 1,
  };

  constructor(
    private piscinaService: PiscinaService,
    private route: ActivatedRoute,
    private medicionService: MedicionService
  ) {}

  ngOnInit(): void {
    this.cargarPiscinas();
    this.cargarAlertas();
  }

  cargarPiscinas() {

    this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));

    this.piscinaService.listPiscinas(this.idUsuario).subscribe(data => {

      this.piscinas = data;

    })
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