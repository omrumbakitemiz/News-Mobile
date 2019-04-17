import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { News } from '../models/news';
import { NewsType } from '../models/news-types.enum';
import { baseUrl } from '../models/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  newsUrl = `${ baseUrl }/news`;
  userUrl = `${ baseUrl }/user`;

  constructor(private http: HttpClient) {
  }

  getAllNews() {
    return this.http.get<Array<News>>(this.newsUrl);
  }

  saveNews(news: News) {
    return this.http.post<News>(this.newsUrl, news);
  }

  getAllNewsTypes() {
    return this.http.get<Array<NewsType>>(`${ this.newsUrl }/newsTypes`);
  }

  deleteNews(newsId: string) {
    return this.http.delete(`${ this.newsUrl }/${ newsId }`);
  }

  likeNews(newsId: string) {
    return this.http.get(`${ this.newsUrl }/like/${ newsId }`);
  }

  dislikeNews(newsId: string) {
    return this.http.get(`${ this.newsUrl }/dislike/${ newsId }`);
  }

  increaseViewCount(newsId: string) {
    return this.http.get(`${ this.newsUrl }/view/${ newsId }`);
  }
}
