import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class LoginGuard implements CanActivate{

  constructor(private storageService: StorageService, private navCtrl: NavController) {}

  async canActivate() {

    const userLogged = await this.storageService.get('logged');

    if(userLogged === true) {

      return true

    } else {

      this.navCtrl.navigateForward("/login")
      
      return false
    }
  }
};
