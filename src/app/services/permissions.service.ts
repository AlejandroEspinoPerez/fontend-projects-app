import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private http: HttpClient) { }

  // Simulación de carga de permisos desde un archivo JSON
  getPermissions(): Observable<any> {
    return this.http.get('../../assets/permissions.json');  // Ruta del JSON
  }

  // Función para obtener los permisos por rol
  getPermissionsByRole(role: string): Observable<any> {
    return this.getPermissions().pipe(
      map((permissions: any) => permissions[role] || {})
    );
  }
}
