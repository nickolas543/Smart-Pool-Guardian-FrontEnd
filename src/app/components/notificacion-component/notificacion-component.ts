import { NavbarComponent } from './../dashboard-main/navbar-component/navbar-component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../dashboard-main/sidebar-component/sidebar-component';


type NotificationType = 'critical' | 'warning' | 'info';

interface NotificationTag {
  icon: string;
  label: string;
  variant: 'neutral' | 'critical' | 'warning' | 'info';
}

interface PoolNotification {
  id: number;
  type: NotificationType;
  read: boolean;
  icon: string;
  title: string;
  message: string;
  messageHighlight?: string;
  time: string;
  tags: NotificationTag[];
  link?: { label: string; url: string };
}

@Component({
  selector: 'app-notificacion',
  standalone: true,
  imports: [CommonModule,SidebarComponent,NavbarComponent],
  templateUrl: './notificacion-component.html'
})
export class NotificacionComponent implements OnInit {

  dateFilters = ['Todas las fechas', 'Hoy', 'Últimos 7 días', 'Este mes'];
  statusFilters = ['Todos los estados', 'No leídas', 'Leídas'];
  typeFilters = ['Todos los tipos', 'Crítico', 'Advertencia', 'Informativo'];

  notifications: PoolNotification[] = [
    {
      id: 1,
      type: 'critical',
      read: false,
      icon: 'warning',
      title: 'Niveles de Cloro Críticos',
      message: 'ha caído por debajo de 1.0 ppm. Se requiere acción inmediata para evitar contaminación.',
      messageHighlight: 'Piscina Principal (Hotel Del Mar)',
      time: 'Hace 10 min',
      tags: [
        { icon: 'pool', label: 'Piscina Principal', variant: 'neutral' },
        { icon: 'science', label: 'Química', variant: 'critical' }
      ]
    },
    {
      id: 2,
      type: 'warning',
      read: false,
      icon: 'water_pump',
      title: 'Presión de Filtro Alta',
      message: 'La presión en el filtro principal ha aumentado un 15% sobre el nivel basal. Se recomienda programar un retrolavado pronto.',
      time: 'Hace 2 horas',
      tags: [
        { icon: 'pool', label: 'Piscina Infantil', variant: 'neutral' },
        { icon: 'build', label: 'Hardware', variant: 'warning' }
      ]
    },
    {
      id: 3,
      type: 'info',
      read: true,
      icon: 'info',
      title: 'Evaluación IA Completada',
      message: 'El reporte semanal de eficiencia energética y química ha sido generado por el sistema IA. Ya está disponible en la sección de Evaluaciones.',
      time: 'Ayer, 18:30',
      tags: [
        { icon: 'psychology', label: 'IA Sistema', variant: 'info' }
      ],
      link: { label: 'Ver Reporte', url: '#' }
    }
  ];

  ngOnInit(): void {
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  markAsRead(notification: PoolNotification): void {
    notification.read = true;
  }
}
