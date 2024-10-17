import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-activities-detalle',
  templateUrl: './activities-detalle.component.html',
  styleUrls: ['./activities-detalle.component.scss']
})
export class ActivitiesDetalleComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
