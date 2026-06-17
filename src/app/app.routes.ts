import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-pageComponent/landing-pageComponent';
import { UsuarioComponent } from './components/usuario-component/usuario-component';
import { UsuarioInsert } from './components/usuario-component/usuario-insert/usuario-insert';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full'
    },
    {
        path: 'landing',
        component: LandingPage
    },
    {
        path: 'usuarios',
        component: UsuarioComponent,
        children:[
            {
                path: 'registrar',
                component: UsuarioInsert
            }
        ]
    }
];
