import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(private builder: FormBuilder,private toast:ToastrService ,private service:ApiService,private router:Router) {



  }

  registerform = this.builder.group({
    nombre: this.builder.control('', Validators.required), // Campo para nombre
    apellido: this.builder.control('', Validators.required), // Campo para apellido
    password: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    email: this.builder.control('', Validators.compose([Validators.required, Validators.email]))
  });
    pruebaForm=this.builder.group({
      id: this.builder.control(''),
      cantU:this.builder.control('')
    })


  prosederRegister() {
    if (this.registerform.valid) {
      const newUser = {
        nombre: this.registerform.value.nombre,
        apellido: this.registerform.value.apellido,
        email: this.registerform.value.email,
        password: this.registerform.value.password
      };

      this.service.prosederRegister(newUser).subscribe(
        res => {
          this.toast.success('Por favor contacta con el admin para activar tu acceso', 'Registrado correctamente');
          this.router.navigate(['login']);
        },
        error => {
          this.toast.error('Error al registrar el usuario: ' + error.message, 'Error');
        }
      );
    } else {
      this.toast.warning('Por favor introduce datos correctos');
    }
  }





}
