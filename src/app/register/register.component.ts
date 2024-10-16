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
    id: this.builder.control('', Validators.required),
    name: this.builder.control('', Validators.required),

    password:this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    email: this.builder.control('', Validators.compose([Validators.required, Validators.email])),
    gender: this.builder.control('hombre'),
    role: this.builder.control(''),
    isactive: this.builder.control(false)
  });
    pruebaForm=this.builder.group({
      id: this.builder.control(''),
      cantU:this.builder.control('')
    })


  prosederRegister(){
    if(this.registerform.valid){
        this.service.prosederRegister(this.registerform.value).subscribe(res=>{
          this.toast.success('Por favor contacta con el admin para activar su acceso','Registrado correctamente');
          this.router.navigate(['login']);
        });
    }else{
        this.toast.warning('Por favor introduzca datos correctos')
    }
  }



}
