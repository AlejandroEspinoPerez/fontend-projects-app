import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userdata: any;

  constructor(
    private builder: FormBuilder,
    private toast: ToastrService,
    private service: ApiService,
    private router: Router
  ) {
    sessionStorage.clear();
  }

  // Definimos el formulario de inicio de sesión
  loginform = this.builder.group({
    nombre: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required),
  });

  // Método para proceder al inicio de sesión
  procederLogin() {
    if (this.loginform.valid) {
      const nombre = this.loginform.value.nombre ?? '';
      this.service.getByNombre(nombre).subscribe(
        (res: any) => {
          this.userdata = res;
          if (this.userdata) {
            if (this.userdata.password === this.loginform.value.password) {
              if (this.userdata.isActive) {
                sessionStorage.setItem('currentUserId', this.userdata.id.toString());
                sessionStorage.setItem('username', this.userdata.nombre); // Aquí asumo que tienes un campo 'nombre'
                sessionStorage.setItem('userrole', this.userdata.rol);
                this.router.navigate(['dashboard']);
              } else {
                this.toast.error('Por favor contactar al admin', 'No está activado aún');
              }
            } else {
              this.toast.error('Contraseña incorrecta');
            }
          } else {
            this.toast.error('Usuario no encontrado');
          }
        },
        (error: any) => {
          this.toast.error('Error en la conexión', 'Por favor intenta más tarde');
        }
      );
    } else {
      this.toast.warning('Por favor complete todos los campos requeridos');
    }
  }
}
