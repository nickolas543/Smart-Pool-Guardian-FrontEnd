import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JwtRequestDTO } from '../../../models/request/JwtRequestDTO';
import { LoginService } from '../../../services/login-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class UsuarioLogin implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;

  @ViewChild('loginCard', { static: false }) loginCard!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private lS: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // Alterna el estado para mostrar u ocultar el texto de la contraseña
  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  /* Método para procesar el inicio de sesión con redes sociales
  loginWithSocial(provider: string): void {
    console.log(`Iniciando sesión con la pasarela de: ${provider}`);

    // Aquí API nativa del proveedor
    if (provider === 'Google') {
      // lógica de autenticación de Google de terceros
    } else if (provider === 'Facebook') {
      // lógica de autenticación de Facebook de terceros
    }
  }

  */

  onSubmit(): void {
  if (this.loginForm.valid) {

    let request: JwtRequestDTO = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.lS.login(request).subscribe({
      next: (response: any) => {

        sessionStorage.setItem('token', response.jwttoken);
        this.router.navigate(['/dashboard']); 
        
      },

      error: (error) => {
        console.log(error);

        if (error.status === 401) {

          alert('Credenciales incorrectas. Por favor, verifique su correo electrónico y contraseña.');

        } else {

          alert('Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.');

        }
      }
    });
  }
}
}
