import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioRequestDTO } from '../../../models/request/UsuarioRequestDTO';
import { UsuarioService } from '../../../services/usuario-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-insert',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-insert.html',
  styleUrl: './usuario-insert.css',
})
export class UsuarioInsert implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario: UsuarioRequestDTO = new UsuarioRequestDTO();

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
    });
  }
  aceptar() {
    if (this.form.valid) {
      this.usuario.nombreUsuario = this.form.value.nombre;
      this.usuario.email = this.form.value.email;
      this.usuario.password = this.form.value.contraseña;
      this.usuario.numeroCelular = this.form.value.numero;
      this.usuario.rolId = 1;
      this.uS.insert(this.usuario).subscribe({
        next: () => {
          this.router.navigate(['/usuarios/registrar']);
        },
      });
    }
  }
}
