import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';
import Swal from 'sweetalert2';  // Importar SweetAlert2
@Component({
  selector: 'app-userlisting',
  templateUrl: './userlisting.component.html',
  styleUrls: ['./userlisting.component.css']
})
export class UserlistingComponent {
  userlist: any;
  dataSource: any;

  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'rol', 'isActive', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: ApiService, private dialog: MatDialog) {
    this.loadUsers();
  }

  loadUsers() {
    this.service.getAllUser().subscribe((res: any) => {
      this.userlist = res;
      this.dataSource = new MatTableDataSource(this.userlist);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  updateUser(userId: number) {
    const popup = this.dialog.open(UpdatepopupComponent, {
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '250ms',
      width: '60%',
      data: { usercode: userId }
    });

    popup.afterClosed().subscribe(() => this.loadUsers());
  }

  toggleUserStatus(user: any) {
    const updatedStatus = { isActive: !user.isActive };
    this.service.updateUser(updatedStatus, user.id).subscribe(() => this.loadUsers());
  }

  deleteUser(userId: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Este usuario será eliminado permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteUser(userId).subscribe(() => {
          Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
          this.loadUsers();
        }, () => {
          Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
        });
      }
    });
  }
}
