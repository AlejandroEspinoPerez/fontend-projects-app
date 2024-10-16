import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';

@Component({
  selector: 'app-userlisting',
  templateUrl: './userlisting.component.html',
  styleUrls: ['./userlisting.component.css']
})
export class UserlistingComponent {


  constructor(private service: ApiService,private dialog:MatDialog) {
      this.loaduser();
  }
  userlist: any;
  dataSource:any;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

  loaduser() {
    this.service.getAllUser().subscribe(res => {
      this.userlist = res;
      this.dataSource=new MatTableDataSource(this.userlist);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
      console.log(res);
    })
  }



    displayedColumns: string[] = ['username', 'name', 'email', 'role','status','action'];
    UpdateUser(code:any){
      const popup=this.dialog.open(UpdatepopupComponent,{
        enterAnimationDuration:'500ms',
        exitAnimationDuration:'250ms',
        width:'60%',
        data:{
          usercode:code
        }

      })
      popup.afterClosed().subscribe(res=>{
          this.loaduser();
      });

    }

    opendialog(){

    }



}
