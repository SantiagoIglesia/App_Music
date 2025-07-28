import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, NavController, ToastController  } from '@ionic/angular';
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

  letter = 'var(--letras-tema-oscuro)';

  loginForm: FormGroup;

  avatar = '/assets/images/light-avatar.png';

  background = '/assets/images/background-login.jpg';

  validationMessages = {

    email: [

      {
        type: "required", message: 'El correo electrónico es obligatorio.'
      },
      {
        type: "email", message: "Correo electrónico inválido."
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

  constructor(private storageService: StorageService, private formBuilder: FormBuilder, private authService: AuthService, private navController: NavController, private toastController: ToastController) {

    this.loginForm = this.formBuilder.group({

      email: new FormControl(

        '',
        Validators.compose([

          Validators.required,
          Validators.email
        ])
      ),

      password: new FormControl(

        '',
        Validators.compose([

          Validators.required,
          Validators.minLength(6)
        ])
      )
    })
  }

  async ngOnInit() {

    await this.storageService.get('logged');
  }

  async loginUser(credentials: any) {

    const response = await this.authService.loginUser(credentials);

    await this.storageService.set('userId', response.body.user.id);
      
    if (response.ok) {

      this.storageService.set('logged', true);
        
      const toast = await this.toastController.create({

        message: 'Usuario logueado correctamente. Redireccionado a la App.',
        duration: 3000,
        color: 'success',
        position: 'bottom',
        cssClass: "toast-content",
        buttons: [
          {
            text: 'Continuar',
            role: 'cancel'
          }
        ]
      });
      
      await toast.present();
      await toast.onDidDismiss();

      this.navController.navigateForward('/intro');
        
    } else {

      this.storageService.set('logged', false);
        
      const toast = await this.toastController.create({

        message: 'Ha ingresado mal sus datos. Vuelva a intentarlo.',
        duration: 3000,
        color: 'danger',
        position: 'bottom',
        cssClass: "toast-content",
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel'
          }
        ]
      });
      
      await toast.present();
      await toast.onDidDismiss();
    }
  }

  goRegister() {

    this.navController.navigateForward('/register');
  }

  getBorderColor(field: any) {

    const validatedField = this.loginForm.get(field);

    if (!validatedField) {

      return 'var(--ion-color-light)';
    }
  
    if ((validatedField.invalid && (validatedField.dirty || validatedField.touched))) {

      return 'var(--ion-color-danger)';

    } else if ((validatedField.valid && (validatedField.dirty || validatedField.touched))) {

      return 'var(--ion-color-success)';

    } else {
      
      return 'var(--ion-color-light)';
    }
  }
}
