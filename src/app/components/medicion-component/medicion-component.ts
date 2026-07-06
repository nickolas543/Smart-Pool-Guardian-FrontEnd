import {
  Component,
  computed,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { distinctUntilChanged } from 'rxjs/operators';

import { NavbarComponent } from '../dashboard-main/navbar-component/navbar-component';
import { SidebarComponent } from '../dashboard-main/sidebar-component/sidebar-component';
import { PiscinaService } from '../../services/piscina-service';
import { MedicionService } from '../../services/medicion-service';
import { DetalleMedicionService } from '../../services/detalle-medicion-service';
import { PiscinasPorUsuarioDTO } from '../../models/dtos/PiscinasPorUsuarioDTO';
import { MedicionDTO } from '../../models/dtos/MedicionDTO';
import { MedicionDetalleDTO } from '../../models/dtos/MedicionDetalleDTO';

interface MedicionItem {
  medicionId: number;
  fechaMedicion: string | Date;
  detalle?: MedicionDetalleDTO;
  cargandoDetalle?: boolean;
}

interface PiscinaHistorial {
  idPiscina: number;
  nombre: string;
  mediciones: MedicionItem[];
}

@Component({
  selector: 'app-medicion-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './medicion-component.html',
  styleUrl: './medicion-component.css',
})
export class MedicionComponent implements OnInit {

  idUsuario = 0;

  piscinas = signal<PiscinasPorUsuarioDTO[]>([]);

  colores = ['Cristalina', 'Verdosa', 'Turbia', 'Lechosa'];
  olores = ['Ninguno', 'Cloro', 'Fétido', 'Moho'];
  tipos = ['Manual', 'IoT Sensor'];

  piscinaHistorial = signal<PiscinaHistorial | null>(null);
  cargandoHistorial = signal(false);

  paginaActual = signal(0);
  readonly tamPagina = 5;

  medicionesPagina = computed<MedicionItem[]>(() => {
    const hist = this.piscinaHistorial();
    if (!hist) return [];
    const inicio = this.paginaActual() * this.tamPagina;
    return hist.mediciones.slice(inicio, inicio + this.tamPagina);
  });

  totalPaginas = computed(() => {
    const hist = this.piscinaHistorial();
    if (!hist) return 0;
    return Math.ceil(hist.mediciones.length / this.tamPagina);
  });

  ultimoDetalle = computed<MedicionDetalleDTO | undefined>(
    () => this.piscinaHistorial()?.mediciones[0]?.detalle
  );

  form: FormGroup;
  enviado = false;
  guardando = signal(false);

  private platformId = inject(PLATFORM_ID);

  constructor(
    private fb: FormBuilder,
    private pS: PiscinaService,
    private mS: MedicionService,
    private dmS: DetalleMedicionService
  ) {
    this.form = this.fb.group({
      idPiscina: [null, Validators.required],
      nivelPh: [7.2, [Validators.required, Validators.min(0), Validators.max(14)]],
      nivelCloro: [1.5, [Validators.required, Validators.min(0), Validators.max(10)]],
      temperatura: [28.5, [Validators.required, Validators.min(0), Validators.max(60)]],
      alcalinidad: [100, [Validators.required, Validators.min(0), Validators.max(500)]],
      nivelTurbidez: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
      durezaCalcio: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
      tieneAlgas: [false],
      colorPiscina: ['Cristalina', Validators.required],
      olor: ['Ninguno', Validators.required],
      tipoMedicion: ['Manual', Validators.required],
    });
  }

  ngOnInit(): void {
    // Evita ejecutar en el prerender/SSR (no hay sessionStorage).
    if (!isPlatformBrowser(this.platformId)) return;

    const helper = new JwtHelperService();
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const decoded = helper.decodeToken(token);
    this.idUsuario = Number(decoded.id);

    // Al cambiar la piscina del dropdown se recarga el historial.
    this.form
      .get('idPiscina')!
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((id) => {
        if (id != null) this.cargarHistorial(Number(id));
      });

    this.cargarPiscinas();
  }

  // ===== Atajos para el template =====
  get f() {
    return this.form.controls;
  }

  invalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.touched || this.enviado);
  }

  // ===== Carga de piscinas =====
  cargarPiscinas(): void {
    this.pS.listPiscinas(this.idUsuario).subscribe({
      next: (data) => {
        this.piscinas.set(data);
        if (data.length) {
          // Dispara valueChanges -> cargarHistorial.
          this.form.patchValue({ idPiscina: data[0].piscinaId });
        }
      },
      error: (err) => console.error('Error al listar piscinas', err),
    });
  }

  // ===== Historial =====
  cargarHistorial(idPiscina: number): void {
    const piscina = this.piscinas().find((p) => p.piscinaId === idPiscina);
    this.cargandoHistorial.set(true);

    this.mS.listarPorPiscina(idPiscina).subscribe({
      next: (lista) => {
        const mediciones: MedicionItem[] = this.ordenarRecientes(lista).map(
          (m) => ({
            medicionId: m.medicionId ?? m.id,
            fechaMedicion: m.fechaMedicion,
          })
        );

        this.piscinaHistorial.set({
          idPiscina,
          nombre: piscina?.nombrePiscina ?? '',
          mediciones,
        });
        this.paginaActual.set(0);
        this.cargandoHistorial.set(false);
        this.cargarDetallesPagina();
      },
      error: (err) => {
        console.error('Error al listar mediciones', err);
        this.cargandoHistorial.set(false);
      },
    });
  }

  // Ordena por fecha (reciente primero); ante empate, por id descendente.
  private ordenarRecientes(lista: any[]): any[] {
    return [...(lista ?? [])].sort((a, b) => {
      const fa = new Date(a.fechaMedicion).getTime();
      const fb = new Date(b.fechaMedicion).getTime();
      if (fb !== fa) return fb - fa;
      return (b.medicionId ?? b.id ?? 0) - (a.medicionId ?? a.id ?? 0);
    });
  }

  private cargarDetallesPagina(): void {
    for (const m of this.medicionesPagina()) {
      if (m.detalle || m.cargandoDetalle) continue;
      m.cargandoDetalle = true;
      this.dmS.buscarPorMedicion(m.medicionId).subscribe({
        next: (detalle) => {
          m.detalle = detalle;
          m.cargandoDetalle = false;
          this.refrescarHistorial();
        },
        error: (err) => {
          console.error('Error al buscar detalle', err);
          m.cargandoDetalle = false;
          this.refrescarHistorial();
        },
      });
    }
  }

  private refrescarHistorial(): void {
    this.piscinaHistorial.update((h) =>
      h ? { ...h, mediciones: [...h.mediciones] } : h
    );
  }

  // ===== Paginación =====
  paginaSiguiente(): void {
    if (this.paginaActual() < this.totalPaginas() - 1) {
      this.paginaActual.update((p) => p + 1);
      this.cargarDetallesPagina();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 0) {
      this.paginaActual.update((p) => p - 1);
      this.cargarDetallesPagina();
    }
  }

  // ===== Estados (tarjetas / tabla) =====
  estadoPh(v?: number): { label: string; cls: string } {
    if (v == null) return { label: '—', cls: 'ok' };
    return v >= 7.2 && v <= 7.8
      ? { label: 'ÓPTIMO', cls: 'ok' }
      : { label: 'REVISAR', cls: 'bad' };
  }

  estadoCloro(v?: number): { label: string; cls: string } {
    if (v == null) return { label: '—', cls: 'ok' };
    if (v < 1) return { label: 'BAJO', cls: 'bad' };
    if (v > 3) return { label: 'ALTO', cls: 'bad' };
    return { label: 'ÓPTIMO', cls: 'ok' };
  }

  estadoTemp(v?: number): { label: string; cls: string } {
    if (v == null) return { label: '—', cls: 'ok' };
    return v >= 24 && v <= 32
      ? { label: 'ÓPTIMO', cls: 'ok' }
      : { label: 'REVISAR', cls: 'bad' };
  }

  // Estado general por fila del historial.
  estadoGeneral(
    d?: MedicionDetalleDTO
  ): { label: string; alerta: boolean; cloroAlerta: boolean } | null {
    if (!d) return null;
    if (d.nivelCloro < 1 || d.nivelCloro > 3)
      return { label: 'Revisar Cloro', alerta: true, cloroAlerta: true };
    if (d.nivelPh < 7.2 || d.nivelPh > 7.8)
      return { label: 'Revisar pH', alerta: true, cloroAlerta: false };
    return { label: 'Óptimo', alerta: false, cloroAlerta: false };
  }

  // ===== Registro =====
  registrar(): void {
    this.enviado = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const idPiscina = Number(this.form.value.idPiscina);
    const medicion: MedicionDTO = {
      fechaMedicion: new Date(),
      idPiscina,
    };

    this.guardando.set(true);

    this.mS.registrar(medicion).subscribe({
      next: (creada) => {
        const idMedicion = creada?.medicionId ?? (creada as any)?.id;

        if (idMedicion != null) {

          this.registrarDetalle(idPiscina, idMedicion);
        } else {

          this.recuperarUltimaYRegistrarDetalle(idPiscina);
        }
      },
      error: (err) => {
        console.error('Error al registrar la medición', err);
        this.guardando.set(false);
      },
    });
  }


  private registrarDetalle(idPiscina: number, idMedicion: number): void {
    const detalle: MedicionDetalleDTO = {
      nivelCloro: this.form.value.nivelCloro,
      nivelPh: this.form.value.nivelPh,
      temperatura: this.form.value.temperatura,
      nivelTurbidez: this.form.value.nivelTurbidez,
      alcalinidad: this.form.value.alcalinidad,
      durezaCalcio: this.form.value.durezaCalcio,
      tieneAlgas: this.form.value.tieneAlgas,
      colorPiscina: this.form.value.colorPiscina,
      olor: this.form.value.olor,
      tipoMedicion: this.form.value.tipoMedicion,
      medicionId: idMedicion,
    };

    this.dmS.registrar(detalle).subscribe({
      next: () => {
        this.guardando.set(false);
        this.resetForm(idPiscina);
        this.cargarHistorial(idPiscina);
      },
      error: (err) => {
        console.error('Error al registrar el detalle', err);
        this.guardando.set(false);
      },
    });
  }

  // Respaldo por si el registro no devolviera el id: toma la medición más reciente.
  private recuperarUltimaYRegistrarDetalle(idPiscina: number): void {
    this.mS.listarPorPiscina(idPiscina).subscribe({
      next: (lista) => {
        const ultima = this.ordenarRecientes(lista)[0];
        const idMedicion = ultima?.medicionId ?? ultima?.id;

        if (idMedicion == null) {
          console.error('No se pudo obtener el id de la medición registrada');
          this.guardando.set(false);
          return;
        }
        this.registrarDetalle(idPiscina, idMedicion);
      },
      error: (err) => {
        console.error('Error al recuperar la medición registrada', err);
        this.guardando.set(false);
      },
    });
  }

  private resetForm(idPiscina: number): void {
    this.enviado = false;
    this.form.reset({
      idPiscina,
      nivelPh: null,
      nivelCloro: null,
      temperatura: null,
      alcalinidad: null,
      nivelTurbidez: null,
      durezaCalcio: null,
      tieneAlgas: false,
      colorPiscina: 'Cristalina',
      olor: 'Ninguno',
      tipoMedicion: 'Manual',
    });
  }
}
