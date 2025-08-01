import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  urlServer = "https://music.fly.dev"

  constructor(private http: HttpClient) { }

  async loginUser(credentials: any): Promise<any> {

    const url = `${this.urlServer}/login`;
    
    const body = {

      "user": {
        "email": credentials.email,
        "password": credentials.password
      }
    };

    const headers = new HttpHeaders({

      'Content-Type': 'application/json'
    });

    try {

      const response = await firstValueFrom(this.http.post(url, body, {
        headers,
        observe: 'response'
      }));

      return {

        ok: true,
        status: response.status,
        body: response.body
      };
    
    } catch(error: any) {

      return {

        ok: false,
        status: error.status,
        message: error?.error?.message || 'Error en la solicitud'
      }

    }
  }

  async registerUser(credentials: any): Promise<any> {

    const url = `${this.urlServer}/signup`;
    
    const body = {

      "user": {
        "email": credentials.email,
        "password": credentials.password,
        "name": credentials.name,
        "username": credentials.userName
      }
    };

    const headers = new HttpHeaders({

      'Content-Type': 'application/json'
    });

    try {

      const response = await firstValueFrom(this.http.post(url, body, {
        headers,
        observe: 'response'
      }));

      return {

        ok: true,
        status: response.status,
        body: response.body
      };
    
    } catch(error: any) {

      return {

        ok: false,
        status: error.status,
        message: error?.error?.message || 'Error en la solicitud'
      }

    }
  }
}
