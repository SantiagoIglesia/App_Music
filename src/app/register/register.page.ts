import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})

export class RegisterPage implements OnInit {

  //Definimos variables de letras
  letra = 'var(--letras-tema-claro)';

  registerForm: FormGroup;

  avatar = '/assets/images/avatar-negro.jpg'

  background = '/assets/images/background-register.jpg'

  error_message = ''

  logged = false

  validation_messages = {

    name: [
      {
        type: "required", message: 'El nombre es obligatorio.'
      },
      {
        type: "pattern", message: "Caracteres invalidos."
      }
    ],

    last_name: [
      {
        type: "required", message: 'El apellido es obligatorio.'
      },
      {
        type: "pattern", message: "Caracteres invalidos."
      }
    ],
    
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
    ],

    confirm_password: [
      {
        type: "required", message: 'Debe confirmar su contraseña.'
      }
    ]
  }

  password = ''
  confirm_pass = ''

  constructor(private router: Router, private storageService: StorageService, private formBuilder: FormBuilder, private authService: AuthService, private navCtrl: NavController) {

    this.registerForm = this.formBuilder.group({

      name: new FormControl(
        '',
        Validators.compose([
          Validators.required, //Campo obligatorio
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/) //Valida que sea solo letras
        ])
      ),

      last_name: new FormControl(
        '',
        Validators.compose([
          Validators.required, //Campo obligatorio
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/) //Valida que sea solo letras
        ])
      ),

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
      ),

      confirm_password: new FormControl(
        '', Validators.required //Campo obligatorio
      )
    },
    {
      validators: passwordsIguales('password', 'confirm_password')
    })

    function passwordsIguales(passwordKey: string, confirmKey: string) {

      return (formGroup: FormGroup) => {

        const password = formGroup.controls[passwordKey];
        const confirmPassword = formGroup.controls[confirmKey];
    
        if (password.value !== confirmPassword.value) {

          confirmPassword.setErrors({ notEqual: true });

        } else {
          
          if (confirmPassword.errors && !confirmPassword.errors['notEqual']) {

            return;
          }

          confirmPassword.setErrors(null);
        }
      }
    }
  }

  async ngOnInit() {
    
    await this.storageService.set('avatar', this.avatar)
    await this.storageService.set('logged', this.logged)
  }

  registerUser(credentials: any) {

    console.log(credentials)

    this.authService.registerUser(credentials).then(res => {

      this.error_message = ''

      this.storageService.set('name', credentials.name)
      this.storageService.set('last_name', credentials.last_name)
      this.storageService.set('email', credentials.email)
      this.storageService.set('password', credentials.password)

      this.navCtrl.navigateForward('/login')

      this.storageService.set('registered', true)

    }).catch(error => {

      this.error_message = error

      this.storageService.set('registered', false)
    })
  }

  verLogin() {

    this.navCtrl.navigateForward('/login')
  }
}
