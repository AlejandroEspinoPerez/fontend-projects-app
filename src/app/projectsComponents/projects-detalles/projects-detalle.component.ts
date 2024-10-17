import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';  // Importa el servicio de usuarios

@Component({
  selector: 'app-projects-detalle',
  templateUrl: './projects-detalle.component.html',
  styleUrls: ['./projects-detalle.component.scss']
})
export class ProjectsDetalleComponent implements OnInit {
  public lider: any;
  public miembros: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService  // Inyecta el servicio de usuarios
  ) { }

  ngOnInit(): void {
    // Obtener detalles del líder por su ID
    this.apiService.getById(this.data.lider.id).subscribe((user) => {
      this.lider = user;
    });

    // Obtener detalles de cada miembro
    this.data.miembros.forEach((miembro: any) => {
      this.apiService.getById(miembro.id).subscribe((user) => {
        this.miembros.push(user);
      });
    });
  }
}
