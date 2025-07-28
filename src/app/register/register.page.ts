import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
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

  letter = 'var(--letras-tema-claro)';

  registerForm: FormGroup;

  avatar = '/assets/images/dark-avatar.png';

  background = '/assets/images/background-register.jpg';

  validationMessages = {

    name: [

      {
        type: "required", message: 'El nombre es obligatorio.'
      },
      {
        type: "pattern", message: "Caracteres invalidos."
      }
    ],

    userName: [

      {
        type: "required", message: 'El usuario es obligatorio.'
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

    confirmPassword: [

      {
        type: "required", message: 'Debe confirmar su contraseña.'
      }
    ]
  }

  constructor(private storageService: StorageService, private formBuilder: FormBuilder, private authService: AuthService, private navController: NavController, private toastController: ToastController) {

    this.registerForm = this.formBuilder.group({

      name: new FormControl(

        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
        ])
      ),

      userName: new FormControl(

        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]*$/)
        ])
      ),

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
      ),

      confirmPassword: new FormControl(

        '',
        Validators.required
      )
    },
    {
      validators: samePasswords('password', 'confirmPassword')
    })

    function samePasswords(password: string, confirm: string) {

      return (formGroup: FormGroup) => {

        const passwordInput = formGroup.controls[password];
        const confirmInput = formGroup.controls[confirm];
    
        if (passwordInput.value !== confirmInput.value) {

          confirmInput.setErrors({ notEqual: true });

        } else {
          
          if (confirmInput.errors && !confirmInput.errors['notEqual']) {

            return;
          }

          confirmInput.setErrors(null);
        }
      }
    }
  }

  async ngOnInit() {
    
    await this.storageService.get('registered');
  }

  async registerUser(credentials: any) {

    const response = await this.authService.registerUser(credentials);

    console.log(response)
    
    if (response.ok) {

      this.storageService.set('registered', true);

      const toast = await this.toastController.create({

        message: 'Usuario creado correctamente. Redireccionando al Login.',
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

      this.navController.navigateForward('/login');

    } else {

      this.storageService.set('registered', false);
        
      const toast = await this.toastController.create({

        message: 'El usuario ya se encuentra registrado. Vuelva a intentarlo.',
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

  goLogin() {

    this.navController.navigateForward('/login')
  }

  getBorderColor(field: any) {

    const validatedField = this.registerForm.get(field);

    if (!validatedField) {

      return 'var(--ion-color-dark)';
    }
  
    if ((validatedField.invalid && (validatedField.dirty || validatedField.touched))) {

      return 'var(--ion-color-danger)';

    } else if ((validatedField.valid && (validatedField.dirty || validatedField.touched))) {

      return 'var(--ion-color-success)';

    } else {
      
      return 'var(--ion-color-dark)';
    }
  }
}
