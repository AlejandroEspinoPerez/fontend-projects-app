import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DialogActivitiesComponent } from '../../activitiesComponents/dialog-activities/dialog-activities.component';
import { ActivitiesDetalleComponent } from '../../activitiesComponents/activities-detalles/activities-detalle.component';
import { PermissionsService } from '../../services/permissions.service';
import { DialogTaskComponent } from 'src/app/taskCompnents/dialog-task/dialog-task.component';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  haveedit = false;
  haveadd = false;
  havedelete = false;
  accesData: any;
  displayedColumns: string[] = ['nombre', 'descripcion', 'fechaInicio', 'fechaFin', 'responsable', 'Acciones'];
  dataSource!: MatTableDataSource<any>;
  projectId: string; // Variable para almacenar el ID del proyecto
  projectName: string = ''; // Inicialización
  generateReport = false;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private toast: ToastrService,
    private api: ApiService,
    private permissionsService: PermissionsService,
    private route: ActivatedRoute // Inyectar ActivatedRoute
  ) {

    // Obtener el ID del proyecto desde los parámetros de la ruta
    this.projectId = this.route.snapshot.params['id'];

  }

  ngOnInit() {
    this.setAccesPermission();
    if (this.projectId) {
      this.getProjectName(this.projectId);  // Obtener el nombre del proyecto
    }

  }

  // Método para obtener el nombre del proyecto por ID (ajusta según tu servicio)
  getProjectName(id: string) {
    this.api.getProjectById(Number(id)).subscribe(project => {
      this.projectName = project.nombre;
    });
  }

  // Método para obtener las actividades por ID de proyecto
  getActivitiesByProject(projectId: string) {
    this.api.getActivitiesByProjectId(Number(projectId)).subscribe({
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

  // getAllActivities() {
  //   this.api.getAllActivities().subscribe({
  //     next: (res) => {
  //       this.dataSource = new MatTableDataSource(res);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     },
  //     error: () => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error al obtener los datos',
  //         toast: true,
  //         position: 'top-end',
  //         showConfirmButton: false,
  //         timer: 3000,
  //         timerProgressBar: true
  //       });
  //     }
  //   });
  // }


  openDialog(): void {
    if (this.haveadd) {
      this.dialog.open(DialogActivitiesComponent, {
        data: { projectId: this.projectId, projectName: this.projectName } // Pasar projectId y projectName
      }).afterClosed().subscribe(val => {
        if (val === 'save') {
          Swal.fire({
            icon: 'success',
            title: 'Actividad agregada correctamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
          this.getActivitiesByProject(this.projectId);
        }
      });
    } else {
      this.toast.warning('No tienes permisos para agregar');
    }
  }




  editActivity(row: any) {
    if (this.haveedit) {
      this.dialog.open(DialogActivitiesComponent, { width: '50%', data: row }).afterClosed().subscribe(val => {
        if (val === 'update') {
          this.getActivitiesByProject(this.projectId);
        }
      });
    } else {
      this.toast.warning('No tienes permisos para editar actividades');
    }
  }

  deleteActivity(id: number) {
    if (this.havedelete) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Desea borrar esta actividad",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, bórralo',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.deleteActivities(id).subscribe({
            next: () => {
              Swal.fire('Borrado!', 'La actividad ha sido eliminada.', 'success');
              this.getActivitiesByProject(this.projectId);
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
      this.toast.warning('No tienes permisos para borrar actividades');
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
    this.dialog.open(ActivitiesDetalleComponent, {
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
          this.haveadd = permissions.activities.add;
          this.haveedit = permissions.activities.edit;
          this.havedelete = permissions.activities.delete;
          this.generateReport = permissions.activities.generateReport;

          // Actualiza la UI según los permisos obtenidos
          this.getActivitiesByProject(this.projectId);  // Obtener actividades del proyecto
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

  openDialogTask(activityId: number): void {
    if (this.haveadd) {
      const dialogRef = this.dialog.open(DialogTaskComponent, {
        width: '50%',
        data: { activityId } // Pasar el ID del anciano
      }
      );

      dialogRef.afterClosed().subscribe(val => {
        if (val === 'save') {
          Swal.fire({
            icon: 'success',
            title: 'Tarea agregada correctamente',
            timer: 3000,
            toast: true,
            position: 'top-end',
            showConfirmButton: false
          });
          this.getActivitiesByProject(this.projectId);
        }
      });
    } else {
      this.toast.warning('No tienes permisos de agregar tareas');
    }
  }
}
