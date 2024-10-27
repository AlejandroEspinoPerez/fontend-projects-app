import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-updatepopup',
  templateUrl: './updatepopup.component.html',
  styleUrls: ['./updatepopup.component.css']
})
export class UpdatepopupComponent implements OnInit {
  rolelist: string[] = ['JefeDirectivo', 'Lider', 'Miembro','admin']; // Lista de roles fijos
  editdata: any; // Datos del usuario a editar
  registerform: FormGroup; // Formulario reactivo

  constructor(
    private builder: FormBuilder,
    private service: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastrService,
    private dialog: MatDialogRef<UpdatepopupComponent>
  ) {
    // Inicialización del formulario
    this.registerform = this.builder.group({
      id: [{ value: '', disabled: true }], // Deshabilitado
      nombre: [{ value: '', disabled: true }], // Deshabilitado
      email: [{ value: '', disabled: true }], // Deshabilitado
      rol: ['', Validators.required], // Editable solo el rol
      isActive: [false] // Editable el estado de activación
    });
  }

  ngOnInit(): void {
    // Si se recibió un ID de usuario, cargar sus datos
    if (this.data.usercode) {
      this.service.getById(this.data.usercode).subscribe(res => {
        this.editdata = res;
        this.registerform.patchValue({
          id: this.editdata.id,
          nombre: this.editdata.nombre, // Campo correcto
          email: this.editdata.email,
          rol: this.editdata.rol,
          isActive: this.editdata.isActive // Asegurar que coincida
        });
      });
    }
  }

  updateuser() {
    if (this.registerform.valid) {
      // Preparar los datos para la actualización
      const updatedData = {
        nombre: this.editdata.nombre, // No se modifica
        apellido: this.editdata.apellido, // No se modifica
        email: this.editdata.email, // No se modifica
        password: this.editdata.password, // No se modifica
        rol: this.registerform.value.rol, // Actualizar rol
        isActive: this.registerform.value.isActive // Actualizar estado
      };

      // Llamada al servicio para actualizar el usuario
      this.service.updateUser(updatedData, this.editdata.id).subscribe({
        next: () => {
          this.toast.success('Usuario actualizado correctamente.');
          this.dialog.close();
        },
        error: () => {
          this.toast.error('Error al actualizar el usuario.');
        }
      });
    } else {
      this.toast.warning('Por favor, completa todos los campos requeridos.');
    }
  }
}
