import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MAT_DIALOG_DATA,MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from 'ngx-toastr';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-updatepopup',
  templateUrl: './updatepopup.component.html',
  styleUrls: ['./updatepopup.component.css']
})
export class UpdatepopupComponent implements OnInit {
  rolelist:any;

  constructor(private builder:FormBuilder ,private service:ApiService,
    @Inject(MAT_DIALOG_DATA) public data:any ,private toast:ToastrService,private dialog:MatDialogRef<UpdatepopupComponent>){

    }

    editdata:any;
  ngOnInit(): void {
      this.service.getAllRole().subscribe(res=>{
          this.rolelist=res;
      })

      if(this.data.usercode!=null && this.data.usercode!=''){
        this.service.getbycode(this.data.usercode).subscribe(res=>{
            this.editdata=res;
            this.registerform.setValue({id:this.editdata.id,name:this.editdata.name,email:this.editdata.email,password:this.editdata.password,role:this.editdata.role,gender:this.editdata.gender,isactive:this.editdata.isactive})
        })

      }
  }
  registerform = this.builder.group({
    id: this.builder.control(''),
    name: this.builder.control(''),

    password:this.builder.control(''),
    email: this.builder.control(''),
    gender: this.builder.control('hombre'),
    role: this.builder.control('',Validators.required),
    isactive: this.builder.control(false)
  });

  updateuser(){
    
    console.log("hola");
      if(this.registerform.valid){
          this.service.updateUser(this.registerform.value,this.registerform.value.id).subscribe(res=>{
            this.toast.success("Actualizado Correctamente");
            this.dialog.close();
          console.log(res);
          });

      }else{
        this.toast.warning("Por favor selecciona algun rol");
      }
  }

}
