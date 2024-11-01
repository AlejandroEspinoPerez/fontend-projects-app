import { OnInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DialogProjectsComponent } from '../dialog-projects/dialog-projects.component';
import { ProjectsDetalleComponent } from '../projects-detalles/projects-detalle.component';
import { ApiService } from '../../services/api.service';
import { DialogActivitiesComponent } from 'src/app/activitiesComponents/dialog-activities/dialog-activities.component';
import { PermissionsService } from 'src/app/services/permissions.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  // Permisos (temporalmente obviados)
  haveedit = false;
  haveadd = false;
  havedelete = false;

  // Botones visibles
  showAddButton = false;
  showEditButton = false;
  showDeleteButton = false;

  generateReport = false;

  displayedColumns: string[] = [
    'nombre',
    //'descripcion',
    'tipo',
    // 'localidad',
    // 'objetivos',
    'presupuesto',
    // 'fechaInicio',
    // 'fechaFin',
    // 'resultado',
    'lider',
    'miembros',
    'acciones'
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private permissionsService: PermissionsService,private router: Router, private toast: ToastrService, private api: ApiService) { }

  ngOnInit(): void {
    this.setAccesPermission();

  }

  // Función para generar reporte de proyectos
  generateProjectReport(): void {
    // Navegar al componente de reportes pasando un parámetro
    this.router.navigate(['/reports'], { queryParams: { type: 'projects' } });
  }

  // Obtener todos los proyectos
  getAllProjects() {
    this.api.getAllProjects().subscribe({
      next: (res: any[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los datos',
          timer: 3000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false
        });
      }
    });
  }

  // Filtrar la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Abrir detalles del proyecto
  openDetail(row: any): void {
    this.dialog.open(ProjectsDetalleComponent, {
      width: '60%',
      data: row
    });
  }

  // Abrir el diálogo para agregar o editar proyecto
  openDialogProject(): void {
    if (this.haveadd) {
      this.dialog.open(DialogProjectsComponent, {
        width: '50%'
      }).afterClosed().subscribe(val => {
        if (val === 'save') {
          Swal.fire({
            icon: 'success',
            title: 'Proyecto agregado correctamente',
            timer: 3000,
            toast: true,
            position: 'top-end',
            showConfirmButton: false
          });
          this.getAllProjects();
        }
      });
    } else {
      this.toast.warning('No tienes permisos para agregar proyectos');
    }
  }

  // Editar un proyecto
  editProject(row: any) {
    if (this.haveedit) {
      this.dialog.open(DialogProjectsComponent, { width: '50%', data: row }).afterClosed().subscribe(val => {
        if (val === 'update') {
          this.getAllProjects();
        }
      });
    } else {
      this.toast.warning('No tienes permiso para editar proyectos');
    }
  }

  // Eliminar un proyecto
  deleteProject(id: number) {
    if (this.havedelete) {
      Swal.fire({
        title: '¿Está seguro?',
        text: 'Desea borrar este proyecto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'No, cancelar',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.deleteProjects(id).subscribe({
            next: () => {
              Swal.fire('Borrado', 'El proyecto ha sido eliminado.', 'success');
              this.getAllProjects();
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error al borrar los datos',
                timer: 3000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false
              });
            }
          });
        }
      });
    } else {
      this.toast.warning('No tienes permisos para borrar proyectos');
    }
  }

  openDialogActivities(projectId: number): void {
    if (this.haveadd) {
      const dialogRef = this.dialog.open(DialogActivitiesComponent, {
        width: '50%',
        data: { projectId } // Pasar el ID del anciano
      }
      );

      dialogRef.afterClosed().subscribe(val => {
        if (val === 'save') {
          Swal.fire({
            icon: 'success',
            title: 'Actividad agregada correctamente',
            timer: 3000,
            toast: true,
            position: 'top-end',
            showConfirmButton: false
          });
          this.getAllProjects();
        }
      });
    } else {
      this.toast.warning('No tienes permisos de agregar actividades');
    }
  }


  setAccesPermission() {
    const userRole = this.api.getUserrole(); // Obtener rol del usuario
    console.log(userRole);

    // Llamada al servicio para obtener los permisos por rol
    this.permissionsService.getPermissionsByRole(userRole).subscribe({
      next: (permissions) => {
        if (permissions.projects) {
          this.haveadd = permissions.projects.add;
          this.haveedit = permissions.projects.edit;
          this.havedelete = permissions.projects.delete;
          this.generateReport = permissions.projects.generateReport;

          // Actualiza la UI según los permisos obtenidos
          this.updateUIBasedOnPermissions();
          this.getAllProjects();  // Obtener eventos si hay permisos
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

  updateUIBasedOnPermissions() {
    this.showEditButton = this.haveedit;
    console.log('Add:', this.haveadd, 'Edit:', this.haveedit, 'Delete:', this.havedelete);
  }
}
