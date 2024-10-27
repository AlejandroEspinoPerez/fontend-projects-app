import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  Inject,
} from '@angular/core';
import { navbarData } from './nav-data';
import { ApiService } from '../services/api.service';
import { DOCUMENT } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { PermissionsService } from '../services/permissions.service';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class SidenavComponent implements OnInit {
  isdarkThemeActive = false;
  isAdmin = false;
  events = false;
  reports = false;
  calendar = false;
  projects = true;


  constructor(
    private service: ApiService,
    private permissionsService: PermissionsService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  isadminuser = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

      if (this.service.getUserrole() == 'admin') {
        this.isAdmin = true;
    }
    this.setAccessPermission(); 
  }


  setAccessPermission() {
    const userRole = this.service.getUserrole(); // Obtener rol del usuario
    console.log('Rol del usuario:', userRole);

    // Llamada al servicio para obtener los permisos por rol
    this.permissionsService.getPermissionsByRole(userRole).subscribe({
      next: (permissions) => {
        console.log('Permisos recibidos:', permissions);
        // Acceder a los permisos en función del rol
        if (permissions) {
          this.calendar = permissions.calendar?.view || false;
          this.events = permissions.events?.view || false;
          this.projects = permissions.projects?.view || false;
          this.reports = permissions.reports?.view || false;

          console.log('Permisos establecidos:');
          console.log('Calendar:', this.calendar);
          console.log('Events:', this.events);
          console.log('Projects:', this.projects);
          console.log('Reports:', this.reports);
        } else {
          console.warn('No se encontraron permisos para el rol:', userRole);
        }
      },
      error: (err) => {
        console.error('Error al obtener permisos:', err);
      }
    });
  }


  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  name = 'Oscuro';
  color = '# 4527a0';

  onChange(newValue: boolean): void {
    console.log(newValue);
    if (newValue) {
      this.document.body.classList.add('dark-mode');
      this.name = 'Oscuro';
    } else {
      this.document.body.classList.remove('dark-mode');
      this.name = 'Claro';
    }
  }
}
