import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog-projects.component.html',
  styleUrls: ['./dialog-projects.component.scss']
})
export class DialogProjectsComponent implements OnInit {

  projectForm!: FormGroup;
  actionButton: string = "SAVE";
  usuarios: any[] = []; // Para almacenar los usuarios disponibles
  miembrosSeleccionados: any[] = []; // Para almacenar los miembros seleccionados

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogProjectsComponent>) {
  }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
      localidad: ['', Validators.required],
      lider: ['', Validators.required], // Selección del líder
      miembros: ['', Validators.required], // Selección múltiple de miembros
      objetivos: ['', Validators.required],
      presupuesto: ['', [Validators.required, Validators.min(0)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      resultado: ['', Validators.required]
    });

    // Llamada para obtener los usuarios (lideres y miembros)
    this.getUsuarios();

    if (this.editData) {
      this.actionButton = "UPDATE";
      this.projectForm.patchValue({
        nombre: this.editData.nombre,
        descripcion: this.editData.descripcion,
        tipo: this.editData.tipo,
        localidad: this.editData.localidad,
        lider: this.editData.lider,
        miembros: this.editData.miembros,
        objetivos: this.editData.objetivos,
        presupuesto: this.editData.presupuesto,
        fechaInicio: this.editData.fechaInicio,
        fechaFin: this.editData.fechaFin,
        resultado: this.editData.resultado,
      });
    }
  }

  // Método para obtener la lista de usuarios
  getUsuarios() {
    this.api.getAllUser().subscribe({
      next: (res) => {
        this.usuarios = res; // Guardar usuarios
      },
      error: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener los usuarios',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }

  addProject() {
    if (!this.editData) {
      if (this.projectForm.valid) {
        this.api.postProjects(this.projectForm.value).subscribe({
          next: (res) => {
            this.projectForm.reset();
            this.dialogRef.close('save');
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Proyecto agregado !!',
              showConfirmButton: false,
              timer: 1000
            });
          },
          error: () => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al agregar el proyecto',
              showConfirmButton: false,
              timer: 1000
            });
          }
        });
      }
    } else {
      this.updateProject();
    }
  }

  updateProject() {
    this.api.putProjects(this.projectForm.value, this.editData.id).subscribe({
      next: (res) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Proyecto actualizado !!',
          showConfirmButton: false,
          timer: 1000
        });
        this.projectForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al actualizar el proyecto',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }
}
