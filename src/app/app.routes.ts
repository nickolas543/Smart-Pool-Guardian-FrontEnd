import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-pageComponent/landing-pageComponent';
import { UsuarioComponent } from './components/usuario-component/usuario-component';
import { UsuarioInsert } from './components/usuario-component/usuario-insert/usuario-insert';
import { UsuarioLogin } from './components/usuario-component/usuario-login/login';
import { DashboradMain } from './components/dashboard-main/dashboard-main';
import { PiscinasComponent } from './components/piscina-component/piscina-component';
import { NotificacionComponent } from './components/notificacion-component/notificacion-component';
import { MedicionComponent } from './components/medicion-component/medicion-component';
import { GestionUsuarios } from './components/gestion-usuarios/gestion-usuarios';
import { RolComponent } from './components/rol-component/rol-component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    component: LandingPage,
  },
  {
    path: 'dashboard',
    component: DashboradMain
  },
  {
    path: 'piscinas',
    component: PiscinasComponent,
  },
  {
    path: 'notificaciones',
    component: NotificacionComponent,
  },
  {
    path: 'roles',
    component: RolComponent,
  },
  {
    path: 'mediciones',
    component: MedicionComponent,
  },
  {
    path: 'gestionusuarios',
    component: GestionUsuarios
  },
  {
    path: 'usuarios',
    component: UsuarioComponent,
    children: [
      {
        path: 'registrar',
        component: UsuarioInsert,
      },
      {
        path: 'login',
        component: UsuarioLogin,
      },
    ],
  },
];
