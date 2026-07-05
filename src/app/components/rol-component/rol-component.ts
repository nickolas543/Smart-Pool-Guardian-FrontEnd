import { Component } from '@angular/core';
import { SidebarComponent } from "../dashboard-main/sidebar-component/sidebar-component";
import { NavbarComponent } from "../dashboard-main/navbar-component/navbar-component";

interface Permission {
  label: string;
  granted: boolean;
}
 
interface RoleUser {
  initials: string;
  color: string;
}
 
interface Role {
  id: number;
  name: string;
  description: string;
  users: RoleUser[];
  permissions: Permission[];
}
 
interface AppUser {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-rol-component',
  imports: [SidebarComponent, NavbarComponent],
  templateUrl: './rol-component.html',
  styleUrl: './rol-component.css',
})
export class RolComponent {
  selectedRoleId: number | null = null;
  selectedRole: Role | null = null;
 
  assignForm: { userId: number | null; roleId: number | null } = {
    userId: null,
    roleId: null,
  };
 
  defaultPermissions: Permission[] = [
    { label: 'Lectura de Sensores', granted: true },
    { label: 'Calibración de Equipos', granted: false },
    { label: 'Gestión de Usuarios', granted: false },
    { label: 'Exportación de Reportes', granted: true },
  ];
 
  users: AppUser[] = [
    { id: 1, name: 'Carlos Mendoza', email: 'carlos@pool.com' },
    { id: 2, name: 'Ana Torres', email: 'ana@pool.com' },
  ];
 
  roles: Role[] = [
    {
      id: 1,
      name: 'Administrador',
      description: 'Acceso total al sistema y configuraciones.',
      users: [
        { initials: 'JD', color: '#d2e4ff' },
        { initials: 'AM', color: '#dbe3f3' },
      ],
      permissions: [
        { label: 'Lectura de Sensores', granted: true },
        { label: 'Calibración de Equipos', granted: true },
        { label: 'Gestión de Usuarios', granted: true },
        { label: 'Exportación de Reportes', granted: true },
      ],
    },
    {
      id: 2,
      name: 'Operador de Planta',
      description: 'Gestión de piscinas, mediciones y reportes básicos.',
      users: [
        { initials: '5+', color: '#49607e' },
      ],
      permissions: [
        { label: 'Lectura de Sensores', granted: true },
        { label: 'Calibración de Equipos', granted: true },
        { label: 'Gestión de Usuarios', granted: false },
        { label: 'Exportación de Reportes', granted: true },
      ],
    },
    {
      id: 3,
      name: 'Analista Químico',
      description: 'Lectura de datos, evaluaciones IA y alertas.',
      users: [
        { initials: 'LC', color: '#ae835a' },
      ],
      permissions: [
        { label: 'Lectura de Sensores', granted: true },
        { label: 'Calibración de Equipos', granted: false },
        { label: 'Gestión de Usuarios', granted: false },
        { label: 'Exportación de Reportes', granted: true },
      ],
    },
    {
      id: 4,
      name: 'Solo Lectura',
      description: 'Visualización de dashboards sin permisos de edición.',
      users: [],
      permissions: [
        { label: 'Lectura de Sensores', granted: true },
        { label: 'Calibración de Equipos', granted: false },
        { label: 'Gestión de Usuarios', granted: false },
        { label: 'Exportación de Reportes', granted: false },
      ],
    },
  ];
 
  selectRole(role: Role): void {
    this.selectedRoleId = role.id;
    this.selectedRole = role;
  }
 
  onEditRole(role: Role, event: Event): void {
    event.stopPropagation();
    // TODO: abrir modal / navegar a edición de rol
  }
 
  onCreateRole(): void {
    // TODO: abrir modal / navegar a creación de rol
  }
 
  onAssignRole(): void {
    // TODO: llamar al servicio para asignar el rol seleccionado al usuario
  }
}
