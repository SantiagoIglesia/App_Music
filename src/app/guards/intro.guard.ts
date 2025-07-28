import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class IntroGuard implements CanActivate{

  constructor(private storageService: StorageService, private router: Router) {}

  async canActivate() {

    const viewIntro = await this.storageService.get('visitedIntro');

    if(viewIntro === true) {

      return true

    } else {

      this.router.navigateByUrl("/intro")
      
      return false
    }
  }
}