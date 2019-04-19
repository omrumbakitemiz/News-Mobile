import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LoadingController, ToastController } from '@ionic/angular';

import { UserService } from '../news/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  signUpFormGroup: FormGroup;
  loading: HTMLIonLoadingElement;
  toast: HTMLIonToastElement;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private router: Router,
    private storage: Storage
  ) {
  }

  ngOnInit() {
    this.signUpFormGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email, Validators.required]],
      passwordHash: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  public onFormSubmit() {
    const value = this.signUpFormGroup.value;
    if (value) {
      this.presentLoading().then(() => {
        this.userService.register(value).subscribe(
          () => {
            // this.storage.set('token', registeredUser).then(() => {
            //   this.loading.dismiss();
            // });
            this.loading.dismiss();
          },
          error => {
            console.log(error);
            this.loading.dismiss();
            this.presentToast(error.error.errors);
          },
          () => {
            this.loading.dismiss();
            this.router.navigate(['/sign-in']);
          })
      })
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'lines',
      keyboardClose: true,
      message: 'Please wait...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async presentToast(message?: Array<string>) {
    let errorMessage = 'An error occured!';
    if (message && message instanceof Array) {
      errorMessage = message.join('\n\n');
    }
    this.toast = await this.toastController.create({
      message: errorMessage,
      duration: 10000,
      showCloseButton: true,
    });
    this.toast.present();
  }
}
