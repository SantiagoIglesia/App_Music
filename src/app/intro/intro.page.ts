import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class IntroPage implements OnInit {

  lightTheme = 'var(--tema-claro)';
  darkTheme = 'var(--tema-oscuro)';
  currentTheme = this.lightTheme;

  intros = [
    {
      image: "/assets/images/intro-1.jpg"
    },
    {
      image: "/assets/images/intro-2.jpg"
    },
    {
      image: "/assets/images/intro-3.jpg"
    }
  ]

  constructor(private storageService: StorageService, private navController: NavController) { }

  async ngOnInit() {

    const savedTheme = await this.storageService.get('theme');

    if(savedTheme === 'Light') {

      this.currentTheme = this.lightTheme;

    } else {

      this.currentTheme = this.darkTheme;
    }
  }

  goHome() {

    this.storageService.set('visitedIntro', true)
    
    this.navController.navigateForward('/menu/home')
  }

}