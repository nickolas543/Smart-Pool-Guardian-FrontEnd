import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from "../dashboard-main/sidebar-component/sidebar-component";
import { NavbarComponent } from "../dashboard-main/navbar-component/navbar-component";

import { UsuarioService } from '../../services/usuario-service';
import { MedicionService } from '../../services/medicion-service';
import { EvaluacionService } from '../../services/evaluacion-service';
import { RecomendacionService } from '../../services/recomendacion-service';
import { PiscinaService } from '../../services/piscina-service';

import { UsuariosInactivosDTO } from '../../models/dtos/UsuariosInactivosDTO';
import { PhResponseDTO } from '../../models/dtos/PhResponseDTO';
import { TemperaturaMasAltaResponseDTO } from '../../models/dtos/TemperaturaMasAltaResponseDTO';
import { RecoCriticaResponseDTO } from '../../models/dtos/RecoCriticaResponseDTO';
import { EvaluacionPorFiltroDTO } from '../../models/dtos/EvaluacionPorFiltroDTO';
import { MedPorTipoResponseDTO } from '../../models/dtos/MedPorTipoResponseDTO';
import { PrediccionAlgasDTO } from '../../models/dtos/PrediccionAlgasDTO';
import { UsuarioListadoDTO } from '../../models/dtos/UsuarioListadoDTO';
import { PiscinasPorUsuarioDTO } from '../../models/dtos/PiscinasPorUsuarioDTO';

type ReporteId =
  | 'inactivos'
  | 'ph'
  | 'temperaturas'
  | 'criticas'
  | 'evaluacion'
  | 'medicionesTipo'
  | 'algas';

@Component({
  selector: 'app-reporte-component',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NavbarComponent],
  templateUrl: './reporte-component.html',
  styleUrl: './reporte-component.css',
})
export class ReporteComponent implements OnInit {

  // Pestañas de la parte superior. `filtro` indica si el reporte requiere
  // parámetros antes de consultar (no se autocargan al abrir la pestaña).
  readonly reportes: { id: ReporteId; label: string; desc: string; filtro: boolean }[] = [
    { id: 'inactivos', label: 'Usuarios Inactivos', desc: 'Usuarios sin actividad reciente en sus mediciones.', filtro: false },
    { id: 'ph', label: 'Promedio de PH', desc: 'Promedio del nivel de PH registrado por piscina.', filtro: false },
    { id: 'temperaturas', label: 'Temperaturas más Altas', desc: 'Piscinas con las temperaturas máximas registradas.', filtro: false },
    { id: 'criticas', label: 'Recomendaciones Críticas', desc: 'Recomendaciones asociadas a evaluaciones en estado crítico.', filtro: false },
    { id: 'evaluacion', label: 'Evaluaciones por Filtro', desc: 'Evaluaciones filtradas por estado general y fecha.', filtro: true },
    { id: 'medicionesTipo', label: 'Mediciones por Tipo', desc: 'Mediciones de un tipo específico para una piscina.', filtro: true },
    { id: 'algas', label: 'Predicción de Algas', desc: 'Riesgo de proliferación de algas en las piscinas de un usuario.', filtro: true },
  ];

  reporteActivo = signal<ReporteId>('inactivos');
  cargando = signal(false);

  reporteInfo = computed(() =>
    this.reportes.find((r) => r.id === this.reporteActivo())!
  );

  // ===== Datos por reporte =====
  inactivos = signal<UsuariosInactivosDTO[]>([]);
  ph = signal<PhResponseDTO[]>([]);
  temperaturas = signal<TemperaturaMasAltaResponseDTO[]>([]);
  criticas = signal<RecoCriticaResponseDTO[]>([]);
  evaluaciones = signal<EvaluacionPorFiltroDTO[]>([]);
  medicionesTipo = signal<MedPorTipoResponseDTO[]>([]);
  algas = signal<PrediccionAlgasDTO[]>([]);
  algasMensaje = signal<string>(''); // texto devuelto cuando no hay riesgo

  // Reportes sin filtro que ya se cargaron (para no repetir la llamada).
  private cargados = new Set<ReporteId>();

  // ===== Filtros: Evaluaciones =====
  filtroEstado = signal('');
  filtroFecha = signal('');

  // ===== Filtros: Mediciones por tipo / Predicción de algas =====
  usuarios = signal<UsuarioListadoDTO[]>([]);
  piscinasUsuario = signal<PiscinasPorUsuarioDTO[]>([]);
  selUsuarioMed = signal<number | null>(null);
  selPiscinaMed = signal<number | null>(null);
  filtroTipo = signal('');
  selUsuarioAlgas = signal<number | null>(null);

  // ===== Paginación (opera sobre el reporte activo) =====
  paginaActual = signal(0);
  readonly tamPagina = 5;

  datosActivos = computed<any[]>(() => {
    switch (this.reporteActivo()) {
      case 'inactivos': return this.inactivos();
      case 'ph': return this.ph();
      case 'temperaturas': return this.temperaturas();
      case 'criticas': return this.criticas();
      case 'evaluacion': return this.evaluaciones();
      case 'medicionesTipo': return this.medicionesTipo();
      case 'algas': return this.algas();
      default: return [];
    }
  });

  datosPagina = computed<any[]>(() => {
    const datos = this.datosActivos();
    const inicio = this.paginaActual() * this.tamPagina;
    return datos.slice(inicio, inicio + this.tamPagina);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.datosActivos().length / this.tamPagina)
  );

  constructor(
    private uS: UsuarioService,
    private mS: MedicionService,
    private eS: EvaluacionService,
    private rS: RecomendacionService,
    private pS: PiscinaService
  ) {}

  ngOnInit(): void {
    this.seleccionarReporte('inactivos');
    this.cargarUsuarios();
  }

  // ===== Navegación entre reportes =====
  seleccionarReporte(id: ReporteId): void {
    this.reporteActivo.set(id);
    this.paginaActual.set(0);

    // Los reportes sin filtro se cargan la primera vez que se abren.
    if (this.cargados.has(id)) return;
    switch (id) {
      case 'inactivos': this.cargarInactivos(); break;
      case 'ph': this.cargarPh(); break;
      case 'temperaturas': this.cargarTemperaturas(); break;
      case 'criticas': this.cargarCriticas(); break;
    }
  }

  private marcarCargado(id: ReporteId): void {
    this.cargados.add(id);
  }

  // ===== Cargas sin filtro =====
  cargarInactivos(): void {
    this.cargando.set(true);
    this.uS.obtenerInactivos().subscribe({
      next: (data) => {
        this.inactivos.set(data);
        this.marcarCargado('inactivos');
        this.paginaActual.set(0);
        this.cargando.set(false);
      },
      error: (err) => this.onError('usuarios inactivos', err),
    });
  }

  cargarPh(): void {
    this.cargando.set(true);
    this.mS.promedioPhPorPiscina().subscribe({
      next: (data) => {
        this.ph.set(data);
        this.marcarCargado('ph');
        this.paginaActual.set(0);
        this.cargando.set(false);
      },
      error: (err) => this.onError('promedio de PH', err),
    });
  }

  cargarTemperaturas(): void {
    this.cargando.set(true);
    this.mS.temperaturasMasAltas().subscribe({
      next: (data) => {
        this.temperaturas.set(data);
        this.marcarCargado('temperaturas');
        this.paginaActual.set(0);
        this.cargando.set(false);
      },
      error: (err) => this.onError('temperaturas más altas', err),
    });
  }

  cargarCriticas(): void {
    this.cargando.set(true);
    this.rS.porEvaluacionesCriticas().subscribe({
      next: (data) => {
        this.criticas.set(data);
        this.marcarCargado('criticas');
        this.paginaActual.set(0);
        this.cargando.set(false);
      },
      error: (err) => this.onError('recomendaciones críticas', err),
    });
  }

  // ===== Selects (usuarios / piscinas) =====
  cargarUsuarios(): void {
    this.uS.listar().subscribe({
      next: (data) => this.usuarios.set(data as UsuarioListadoDTO[]),
      error: (err) => console.error('Error al listar usuarios', err),
    });
  }

  onUsuarioMedChange(idUsuario: number | null): void {
    this.selUsuarioMed.set(idUsuario);
    this.selPiscinaMed.set(null);
    this.piscinasUsuario.set([]);
    if (idUsuario == null) return;
    this.pS.listPiscinas(idUsuario).subscribe({
      next: (data) => this.piscinasUsuario.set(data),
      error: (err) => console.error('Error al listar piscinas', err),
    });
  }

  // ===== Reportes con filtro =====
  consultarEvaluacion(): void {
    const estado = this.filtroEstado().trim();
    const fecha = this.filtroFecha();
    if (!estado || !fecha) return;

    this.cargando.set(true);
    this.eS.filtrar(estado, fecha).subscribe({
      next: (data) => {
        this.evaluaciones.set(data);
        this.paginaActual.set(0);
        this.cargando.set(false);
      },
      error: (err) => this.onError('evaluaciones por filtro', err),
    });
  }

  consultarMediciones(): void {
    const idPiscina = this.selPiscinaMed();
    const tipo = this.filtroTipo().trim();
    if (idPiscina == null || !tipo) return;

    this.cargando.set(true);
    this.mS.obtenerPorTipoYPiscina(idPiscina, tipo).subscribe({
      next: (data) => {
        this.medicionesTipo.set(data);
        this.paginaActual.set(0);
        this.cargando.set(false);
      },
      error: (err) => this.onError('mediciones por tipo', err),
    });
  }

  consultarAlgas(): void {
    const idUsuario = this.selUsuarioAlgas();
    if (idUsuario == null) return;

    this.cargando.set(true);
    this.algas.set([]);
    this.algasMensaje.set('');
    // El endpoint devuelve JSON (array) cuando hay riesgo, o texto plano si no.
    this.mS.obtenerAlertas(idUsuario).subscribe({
      next: (texto) => {
        try {
          const parsed = JSON.parse(texto);
          if (Array.isArray(parsed)) {
            this.algas.set(parsed as PrediccionAlgasDTO[]);
          } else {
            this.algasMensaje.set(texto);
          }
        } catch {
          this.algasMensaje.set(texto);
        }
        this.paginaActual.set(0);
        this.cargando.set(false);
      },
      error: (err) => this.onError('predicción de algas', err),
    });
  }

  private onError(nombre: string, err: unknown): void {
    console.error(`Error al cargar ${nombre}`, err);
    this.cargando.set(false);
  }

  // ===== Paginación =====
  paginaSiguiente(): void {
    if (this.paginaActual() < this.totalPaginas() - 1) {
      this.paginaActual.update((p) => p + 1);
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 0) {
      this.paginaActual.update((p) => p - 1);
    }
  }
}
