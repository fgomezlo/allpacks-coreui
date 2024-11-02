import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private url = environment.services.customer.url;
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
        "function" : "delcustomer",
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

    body["function"]= "savecustomer";

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

  paisList() {
    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'access-token' : this.accesstoken
      }),
      responseType: 'json' as const
    };

    let body = {
      "function"  :"paislist"
    };

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

  destinoList() {
    const options = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'access-token' : this.accesstoken
      }),
      responseType: 'json' as const
    };

    let body = {
      "function"  :"destinolist"
    };

    return this.http.post(this.url, 
      body, 
      options).toPromise();
  }

}
