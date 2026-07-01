import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { SidebarComponent } from './sidebar-component/sidebar-component';
import { NavbarComponent } from './navbar-component/navbar-component';
import { PiscinaService } from '../../services/piscina-service';
import { ActivatedRoute, Router } from '@angular/router';
import { PiscinasPorUsuarioDTO } from "../../models/dtos/PiscinasPorUsuarioDTO"
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard-main',
  imports: [SidebarComponent, NavbarComponent],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css',
})
export class DashboradMain implements OnInit {

  datasource = signal<PiscinasPorUsuarioDTO[]>([]);
  id: number = 0

  constructor(
    private route: ActivatedRoute,
    private pS: PiscinaService
  ) { }

  ngOnInit(): void {

    this.cargarPiscinas();

  }

  private platformId = inject(PLATFORM_ID);

  cargarPiscinas() {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const helper = new JwtHelperService();

    const token = sessionStorage.getItem('token');

    if (!token) return;

    const decodedToken = helper.decodeToken(token);

    this.id = Number(decodedToken.id);

    this.pS.listPiscinas(this.id).subscribe(data => {

      this.datasource.set(data);

    });

  }

}
