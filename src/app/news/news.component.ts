import { Component } from '@angular/core';
import { News } from './models/news';
import { Subscription } from 'rxjs';
import { NewsType } from './models/news-types.enum';
import { AlertController, IonRefresher, NavController } from '@ionic/angular';
import { NewsService } from './services/news.service';
import { NewsSignalrService } from './services/news-signalr.service';

import { zip } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  public allNews: Array<News>;
  public newsTypes: Array<NewsType>;
  public selectedNewsType: NewsType;
  public loaded = false;
  private getUpdatedNewsSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    private newsService: NewsService,
    private signalRService: NewsSignalrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ionViewWillEnter() {
    this.loaded = false;
    const getAllNews = this.newsService.getAllNews();
    const getAllNewsTypes = this.newsService.getAllNewsTypes();

    zip(getAllNews, getAllNewsTypes).subscribe(
      ([news, newsTypes]) => {
        this.allNews = news;
        this.newsTypes = newsTypes;
        this.signalRService.startConnection().then(() => {

          this.signalRService.addNewsDataListener();
          this.getUpdatedNewsSubscription = this.signalRService.getUpdatedNews().subscribe(newNews => {
            if (newNews) {
              // remove old version of updated news to prevent duplicate news
              this.allNews = this.removeOldNews(this.allNews, newNews);
              this.allNews.push(newNews);
            }
            this.loaded = true;
          });
        });
      },
      () => {
        this.presentAlert('Cannot get news right now, please try again later. 😇');
      }
    );
  }

  ionViewWillLeave() {
    this.signalRService.stopConnection().then(() => {
      this.getUpdatedNewsSubscription.unsubscribe();
    });
  }

  itemTapped(event, news: News) {
    this.navCtrl.navigateForward([news.id], { relativeTo: this.route});
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      subHeader: 'Oops!',
      message,
      buttons: ['OK']
    });

    alert.onDidDismiss().then(() => (this.loaded = true));

    await alert.present();
  }

  onNewsTypeChange() {
    if (this.selectedNewsType) {
      if (this.selectedNewsType.toString() === 'None') {
        this.allNews.map(news => (news.hidden = false));
      } else {
        this.allNews.map(news => {
          if (news.type) {
            news.hidden = news.type !== this.selectedNewsType;
          }
        });
      }
    }
  }

  refreshNews(event: CustomEvent<IonRefresher>) {
    this.newsService.getAllNews().subscribe(news => {
      this.allNews = news;
      event.detail.complete();
    });
  }

  /**
   * This method removes the old news from `allNews` array, adds updated news to it and returns new array.
   * @param allNews All news, including old version of updated news
   * @param newNews Updated and news to be added to all news
   */
  removeOldNews(allNews: Array<News>, newNews: News) {
    let newNewsArray = [...allNews];
    const oldVersionOfUpdatedNews = this.allNews.find(news => news.id === newNews.id);
    if (oldVersionOfUpdatedNews) {
      newNewsArray = allNews.filter(news => news !== oldVersionOfUpdatedNews);
    }
    return newNewsArray;
  }

}
