import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { environment } from '../../environments/environment';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.services.auth.url;

  constructor(private http: HttpClient, private jwtService:JwtService) { }

  auth(email:string, pass:string) {

    /*headers = headers.set();
    headers = headers.set('Access-Control-Allow-Origin', '*');
    */

    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json'
      }),
      responseType: 'json' as const
    };

    let body = {
        "function" : "auth",
        "email" : email,
        "password" : pass
    };

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

  logout() {
    localStorage.removeItem(environment.jwtoken);
  }

  isLogged() {
    let currentuser = localStorage.getItem(environment.jwtoken);

    if(currentuser == null) return false;

    if(_.isEmpty(currentuser)) return false;


    return true;
  }

  getCurrentAccessToken() : string {
    
    if(!this.isLogged()) return "";

    if(_.isUndefined(localStorage.getItem(environment.jwtoken))) return "";
    
    if(_.isEmpty(localStorage.getItem(environment.jwtoken))) return "";
    
    if(_.isNull(localStorage.getItem(environment.jwtoken))) return "";

    let accesstoken = localStorage.getItem(environment.jwtoken);

    return accesstoken == null ? "" : accesstoken;
  }

  get currentUser() : any{
    let currentuser = localStorage.getItem(environment.jwtoken);
    
    if(currentuser == null) return false;
    
    let decoded = this.jwtService.DecodeToken(currentuser);
    if(!decoded) return false;

    //console.log(decoded);
    return decoded;
  }

}
