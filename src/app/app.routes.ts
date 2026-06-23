import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-pageComponent/landing-pageComponent';
import { UsuarioComponent } from './components/usuario-component/usuario-component';
import { UsuarioInsert } from './components/usuario-component/usuario-insert/usuario-insert';
import { UsuarioLogin } from './components/usuario-component/usuario-login/login';
import { DashboradMain } from './components/dashboard-main/dashboard-main';

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
    component: DashboradMain,
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
