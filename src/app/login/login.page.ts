import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})

export class LoginPage implements OnInit {

  //Definimos variables de letras
  letra = 'var(--letras-tema-oscuro)';

  loginForm: FormGroup;

  avatar = '/assets/images/avatar-blanco.jpg'

  background = '/assets/images/background-login.jpg'

  error_message = ''

  logged = false

  validation_messages = {

    email: [
      {
        type: "required", message: 'El correo electronico es obligatorio.'
      },
      {
        type: "email", message: "Correo electronico invalido."
      }
    ],

    password: [
      {
        type: "required", message: 'La contraseña es obligatoria.'
      },
      {
        type: "minlength", message: "La contraseña debe tener más de 6 caracteres."
      }
    ]
  }

  constructor(private router: Router, private storageService: StorageService, private formBuilder: FormBuilder, private authService: AuthService, private navCtrl: NavController) {

    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required, //Campo obligatorio
          Validators.email //Valida el correo electronico
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required, //Campo obligatorio
          Validators.minLength(6)
        ])
      )
    })
  }

  async ngOnInit() {
    
    await this.storageService.set('avatar', this.avatar)
    await this.storageService.set('logged', this.logged)
  }

  loginUser(credentials: any) {
    
    console.log(credentials)

    this.authService.loginUser(credentials).then(res => {

      this.error_message = ''

      this.navCtrl.navigateForward('/intro')

      this.storageService.set('logged', true)

    }).catch(error => {

      this.error_message = error

      this.storageService.set('logged', false)
    })
  }

  verRegister() {

    this.navCtrl.navigateForward('/register')
  }
}
