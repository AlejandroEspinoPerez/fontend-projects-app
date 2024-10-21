import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { EventsDetalleComponent } from '../eventsComponents/events-detalles/events-detalle.component'; // Asegúrate de que la ruta sea correcta
import { CalendarEventsDetalleComponent } from './calendarDetalles/calendar-events-detalle.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this) // Maneja el clic en el evento
  };

  constructor(private eventService: ApiService, private dialog: MatDialog) { } // Inyecta MatDialog

  ngOnInit() {
    this.eventService.getAllEvents().subscribe(events => {
      this.calendarOptions.events = events.map((event: any) => ({
        title: event.nombre,
        date: event.fechaRealizacion,
        extendedProps: { // Guarda datos adicionales en props extendidas
          cantidadParticipantes: event.cantidadParticipantes // Otros detalles
        }
      }));
    });
  }

  handleEventClick(info: any) {
    const eventData = {
      title: info.event.title,
      date: info.event.startStr,
      cantidadParticipantes: info.event.extendedProps.cantidadParticipantes // Accede a las props extendidas
    };

    const dialogRef = this.dialog.open(CalendarEventsDetalleComponent, {
      data: eventData // Pasa los datos del evento al diálogo
    });

    // Puedes manejar el cierre del diálogo si lo necesitas
    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
    });
  }
}
