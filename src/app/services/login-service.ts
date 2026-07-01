import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { JwtRequestDTO } from '../models/request/JwtRequestDTO';

const base_url = environment.base;

@Injectable({
    providedIn: 'root',
})
export class LoginService {

    private url = `${base_url}/login`;

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    login(request: JwtRequestDTO) {

        return this.http.post(`${this.url}`, request);

    }

    private isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    verificar(): boolean {

        if (!this.isBrowser()) {
            return false;
        }

        const token = sessionStorage.getItem('token');
        return token != null;
    }

    showRole(): string | null {

        if (!this.isBrowser()) {
            return null;
        }

        const token = sessionStorage.getItem('token');

        if (!token) {
            return null;
        }

        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(token);

        return decodedToken.roles;
    }
}