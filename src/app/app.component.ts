import { Component,DoCheck } from '@angular/core';
import{Router}from '@angular/router'
import { ApiService } from './services/api.service';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements DoCheck{
  ismenurequired=false;
  title = 'sidenav';
  isadminuser=false;

  constructor(private router:Router,private service:ApiService){

  }

  ngDoCheck(): void {
    let currenturl=this.router.url;
    if(currenturl=='/login'||currenturl=='/register'){
      this.ismenurequired=false;
    }else{
      this.ismenurequired=true;
    }

  }


  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
