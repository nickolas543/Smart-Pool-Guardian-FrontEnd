import { Component, OnInit, signal } from '@angular/core';
import { SidebarComponent } from "../dashboard-main/sidebar-component/sidebar-component";
import { NavbarComponent } from "../dashboard-main/navbar-component/navbar-component";
import { RolRequestDTO } from '../../models/request/RolRequestDTO';
import { RolService } from '../../services/rol-service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rol-component',
  imports: [SidebarComponent, NavbarComponent, FormsModule],
  templateUrl: './rol-component.html',
  styleUrl: './rol-component.css',
})
export class RolComponent implements OnInit {

  roles = signal<RolRequestDTO[]>([])
  modalCrearRol = false;
  nuevoRol = '';

  constructor(private rS: RolService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.cargarRoles();

  }

  cargarRoles() {
    this.rS.listar().subscribe({
      next: (data) => {
        this.roles.set(data);
      }
    });
  }

  onCreateRole(): void {
    this.nuevoRol = '';
    this.modalCrearRol = true;
  }

  cerrarModal() {
    this.modalCrearRol = false;
  }

  guardarRol() {

    if (!this.nuevoRol.trim()) return;

    const rol: RolRequestDTO = {
      tipoRol: this.nuevoRol.trim()
    };

    this.rS.crear(rol).subscribe({
      next: () => {
        this.cargarRoles();
        this.cerrarModal();
      }
    });

  }

  

}
