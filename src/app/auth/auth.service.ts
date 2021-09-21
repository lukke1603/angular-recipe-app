import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Route } from "@angular/compiler/src/core";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}




@Injectable({providedIn: 'root'})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private autoLogoutTimer: any;

  AUTH_SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDR7OJDiWXC8tUkisdjypLkJiTI4EGVhyY';
  AUTH_SIGNIN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDR7OJDiWXC8tUkisdjypLkJiTI4EGVhyY';

  constructor(
    private http: HttpClient,
    private router: Router
  ){}





  signup(email: string, password: string){
    return this.http
      .post<AuthResponseData>(this.AUTH_SIGNUP_URL, {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        })
      )
   }


  login(email: string, password: string){
   return this.http
    .post<AuthResponseData>(this.AUTH_SIGNIN_URL, {
      email,
      password,
      returnSecureToken: true
    })
    .pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      })
    )
  }



  handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    this.user.next(user);

    this.autoLogout(expiresIn * 1000);

    localStorage.setItem('userData', JSON.stringify(user))
  }


  handleError(errorResponse: HttpErrorResponse){
    console.log(errorResponse);
    let errorMessage = 'An unknown error occurred!';

    if(!errorResponse.error || !errorResponse.error.error){
      return throwError(errorMessage);
    }

    switch(errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid Login credentials';
        break;
    }

    return throwError(errorMessage);
  }


  autoLogin(){
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if(loadedUser.token){
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
      this.user.next(loadedUser);
    }
  }


  autoLogout(expirationDuration: number){
    this.autoLogoutTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.autoLogoutTimer){
      clearTimeout(this.autoLogoutTimer);
    }
    this.autoLogoutTimer = null;
  }
}
