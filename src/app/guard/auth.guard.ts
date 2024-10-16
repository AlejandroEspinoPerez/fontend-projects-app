import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private service: ApiService, private router: Router, private toast: ToastrService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.service.IsloggedIn()) {
        if(route.url.length > 0){
          let menu =route.url[0].path;
          if (menu=='userlisting') {
            if (this.service.getUserrole()=='admin') {

                return true;

            } else {
              this.toast.warning('No tienes acceso');
                this.router.navigate(['']);
                return false;
            }
          } else {
              return true;
          }
        }else{
          return true;
        }
    } else {
      this.router.navigate(['login']);
      this.toast.error('Logueo Requerido');
      return false;
    }
  }

}
