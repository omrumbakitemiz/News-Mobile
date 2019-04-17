import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material'

import { IonicModule } from '@ionic/angular';

import { SignInPage } from './sign-in.page';
import { UserService } from '../news/services/user.service';

const routes: Routes = [
  {
    path: '',
    component: SignInPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
  ],
  declarations: [SignInPage],
  providers: [UserService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignInPageModule {}
