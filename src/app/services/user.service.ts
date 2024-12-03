import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import * as _ from 'lodash-es'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = environment.services.user.url;
  private accesstoken;

  constructor(private http: HttpClient, 
    private authService: AuthService ) { 
      this.accesstoken = this.authService.getCurrentAccessToken();
    }


  search(params: any[any] | null) {

    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'access-token' : this.accesstoken
      }),
      responseType: 'json' as const
    };

    let body = {
        "function" : "search",
        "filtervalue" : params && params["filtervalue"] ? params["filtervalue"] : null,
        "offset" : params && params["offset"] ? params["offset"] : null
    };

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

  delete(id:string) {

    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'access-token' : this.accesstoken
      }),
      responseType: 'json' as const
    };

    let body = {
        "function" : "deluser",
        "id" : id
    };

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

  save(body: any) {

    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'access-token' : this.accesstoken
      }),
      responseType: 'json' as const
    };

    body["function"]= "saveuser";

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

  rolList() {
    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'access-token' : this.accesstoken
      }),
      responseType: 'json' as const
    };

    let body = {
      "function"  :"rollist"
    };

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

  updateDataProfile(userchange: any) {
    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'access-token' : this.authService.getCurrentAccessToken()
      }),
      responseType: 'json' as const
    };

    let body : any = {
        "function" : "updateprofile",
        "name" : userchange.name
    };

    if(!_.isEmpty(userchange.password)) {
      body["password"] = userchange.password;
    }

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

}
