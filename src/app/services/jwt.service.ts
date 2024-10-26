import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  DecodeToken(token: string): (string | unknown) {

    let decode = undefined;
    try {
      decode = jwtDecode(token);
    } catch (error) {
      console.error(error);
    }
    return decode;

  }

}
