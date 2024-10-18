import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-activities-detalle',
  templateUrl: './task-detalle.component.html',
  styleUrls: ['./task-detalle.component.scss']
})
export class TaskDetalleComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
