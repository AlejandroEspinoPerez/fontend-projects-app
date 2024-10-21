import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  pdfBlob: Blob | null = null; // Guardar el PDF como blob
  reportType: string = 'general'; // Tipo de reporte por defecto

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Obtener el parámetro de tipo de reporte desde la URL
    this.route.queryParams.subscribe((params) => {
      this.reportType = params['type'] || 'general'; // 'general' si no hay parámetro
      this.loadReport();
    });
  }

  // Cargar el reporte PDF según el tipo
  loadReport() {
    const endpoint = this.getReportEndpoint(this.reportType);

    this.http.get(endpoint, { responseType: 'blob' }).subscribe(
      (blob) => {
        this.pdfBlob = blob;
        const url = URL.createObjectURL(blob);
        const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
        if (iframe) {
          iframe.src = url;
        }
      },
      (error) => {
        console.error('Error al cargar el reporte:', error);
      }
    );
  }

  // Determinar el endpoint según el tipo de reporte
  private getReportEndpoint(type: string): string {
    switch (type) {
      case 'projects':
        return 'http://localhost:3000/reports/projects/pdf';
      case 'events':
        return 'http://localhost:3000/reports/events/pdf';
      default:
        return 'http://localhost:3000/reports/pdf';
    }
  }

  // Descargar el PDF
  downloadReport() {
    if (this.pdfBlob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(this.pdfBlob);
      link.download = `${this.reportType}-reporte.pdf`;
      link.click();
    }
  }
}
