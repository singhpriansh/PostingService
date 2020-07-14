import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { environment } from "../../environments/environment";

const BACK_URL = environment.apiUrls + "user/";

@Injectable({providedIn: 'root'})
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId(){
        return this.userId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string ) {
        const authdata: AuthData = {
            email: email,
            password: password
        };
        this.http.post(BACK_URL + "signup", authdata)
            .subscribe(response => {
                this.router.navigate(['/']);
                console.log(response);
            }, error => {
                this.authStatusListener.next(false);
            }
        );
    }

    loginUser(email: string, password: string) {
        const authdata: AuthData = {
            email: email,
            password: password
        };
        this.http.post<{token: string, expiresIn: number, userId: string }>(BACK_URL + "login", authdata)
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if(token){
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration *1000);
                    this.SaveAuthData(token, expirationDate, this.userId);
                    // console.log(expirationDate);
                    this.router.navigate(['/']);
                }
            }, error => {
                this.authStatusListener.next(false);
            })
    }

    autoAuthuUser() {
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logoutUser() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        // console.log("Setting timer: " + duration);
        this.tokenTimer = setTimeout(() => {
            this.logoutUser();
        }, duration * 1000);
    }

    private SaveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const expirationDate = localStorage.getItem("expiration");
        if(!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }
}
