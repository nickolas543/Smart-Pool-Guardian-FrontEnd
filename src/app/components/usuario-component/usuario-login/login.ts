import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario-service';
import { JwtRequestDTO } from '../../../models/request/JwtRequestDTO';

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
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  // Alterna el estado para mostrar u ocultar el texto de la contraseña
  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  // Método para procesar el inicio de sesión con redes sociales
  loginWithSocial(provider: string): void {
    console.log(`Iniciando sesión con la pasarela de: ${provider}`);

    // Aquí API nativa del proveedor
    if (provider === 'Google') {
      // lógica de autenticación de Google de terceros
    } else if (provider === 'Facebook') {
      // lógica de autenticación de Facebook de terceros
    }
  }

  onSubmit(): void {
  if (this.loginForm.valid) {
    const bodyBackend: JwtRequestDTO = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.usuarioService.login(bodyBackend).subscribe({
      next: (response) => {
        const token = response.token; 
        localStorage.setItem('token', token);
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        console.error('Error de autenticación:', err);
        alert('Nombre de usuario o contraseña incorrectos. Por favor, intente de nuevo.');
      }
    });
  }
}
}
