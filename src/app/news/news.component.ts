import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonRefresher, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { News } from './models/news';
import { NewsType } from './models/news-types.enum';
import { NewsService } from './services/news.service';
import { NewsSignalrService } from './services/news-signalr.service';

import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  public allNews: Array<News>;
  public newsTypes: Array<NewsType>;
  public selectedNewsType: NewsType;
  public loaded = false;
  private getUpdatedNewsSubscription: Subscription;
  private cachedNews: Array<News>;

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    private newsService: NewsService,
    private signalRService: NewsSignalrService,
    private userService: UserService,
    private route: ActivatedRoute,
    private storage: Storage,
  ) {
  }

  ngOnInit(): void {
    this.storage.get('user').then(user => {
      if (user) {
        this.userService.isAuthenticated.next(true);
      }
    });
  }

  async ionViewWillEnter() {
    this.newsService.getAllNewsTypes().subscribe(newsTypes => this.newsTypes = newsTypes);
    this.cachedNews = await this.storage.get('allNews');

    let newsObservable = this.newsService.getAllNews();
    if (this.cachedNews) {
      newsObservable = newsObservable.pipe(startWith(this.cachedNews));
      this.loaded = true;
    }

    newsObservable.subscribe((news) => {
        this.allNews = news.sort(this.sortFunction);

        this.storage.set('allNews', this.allNews);
        this.signalRService.startConnection().then(() => {
          this.loaded = true;

          this.signalRService.addNewsDataListener();
          this.getUpdatedNewsSubscription = this.signalRService.getUpdatedNews().subscribe(newNews => {
            if (newNews) {
              // remove old version of updated news to prevent duplicate news
              this.allNews = this.removeOldNews(this.allNews, newNews);
              this.allNews.push(newNews);
              this.allNews = this.allNews.sort(this.sortFunction);
              this.storage.set('allNews', this.allNews);
            }
          });
        });
      }, () => this.presentAlert('Cannot get news right now, please try again later. 😇')
    );
  }

  ionViewWillLeave() {
    this.signalRService.stopConnection().then(() => {
      this.getUpdatedNewsSubscription.unsubscribe();
    });
  }

  itemTapped(event, news: News) {
    this.navCtrl.navigateForward([news.id], {relativeTo: this.route});
  }

  onNewsTypeChange() {
    if (this.selectedNewsType) {
      if (this.selectedNewsType.toString() === 'None') {
        this.allNews.map(news => (news.hidden = false));
      }
      else {
        this.allNews.map(news => {
          if (news.type) {
            news.hidden = news.type !== this.selectedNewsType;
          }
        });
      }
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      subHeader: 'Oops!',
      message,
      buttons: ['OK']
    });

    alert.onDidDismiss().then(() => this.loaded = true);

    await alert.present();
  }

  refreshNews(event: CustomEvent<IonRefresher>) {
    this.newsService.getAllNews().subscribe(news => {
      this.allNews = news.sort(this.sortFunction);
      event.detail.complete();
    });
  }

  /**
   * Bu metod Array.sort() metoduna parametre olarak verilen tarih sıralama metodudur.
   * Varsayılan olarak küçük tarihten büyüğe doğru sıralama yapar.
   */
  sortFunction(news1: News, news2: News) {
    const date1 = new Date(news1.publishDate);
    const date2 = new Date(news2.publishDate);
    return date2.getTime() - date1.getTime();
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
