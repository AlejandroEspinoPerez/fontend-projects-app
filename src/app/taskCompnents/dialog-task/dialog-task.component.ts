import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-tasks',
  templateUrl: './dialog-task.component.html',
  styleUrls: ['./dialog-task.component.scss']
})
export class DialogTaskComponent implements OnInit {

  taskForm!: FormGroup;
  actionButton: string = "SAVE";
  usuariosResponsables: any[] = []; // Array para almacenar los responsables
  actividadNombre: string = ''; // Nombre de la actividad

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any, // editData ahora incluye idActividad y nombreActividad
    private dialogRef: MatDialogRef<DialogTaskComponent>
  ) { }

  ngOnInit(): void {
    // Inicializa el formulario con los campos necesarios para la tarea
    this.taskForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: this.actionButton === 'UPDATE' ? [''] : null, // No lo hacemos requerido en modo creación
      responsable: ['', Validators.required]
    });

    // Obtener la lista de responsables
    this.api.getMembers().subscribe((data: any) => {
      this.usuariosResponsables = data; // Asigna la lista de usuarios responsables
    });

    // Si el diálogo es para editar una tarea, se cargan los datos
    if (this.editData && this.editData.id) {
      this.actionButton = "UPDATE";
      this.taskForm.patchValue({
        nombre: this.editData.nombre,
        descripcion: this.editData.descripcion,
        fechaInicio: this.editData.fechaInicio,
        fechaFin: this.editData.fechaFin,
        responsable: this.editData.responsable
      });
    }

    // Establece el nombre de la actividad para mostrarlo en el diálogo
    this.actividadNombre = this.editData.nombreActividad;
  }

  addTask() {
    if (this.taskForm.valid) {
      const taskData: any = {
        nombre: this.taskForm.value.nombre,
        descripcion: this.taskForm.value.descripcion,
        fechaInicio: new Date(this.taskForm.value.fechaInicio).toISOString().split('T')[0],
        responsable: this.taskForm.value.responsable,
        actividad: this.editData.idActividad
      };

      // Solo añadir fechaFin si existe en el formulario
      if (this.taskForm.value.fechaFin) {
        taskData.fechaFin = new Date(this.taskForm.value.fechaFin).toISOString().split('T')[0];
      }

      if (this.editData && this.editData.id) {
        this.updateTask(this.editData.id, taskData);
      } else {
        this.api.postTask(taskData).subscribe({
          next: (res) => {
            this.taskForm.reset();
            this.dialogRef.close('save');
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Tarea agregada correctamente !!',
              showConfirmButton: false,
              timer: 1000
            });
          },
          error: () => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al agregar la tarea',
              showConfirmButton: false,
              timer: 1000
            });
          }
        });
      }
    }
  }



  updateTask(taskId: number, taskData: any) {
    this.api.putTask(taskData,taskId).subscribe({
      next: (res) => {
        this.taskForm.reset();
        this.dialogRef.close('update');
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Tarea actualizada correctamente !!',
          showConfirmButton: false,
          timer: 1000
        });
      },
      error: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al actualizar la tarea',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }
}
