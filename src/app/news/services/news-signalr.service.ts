import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { News } from '../models/news';

import * as signalR from '@aspnet/signalr';

@Injectable()
export class NewsSignalrService {
  news = new BehaviorSubject<News>(null);

  public newNews: Array<any>;
  private hubConnection: signalR.HubConnection;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl('https://immino-news-api.herokuapp.com/newsHub').build();

    this.hubConnection
      .start()
      .then(() => console.log('connection started'))
      .catch(err => console.log('error:', err));
  }

  public stopConnection = () => {
    this.hubConnection
      .stop()
      .then(() => console.log('connection stopped'))
      .catch(err => console.log('error:', err));
  }

  public addNewsDataListener = () => {
    this.hubConnection.on('AddNews', newNews => {
      console.log('addNewsDataListener');
      this.newNews = newNews;
      this.news.next(newNews);
    });
  };

  public addLikeListener = () => {
    this.hubConnection.on('LikeNews', likedNews => this.news.next(likedNews));
  };

  public addDislikeListener = () => {
    this.hubConnection.on('DislikeNews', dislikedNews => this.news.next(dislikedNews));
  };

  public addViewListener() {
    this.hubConnection.on('ViewNews', viewedNews => this.news.next(viewedNews));
  }

  public getUpdatedNews(): Observable<News> {
    return this.news.asObservable();
  }
}
