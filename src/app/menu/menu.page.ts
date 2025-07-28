import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, ReactiveFormsModule ]
})

export class MenuPage implements OnInit {

  lightTheme = 'var(--tema-claro)';
  darkTheme = 'var(--tema-oscuro)';
  currentTheme = this.lightTheme;
  oppositeTheme = this.darkTheme;

  lightLetter = 'var(--letras-tema-claro)';
  darkLetter = 'var(--letras-tema-oscuro)';
  currentLetter = this.lightLetter;
  oppositeLetter = this.darkTheme;

  lightBorder = 'var(--borde-tema-claro)';
  darkBorder = 'var(--borde-tema-oscuro)';
  currentBorder = this.lightBorder;
  oppositeBorder = this.darkTheme;

  selectedTheme: any;

  changeTheme: FormGroup;

  user: any = {
    id: '',
    name: ''
  };

  constructor(private storageService: StorageService, private navController: NavController, private formBuilder: FormBuilder, private userService: UserService) {

    this.changeTheme = this.formBuilder.group({

      theme: [true, Validators.requiredTrue]
    });
  }

  async ngOnInit() {

    const userId = await this.storageService.get('userId');

    if(userId) {

      this.user = await this.userService.getUser(userId);

      console.log(this.user)
    }

    const savedTheme = await this.storageService.get('theme');

    if(savedTheme === 'Light') {

      this.changeTheme.patchValue({ theme: false });

      this.currentTheme = this.lightTheme;
      this.currentLetter = this.lightLetter;
      this.currentBorder = this.lightBorder;

      this.oppositeTheme = this.darkTheme;
      this.oppositeLetter = this.darkLetter;
      this.oppositeBorder = this.darkBorder;

    } else {

      this.changeTheme.patchValue({ theme: true });

      this.currentTheme = this.darkTheme;
      this.currentLetter = this.darkLetter;
      this.currentBorder = this.darkBorder;

      this.oppositeTheme = this.lightTheme;
      this.oppositeLetter = this.lightLetter;
      this.oppositeBorder = this.lightBorder;
    }
  }

  logOut() {

    console.log("Cerrar sesion");

    this.storageService.set('logged', false);

    this.navController.navigateForward('/login');
  }

  onChange() {

    this.changeTheme.get('theme')!.markAsTouched();

    console.log(this.changeTheme.get('theme')?.value)

    if(this.changeTheme.get('theme')?.value === false) {

      this.currentTheme = this.lightTheme;
      this.currentLetter = this.lightLetter;
      this.currentBorder = this.lightBorder;

      this.oppositeTheme = this.darkTheme;
      this.oppositeLetter = this.darkLetter;
      this.oppositeBorder = this.darkBorder;

      this.selectedTheme = 'Light';

    } else {

      this.currentTheme = this.darkTheme;
      this.currentLetter = this.darkLetter;
      this.currentBorder = this.darkBorder;
      
      this.oppositeTheme = this.lightTheme;
      this.oppositeLetter = this.lightLetter;
      this.oppositeBorder = this.lightBorder;

      this.selectedTheme = 'Dark';
    }

    document.body.style.setProperty('--background', this.currentTheme);

    this.storageService.set('theme', this.selectedTheme);
  }
}
