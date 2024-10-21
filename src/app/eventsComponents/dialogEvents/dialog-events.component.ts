import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-events',
  templateUrl: './dialog-events.component.html',
  styleUrls: ['./dialog-events.component.css']
})
export class DialogEventsComponent implements OnInit {

  eventForm!: FormGroup; // Cambiar el nombre a eventForm
  actionButton: string = "SAVE"; // Cambia el nombre de actionButton si es necesario

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogEventsComponent>
  ) { }

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      nombre: ['', Validators.required], // Campo para el nombre del evento
      cantidadParticipantes: ['', [Validators.required, Validators.min(1)]], // Asegúrate de que sea un número positivo
      fechaRealizacion: ['', Validators.required] // Campo para la fecha de realización
    });

    // Verifica si los datos de edición están presentes
    if (this.editData && this.editData.id) {
      this.actionButton = "UPDATE";  // Cambia el texto del botón a "UPDATE" en caso de edición
      this.eventForm.patchValue({
        nombre: this.editData.nombre,
        cantidadParticipantes: this.editData.cantidadParticipantes,
        fechaRealizacion: this.editData.fechaRealizacion
      });
    }
  }

  addEvent() {
    if (this.eventForm.valid) {
      const eventData = {
        nombre: this.eventForm.value.nombre,
        cantidadParticipantes: this.eventForm.value.cantidadParticipantes,
        fechaRealizacion: this.eventForm.value.fechaRealizacion
      };

      // Si hay `editData`, se está editando un evento existente
      if (this.editData && this.editData.id) {
        this.updateEvent(eventData);  // Llamamos a la función para actualizar el evento
      } else {
        this.createEvent(eventData);  // Llamamos a la función para crear un nuevo evento
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor completa los campos correctamente',
      });
    }
  }

  createEvent(eventData: any) {
    this.api.postEvents(eventData).subscribe({
      next: (res) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Evento agregado correctamente !!',
          showConfirmButton: false,
          timer: 1000
        });
        this.eventForm.reset();
        this.dialogRef.close('save');
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar el evento',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }

  updateEvent(eventData: any) {
    this.api.putEvents(eventData,this.editData.id).subscribe({
      next: (res) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Evento actualizado correctamente !!',
          showConfirmButton: false,
          timer: 1000
        });
        this.eventForm.reset();
        this.dialogRef.close('update');
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el evento',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }
}
