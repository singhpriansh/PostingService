import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";
@Injectable()
export class AuthGaurd implements CanActivate {
    constructor( private authService: AuthService, private router: Router ){}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
            const isAuth = this.authService.getIsAuth();
            if(!isAuth){
                this.router.navigate(['/login']);
            }
            return isAuth;
    }
}