import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
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

  //Definimos variables de temas
  tema_claro = 'var(--tema-claro)';
  tema_oscuro = 'var(--tema-oscuro)';
  tema_actual = this.tema_claro;

  //Definimos variables de letras
  letra_tema_claro = 'var(--letras-tema-claro)';
  letra_tema_oscuro = 'var(--letras-tema-oscuro)';
  letra_tema_actual = this.letra_tema_claro;

  //Definimos variables de bordes
  borde_tema_claro = 'var(--borde-tema-claro)';
  borde_tema_oscuro = 'var(--borde-tema-oscuro)';
  borde_tema_actual = this.borde_tema_claro;
  
  pagAct = 'Intro'
  pagAnt = ''

  datos_cargados = false;

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

  constructor(private router: Router, private storageService: StorageService, private navCtrl: NavController) { }

  async ngOnInit() {

    await this.loadStorageData()

    this.datos_cargados = true;
  }

  async loadStorageData() {

    const savedTheme = await this.storageService.get('theme')
    const savedLetter = await this.storageService.get('letter')
    const savedPage = await this.storageService.get('navigation')

    if(savedTheme === 'Claro') {

      this.tema_actual = this.tema_claro;

    } else {

      this.tema_actual = this.tema_oscuro;
    }

    if(savedLetter === 'Clara') {

      this.letra_tema_actual = this.letra_tema_claro;

    } else {

      this.letra_tema_actual = this.letra_tema_oscuro;
    }
    
    if(savedPage) {

      this.pagAnt = savedPage;
    }
  }

  async verHome() {
    
    await this.storageService.set('navigation', this.pagAct)
    await this.storageService.set('visitoIntro', true)
    
    console.log("Ir al Home")
    this.navCtrl.navigateForward('/menu/home')
  }

}
