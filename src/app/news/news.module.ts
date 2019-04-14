import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from '../app-routing.module';

import { NewsComponent } from './news.component';
import { NewsDetailsComponent } from './news-details/news-details.component';
import { NewsService } from './services/news.service';
import { NewsSignalrService } from './services/news-signalr.service';

import {
  MatButtonModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material';

@NgModule({
  declarations: [NewsComponent, NewsDetailsComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    AppRoutingModule,
    HttpClientModule
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    NewsComponent,
    NewsDetailsComponent
  ],
  providers: [NewsService, NewsSignalrService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NewsModule {
}
