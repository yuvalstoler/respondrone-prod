import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {LoginService} from '../services/login/login.service';
import {Router} from '@angular/router';
import {ASYNC_RESPONSE, USER_DATA_UI} from '../../../../../classes/typings/all.typings';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.loginService.isLoggedIn().pipe(map((response: ASYNC_RESPONSE<USER_DATA_UI>) => {
      if (response.success && response.data) {
        this.loginService.updateDataOnLogin(response.data);
        return true;
      }
      else {
        this.router.navigate(['login']);
        return false;
      }
    }), catchError((error) => {
      this.router.navigate(['login']);
      return of(false);
    }));
  }

}

