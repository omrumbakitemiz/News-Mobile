import { Component } from '@angular/core';
import { ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { News } from '../models/news';

import { NewsService } from '../services/news.service';
import { NewsSignalrService } from '../services/news-signalr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.scss']
})
export class NewsDetailsComponent {
  public selectedNewsId: string;
  public selectedNews: News;
  private getUpdatedNewsSubscription: Subscription;
  private toast: HTMLIonToastElement;

  constructor(
    public navCtrl: NavController,
    private newsService: NewsService,
    private signalRService: NewsSignalrService,
    private actionSheetController: ActionSheetController,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
  ) {
  }

  ionViewWillEnter() {
    this.route.params.subscribe(params => {
      this.selectedNewsId = params['id'];

      this.signalRService.startConnection().then(() => {
        this.signalRService.addLikeListener();
        this.signalRService.addDislikeListener();
        this.signalRService.addViewListener();

        this.newsService.increaseViewCount(this.selectedNewsId).subscribe(news => {
          this.selectedNews = news;
        });

        this.getUpdatedNewsSubscription = this.signalRService.getUpdatedNews().subscribe(updatedNews => {
          if (updatedNews) {
            this.selectedNews = updatedNews;
          }
        });
      });
    });
  }

  ionViewWillLeave() {
    this.signalRService.stopConnection().then(() => {
      this.getUpdatedNewsSubscription.unsubscribe();
    });
  }

  onLike() {
    this.newsService.likeNews(this.selectedNews.id).subscribe(
      news => this.selectedNews = news,
      error => this.handleError(error));
  }

  onDislike() {
    this.newsService.dislikeNews(this.selectedNews.id).subscribe(
      news => this.selectedNews = news,
      error => this.handleError(error));
  }

  onDelete() {
    this.newsService.deleteNews(this.selectedNews.id).subscribe(
      () => this.navCtrl.navigateBack(['../news']),
      error => this.handleError(error));
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose action...',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.onDelete();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 403) {
      this.presentToast(`${error.statusText} - You can not do this action!`);
    }
  }

  async presentToast(error: string) {
    console.log('error:', error);
    let errorMessage = 'An error occured!';
    if (error) {
      errorMessage = error;
    }
    this.toast = await this.toastController.create({
      message: errorMessage,
      duration: 10000,
      showCloseButton: true,
    });
    this.toast.present();
  }
}
