import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-sidebar-component',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent implements OnInit {

  role: string = '';

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token);
    this.role = decoded.roles ?? '';
  }

  isAdmin(): boolean {
    return this.role.includes('ADMIN');
  }

  isDev(): boolean {
    return this.role.includes('DEV');
  }

  isAdminOrDev(): boolean {
    return this.isAdmin() || this.isDev();
  }
}