import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Variables para datos
  cantMiembros = 0;
  cantProyectos = 0;
  cantEventos = 0;

  logueado = false; // Cambia esto a false inicialmente
  tienePermiso = false; // Variable para verificar permisos

  constructor(private service: ApiService) { }

  ngOnInit(): void {

    // Verificar si el usuario está autenticado
    this.logueado = this.service.IsloggedIn();
    // Verificar si el usuario tiene permiso para acceder al Dashboard
    this.verificarPermiso();


    // Solo obtener datos si tiene permiso
    if (this.tienePermiso) {
      // Obtener datos en paralelo
      forkJoin({
        miembros: this.service.getAllUser(),
        proyectos: this.service.getAllProjects(),
        eventos: this.service.getAllEvents()
      }).subscribe(({ miembros, proyectos, eventos }) => {
        // Asignar cantidades obtenidas
        this.cantMiembros = miembros.length;
        this.cantProyectos = proyectos.length;
        this.cantEventos = eventos.length;

        // Renderizar gráfica con los nuevos datos
        this.renderChart();
      });
    }
  }


  // Método para verificar permisos del usuario
  verificarPermiso(): void {
    // Implementa tu lógica aquí para verificar si el usuario tiene acceso
    // Por ejemplo, podrías verificar un rol del usuario
    const userRole = this.service.getUserrole(); // Suponiendo que tienes un método para obtener el rol del usuario
    this.tienePermiso = (userRole === 'admin' || userRole === 'JefeDirectivo'); // Cambia los roles según tus necesidades
  }

  // Método para renderizar la gráfica
  renderChart(): void {
    new Chart('piechart', {
      type: 'bar',
      data: {
        labels: ['Miembros', 'Proyectos', 'Eventos'],
        datasets: [{
          label: 'Cantidad',
          data: [this.cantMiembros, this.cantProyectos, this.cantEventos],
          backgroundColor: ['#ff6384', '#36a2eb', '#4bc0c0'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
