import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  email = ''
  password = ''

  constructor(private storageService: StorageService) { }

  async loadStorageData() {

    const savedEmail = await this.storageService.get('email')
    const savedPassword = await this.storageService.get('password')

    if(savedEmail) {

      this.email = savedEmail;
    }

    if(savedPassword) {

      this.password = savedPassword;
    }
  }

  async loginUser(credentials: any){

    await this.loadStorageData()

    console.log('Email desde storage:', this.email);
    console.log('Password desde storage:', this.password);
    console.log('Credenciales ingresadas:', credentials);

    return new Promise((accept, reject) => {

      if((credentials.email === "santiagodelaiglesia29@gmail.com" && credentials.password === "123456789") || (credentials.email === this.email && credentials.password === this.password)){

        accept("Login correcto")
        
      } else {

        reject("login incorrecto")
      }
    })
  }

  registerUser(credentials: any){

    return new Promise((accept, reject) => {

      if(credentials.name != null && credentials.last_name != null && credentials.email != null && credentials.password != null && credentials.confirm_password === credentials.password){

        accept("Registro correcto")
        
      } else {

        reject("Registro incorrecto")
      }
    })
  }
}
