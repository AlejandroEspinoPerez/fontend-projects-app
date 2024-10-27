import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DialogTaskComponent } from '../../taskCompnents/dialog-task/dialog-task.component'; // Cambiado a Task
import { TaskDetalleComponent } from '../../taskCompnents/task-detalles/task-detalle.component'; // Cambiado a Task
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'app-tasks', // Cambiado a 'app-tasks'
  templateUrl: './task.component.html', // Asegúrate que el nombre del archivo esté correcto
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  haveedit = false;
  haveadd = false;
  havedelete = false;
  accesData: any;
  displayedColumns: string[] = ['nombre', 'descripcion', 'fechaInicio', 'fechaFin', 'responsable', 'Acciones'];
  dataSource!: MatTableDataSource<any>;
  activityId: string; // Cambiado a activityId
  activityName: string = ''; // Cambiado a activityName

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private toast: ToastrService,
    private api: ApiService,
    private permissionsService: PermissionsService,
    private route: ActivatedRoute
  ) {
    // Obtener el ID de la actividad desde los parámetros de la ruta
    this.activityId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.setAccesPermission();
    if (this.activityId) {
      this.getActivityName(this.activityId);  // Obtener el nombre de la actividad
      this.getTasksByActivity(this.activityId);  // Obtener tareas de la actividad
    }
  }

  // Método para obtener el nombre de la actividad por ID
  getActivityName(id: string) {
    this.api.getActivityById(Number(id)).subscribe(activity => {
      this.activityName = activity.nombre;
    });
  }

  // Método para obtener las tareas por ID de actividad
  getTasksByActivity(activityId: string) {
    this.api.getTaskByActivityId(Number(activityId)).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
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

  openDialog(): void {
    if (this.haveadd) {
      this.dialog.open(DialogTaskComponent, {
        width: '50%',
        data: {
          idActividad: this.activityId, // Pasar el ID de la actividad
          nombreActividad: this.activityName // Pasar el nombre de la actividad
        }
      }).afterClosed().subscribe(val => {
        if (val === 'save') {
          Swal.fire({
            icon: 'success',
            title: 'Tarea agregada correctamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
          this.getTasksByActivity(this.activityId); // Refrescar la lista de tareas de la actividad
        }
      });
    } else {
      this.toast.warning('No tienes permisos para agregar');
    }
  }

  editTask(row: any) {
    if (this.haveedit) {
      // Verifica que row.id sea el ID de la tarea y no un objeto
      this.dialog.open(DialogTaskComponent, {
        width: '50%',
        data: row // Aquí deberías estar enviando un objeto que contenga el id de la tarea
      }).afterClosed().subscribe(val => {
        if (val === 'update') {
          this.getTasksByActivity(this.activityId);
        }
      });
    } else {
      this.toast.warning('No tienes permisos para editar tareas');
    }
  }


  deleteTask(id: number) {
    if (this.havedelete) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Desea borrar esta tarea",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, bórralo',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.deleteTask(id).subscribe({
            next: () => {
              Swal.fire('Borrado!', 'La tarea ha sido eliminada.', 'success');
              this.getTasksByActivity(this.activityId);
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error al borrar los datos',
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
      this.toast.warning('No tienes permisos para borrar tareas');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDetail(row: any): void {
    this.dialog.open(TaskDetalleComponent, {
      width: '60%',
      data: row
    });
  }

  setAccesPermission() {
    const userRole = this.api.getUserrole(); // Obtener rol del usuario
    console.log(userRole);

    // Llamada al servicio para obtener los permisos por rol
    this.permissionsService.getPermissionsByRole(userRole).subscribe({
      next: (permissions) => {
        if (permissions.projects) {
          this.haveadd = permissions.tasks.add;
          this.haveedit = permissions.tasks.edit;
          this.havedelete = permissions.tasks.delete;
          // Actualiza la UI según los permisos obtenidos
          this.getTasksByActivity(this.activityId);  // Obtener actividades del proyecto
        } else {
          this.toast.error('No tienes acceso a este módulo');
          this.router.navigate(['']); // Redireccionar si no hay acceso
        }
      },
      error: (err) => {
        console.error('Error al obtener permisos:', err);
      }
    });
  }
}
