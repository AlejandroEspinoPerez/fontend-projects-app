import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-activities',
  templateUrl: './dialog-activities.component.html',
  styleUrls: ['./dialog-activities.component.scss']
})
export class DialogActivitiesComponent implements OnInit {

  actividadForm!: FormGroup;
  actionButton: string = "SAVE";
  usuariosResponsables: any[] = []; // Array para almacenar los responsables

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogActivitiesComponent>
  ) { }

  ngOnInit(): void {
    // Inicializa el formulario con los campos necesarios para la actividad
    this.actividadForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      responsable: ['', Validators.required],
    });

    // Obtener la lista de responsables
    this.api.getAllUser().subscribe((data: any) => {
      this.usuariosResponsables = data; // Asigna la lista de usuarios responsables
    });

    if (this.editData && this.editData.id) { // Si editData contiene id, estamos en modo edición
      this.actionButton = "UPDATE";
      this.actividadForm.patchValue({
        nombre: this.editData.nombre,
        descripcion: this.editData.descripcion,
        fechaInicio: this.editData.fechaInicio,
        fechaFin: this.editData.fechaFin,
        responsable: this.editData.responsable,
      });
    }
  }

  addActividad() {
    if (this.actividadForm.valid) {
      const actividadData = {
        nombre: this.actividadForm.value.nombre,
        descripcion: this.actividadForm.value.descripcion,
        fechaInicio: new Date(this.actividadForm.value.fechaInicio).toISOString().split('T')[0],
        fechaFin: new Date(this.actividadForm.value.fechaFin).toISOString().split('T')[0],
        responsable: this.actividadForm.value.responsable,
        proyecto: this.editData.projectId // Utiliza el ID del proyecto que pasaste al abrir el diálogo
      };

      if (this.editData && this.editData.id) {
        this.updateActividad(this.editData.id, actividadData); // Llamar a la función de actualización
      } else {
        this.api.postActivities(actividadData).subscribe({
          next: (res) => {
            this.actividadForm.reset();
            this.dialogRef.close('save');
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Actividad agregada correctamente !!',
              showConfirmButton: false,
              timer: 1000
            });
          },
          error: () => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al agregar la actividad',
              showConfirmButton: false,
              timer: 1000
            });
          }
        });
      }
    }
  }

  updateActividad(actividadId: number, actividadData: any) {
    this.api.putActivities(actividadId, actividadData).subscribe({
      next: (res) => {
        this.actividadForm.reset();
        this.dialogRef.close('update');
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Actividad actualizada correctamente !!',
          showConfirmButton: false,
          timer: 1000
        });
      },
      error: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al actualizar la actividad',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }
}