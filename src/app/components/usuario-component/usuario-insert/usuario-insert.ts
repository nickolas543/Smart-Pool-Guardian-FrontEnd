import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioRequestDTO } from '../../../models/request/UsuarioRequestDTO';
import { UsuarioService } from '../../../services/usuario-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-insert',
  imports: [ReactiveFormsModule ],
  templateUrl: './usuario-insert.html',
  styleUrl: './usuario-insert.css',
})
export class UsuarioInsert implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario: UsuarioRequestDTO = new UsuarioRequestDTO();
  mensajeExito: boolean = false;
  constructor(
    private uS: UsuarioService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      contraseña: ['', Validators.required],
      numero: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }
  aceptar() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.usuario.nombreUsuario = this.form.value.nombre;
    this.usuario.email = this.form.value.email;
    this.usuario.password = this.form.value.contraseña;
    this.usuario.numeroCelular = this.form.value.numero;
    this.usuario.rolId = 1;
    this.usuario.activo = true;

    this.uS.insert(this.usuario).subscribe({
      next: (data) => {
        this.router.navigate(["/usuarios/login"])
      },
      error: (e) => {
        console.log(e);
      }
    });
  }
}
