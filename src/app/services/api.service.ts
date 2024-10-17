import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Anciano } from '../Models/anciano.model';  // Asegúrate de importar tu modelo correctamente
import { Contactos } from '../Models/contactos.model';
import { Enfermedades } from '../Models/enfermedades.model copy';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  // NUEVAS URLs para Cátedra Adulto Mayor======================================================================
  //apiurlUser = 'http://localhost:8000/api/users/'; // Cambia esta URL a tu endpoint real


  apiurlUser = 'http://localhost:3000/users/';
  apiurlProjects = 'http://localhost:3000/projects/'
  apiurlActivities = 'http://localhost:3000/activities/'
  apiurlAncianos = 'http://localhost:8000/api/ancianos/';
  apiurlContactosEmergencia = 'http://localhost:8000/api/contactos/';
  apiurlEnfermedades = 'http://localhost:8000/api/enfermedades/';

  //  Métodos para manejar usuarios
    //Accesos a la user list ==============================
    // Registrar un nuevo usuario
    prosederRegister(data: any): Observable<any> {
      return this.http.post(this.apiurlUser, data);
  }

  // **Obtener usuario por nombre**
  getByNombre(nombre: string): Observable<any> {
    return this.http.get(`${this.apiurlUser}nombre/${nombre}`);
  }

  // **Obtener usuario por ID**
  getById(userId: number): Observable<any> {
    return this.http.get(`${this.apiurlUser}id/${userId}`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiurlUser}${userId}`);
  }

    postCantUser(data: any) {
      return this.http.post("http://localhost:8000/api/cantidades", data);
    }

    // Obtener todos los usuarios
    getAllUser(): Observable<any> {
      return this.http.get(this.apiurlUser);
    }

    // Obtener todos los roles
    getAllRole(): Observable<any> {
      return this.http.get("http://localhost:8000/api/roles/");
    }



    // Actualizar un usuario existente
    updateUser(data: any, code: any): Observable<any> {
      return this.http.put<any>(`${this.apiurlUser}${code}/`, data);
    }

    // Obtener accesos por rol y menú
    getAccessbyRole(role: any, menu: any): Observable<any> {
      return this.http.get(`http://localhost:8000/api/roleaccess?role=${role}&menu=${menu}`);
    }

    // Verificar si el usuario está logueado
    IsloggedIn(): boolean {
      return sessionStorage.getItem('username') != null;
    }

    // Obtener rol del usuario desde el almacenamiento
    getUserrole(): string {
      return sessionStorage.getItem('userrole')?.toString() ?? '';
  }

  //=========================================== Projects
  getAllProjects(): Observable<any> {
    return this.http.get<any>(this.apiurlProjects);
  }

  // Método para obtener un proyecto por su ID
  getProjectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiurlProjects}${id}/`);
  }

  postProjects(data: any) {
    return this.http.post<any>(this.apiurlProjects, data);
  }

  putProjects(data: any, id: number) {
    return this.http.put<any>(`${this.apiurlProjects}${id}/`, data);
  }

  deleteProjects(id: number) {
    return this.http.delete<any>(`${this.apiurlProjects}${id}/`);
  }


  //=========================================== Activities
  // Método para obtener actividades por ID de proyecto
  // Método para obtener actividades por ID de proyecto
  getActivitiesByProjectId(projectId: number): Observable<any> {
    return this.http.get<any>(`${this.apiurlActivities}project/${projectId}`);
  }


  getAllActivities(): Observable<any> {
    return this.http.get<any>(this.apiurlActivities);
  }

  postActivities(data: any) {
    return this.http.post<any>(this.apiurlActivities, data);
  }

  putActivities(data: any, id: number) {
    return this.http.put<any>(`${this.apiurlActivities}${id}/`, data);
  }

  deleteActivities(id: number) {
    return this.http.delete<any>(`${this.apiurlActivities}${id}/`);
  }









  //=========================================== Ancianos
  getAllAncianos(): Observable<Anciano[]> {
    return this.http.get<Anciano[]>(this.apiurlAncianos);
  }

  postAnciano(data: any) {
    return this.http.post<any>(this.apiurlAncianos, data);
  }

  putAnciano(data: any, id: number) {
    return this.http.put<any>(`${this.apiurlAncianos}${id}/`, data);
  }

  deleteAnciano(id: number) {
    return this.http.delete<any>(`${this.apiurlAncianos}${id}/`);
  }



  // Contactos de emergencia
  getAllContactos(): Observable<Contactos[]> {
    return this.http.get<Contactos[]>(this.apiurlContactosEmergencia);
  }

  // Agregar contacto a un anciano específico
  postContactoEmergencia(contactoData: any) {
    // Asumiendo que contactoData ya incluye la propiedad 'anciano' con el ID del anciano
    return this.http.post<any>(`${this.apiurlAncianos}${contactoData.anciano}/agregar-contacto/`, contactoData);
  }

  // Actualizar contacto de emergencia
  updateContacto(contactoId: number, contactoData: any) {
    return this.http.put<any>(`${this.apiurlContactosEmergencia}${contactoId}/`, contactoData);
  }


  // Eliminar contacto de emergencia
  deleteContacto(contactoId: number) {
    return this.http.delete<any>(`${this.apiurlContactosEmergencia}${contactoId}/`);
  }


  // Enfermedades=======================================
  // Contactos de emergencia
  getAllEnfermedades(): Observable<Enfermedades[]> {  // Especificamos que la respuesta es un array de Anciano
    return this.http.get<Enfermedades[]>(this.apiurlEnfermedades);
  }

  // apiurlAncianos ya tiene la base del URL
  postEnfermedad(ancianoId: number, enfermedadData: any) {
    return this.http.post<any>(`${this.apiurlAncianos}${ancianoId}/agregar-enfermedad/`, enfermedadData);
  }

  // Agregar método para actualizar una enfermedad
  updateEnfermedad(enfermedadId: number, enfermedadData: any) {
    return this.http.put<any>(`${this.apiurlEnfermedades}${enfermedadId}/`, enfermedadData);
  }

  // Eliminar contacto de emergencia
  deleteEnfermedad(enfermedadId: number) {
    return this.http.delete<any>(`${this.apiurlEnfermedades}${enfermedadId}/`);
  }

}
