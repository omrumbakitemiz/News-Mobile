import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../news/services/user.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  signInFormGroup: FormGroup;
  loading: HTMLIonLoadingElement;
  toast: HTMLIonToastElement;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private storage: Storage
  ) {
  }

  ngOnInit() {
    if (this.userService.isAuthenticated.value) {
      this.router.navigate(['/news']);
    }
    else {
      this.signInFormGroup = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(2)]],
        passwordHash: ['', [Validators.required, Validators.minLength(8)]],
      })
    }
  }

  public onFormSubmit() {
    const value = this.signInFormGroup.value;
    if (value) {
      this.presentLoading().then(() => {
        this.userService.login(value).subscribe(loggedInUser => {
            this.storage.set('user', loggedInUser).then(() => {
              this.userService.isAuthenticated.next(true);
              this.userService.token.next(loggedInUser.token);
              this.loading.dismiss();
              this.router.navigate(['/news']);
            });
          },
          error => {
            this.loading.dismiss();
            this.presentToast(error);
          }
        )
      });
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

  async presentToast(error: any) {
    console.log('error:', error);
    let errorMessage = 'An error occured!';
    if (error && error.error) {
      errorMessage = error.error;
    }
    this.toast = await this.toastController.create({
      message: errorMessage,
      duration: 10000,
      showCloseButton: true,
    });
    this.toast.present();
  }
}
