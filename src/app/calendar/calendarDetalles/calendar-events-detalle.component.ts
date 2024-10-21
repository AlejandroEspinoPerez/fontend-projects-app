import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contactos-detalle',
  templateUrl: './calendar-events-detalle.component.html',
  styleUrls: ['./calendar-events-detalle.component.scss']
})
export class CalendarEventsDetalleComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
