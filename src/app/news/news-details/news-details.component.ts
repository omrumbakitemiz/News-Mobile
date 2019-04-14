import { Component, OnDestroy } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { News } from '../models/news';

import { NewsService } from '../services/news.service';
import { NewsSignalrService } from '../services/news-signalr.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.scss']
})
export class NewsDetailsComponent implements OnDestroy {
  selectedNewsId: string;
  selectedNews: News;
  getUpdatedNewsSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    private newsService: NewsService,
    private signalRService: NewsSignalrService,
    private actionSheetController: ActionSheetController,
    private route: ActivatedRoute
  ) {
  }

  ionViewWillEnter() {
    this.route.params.subscribe(params => {
      this.selectedNewsId = params['id'];

      this.signalRService.startConnection();
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
  }

  ngOnDestroy() {
    this.signalRService.stopConnection();
    this.getUpdatedNewsSubscription.unsubscribe();
  }

  onLike() {
    this.newsService.likeNews(this.selectedNews.id).subscribe(news => (this.selectedNews = news));
  }

  onDislike() {
    this.newsService.dislikeNews(this.selectedNews.id).subscribe(news => (this.selectedNews = news));
  }

  onDelete() {
    this.newsService.deleteNews(this.selectedNews.id).subscribe(() => {
      this.navCtrl.pop().then(() => console.log('popped...'));
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.onDelete();
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {}
      }, {
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {}
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {}
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {}
      }]
    });
    await actionSheet.present();
  }
}
