import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ConsolidacionService {

  private url = environment.services.consolidacion.url;
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
//        "offset" : params && params["offset"] ? params["offset"] : null
    };

    body = _.merge(body, params)

    //console.log(JSON.stringify(body));

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

  tracking(params: any[any] | null) {

    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'access-token' : this.accesstoken
      }),
      responseType: 'json' as const
    };
    
    let body = {
        "function" : "tracking",
//        "offset" : params && params["offset"] ? params["offset"] : null
    };

    body = _.merge(body, params)

    //console.log(JSON.stringify(body));

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

  estadoList() {
    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'access-token' : this.accesstoken
      }),
      responseType: 'json' as const
    };

    let body = {
      "function"  :"estadolist"
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
        "function" : "delconsolidacion",
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

    body["function"]= "saveconsolidacion";

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

  changestatus(id:string, status:string) {
    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'access-token' : this.accesstoken
      }),
      responseType: 'json' as const
    };

    let body = {
        "function" : "changestatusconsolidacion",
        "id" : id,
        "status" : status
    };

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

  changestatusreempacado(id:string, warehouse:string) {
    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'access-token' : this.accesstoken
      }),
      responseType: 'json' as const
    };

    let body = {
        "function" : "changestatusconsolidacion",
        "id" : id,
        "status" : "5", // reempacado code in db
        "whreempaque" : warehouse
    };

    console.log(body);
    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

  savetracking(id:string , paquetes: any) {
    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'access-token' : this.accesstoken
      }),
      responseType: 'json' as const
    };

    let body = {
        "function" : "savetracking",
        "id" : id,
        "paquetes" : paquetes
    };

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }
}
