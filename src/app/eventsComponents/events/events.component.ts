import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PermissionsService } from '../../services/permissions.service';
import { Router } from '@angular/router';
import { DialogEventsComponent } from '../dialogEvents/dialog-events.component';
import { EventsDetalleComponent } from '../events-detalles/events-detalle.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  haveedit = true;
  haveadd = true;
  havedelete = true;
  accesData: any;
  mostrarAdicionar = false;
  mostrarDelete = false;
  showEditButton = false;

  // Asegúrate de que los nombres de las columnas coincidan con los datos de eventos
  displayedColumns: string[] = ['nombre', 'fechaRealizacion', 'cantidadParticipantes', 'Acciones'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private router: Router, private permissionsService: PermissionsService, private toast: ToastrService, private api: ApiService) { }

  ngOnInit(): void {
    //this.setAccesPermission();
    this.getAllEvents();  // Obtén eventos después de agregar
  }


  // Función para generar reporte de proyectos
  generateEventsReport(): void {
    // Navegar al componente de reportes pasando un parámetro
    this.router.navigate(['/reports'], { queryParams: { type: 'events' } });
  }

  openDialog(): void {
    if (this.haveadd) {
      this.dialog.open(DialogEventsComponent, {
        width: '50%'
      }).afterClosed().subscribe(val => {
        if (val === 'save') {
          Swal.fire({
            icon: 'success',
            title: 'Evento agregado correctamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
          this.getAllEvents();  // Obtén eventos después de agregar
        }
      });
    } else {
      this.toast.warning('No tienes permisos de agregar');
    }
  }

  getAllEvents() {
    this.api.getAllEvents().subscribe({
      next: (res: any[]) => {
        console.log(res); // Verifica la respuesta
        this.dataSource = new MatTableDataSource(res);  // Cambia res.data a res
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los datos',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      }
    });
  }

  editEvent(row: any) {
    if (this.haveedit) {
      this.dialog.open(DialogEventsComponent, { width: '50%', data: { ...row } }).afterClosed().subscribe(val => {
        if (val === 'update') {
          this.getAllEvents(); // Obtener eventos después de editar
          Swal.fire({
            icon: 'success',
            title: 'Evento actualizado correctamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        }
      });
    } else {
      this.toast.warning('No tienes permiso de editar eventos');
    }
  }

  deleteEvent(id: number) {
    if (this.havedelete) {
      Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea borrar este evento?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.deleteEvents(id).subscribe({
            next: () => {
              Swal.fire('¡Eliminado!', 'El evento ha sido eliminado.', 'success');
              this.getAllEvents(); // Obtener eventos después de eliminar
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error al eliminar el evento',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
              });
            }
          });
        }
      });
    } else {
      this.toast.warning('No tienes permisos para borrar eventos');
    }
  }

  openDetail(row: any): void {
    this.dialog.open(EventsDetalleComponent, {
      width: '60%', // Puedes ajustar el ancho del modal a tu gusto
      data: row
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setAccesPermission() {
    const userRole = this.api.getUserrole();
    const menu = 'eventos'; // Cambia el menú según el componente

    // Llamada al servicio para obtener los permisos
    this.permissionsService.getPermissions().subscribe({
      next: (permissions) => {
        const access = permissions.find(p => p.role === userRole && p.menu === menu);
        if (access) {
          this.haveadd = access.haveadd;
          this.haveedit = access.haveedit;
          this.havedelete = access.havedelete;

          // Actualiza los botones basados en los permisos
          this.updateUIBasedOnPermissions();
          this.getAllEvents();  // Obtener eventos solo si hay permisos
        } else {
          this.toast.error('No tienes acceso a este menú');
          this.router.navigate(['']); // Redireccionar
        }
      },
      error: (err) => {
        console.error('Error al obtener accesos:', err);
      }
    });
  }

  updateUIBasedOnPermissions() {
    this.showEditButton = this.haveedit;
    console.log('Add:', this.haveadd, 'Edit:', this.haveedit, 'Delete:', this.havedelete);
  }
}
