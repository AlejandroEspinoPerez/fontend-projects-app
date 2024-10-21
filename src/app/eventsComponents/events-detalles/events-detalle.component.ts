import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contactos-detalle',
  templateUrl: './events-detalle.component.html',
  styleUrls: ['./events-detalle.component.scss']
})
export class EventsDetalleComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
