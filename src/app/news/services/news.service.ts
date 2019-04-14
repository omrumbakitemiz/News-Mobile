import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { News } from '../models/news';
import { NewsType } from '../models/news-types.enum';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  url = 'https://immino-news-api.herokuapp.com/api/news';

  constructor(private http: HttpClient) { }

  getAllNews() {
    return this.http.get<Array<News>>(this.url);
  }

  saveNews(news: News) {
    return this.http.post<News>(this.url, news);
  }

  getAllNewsTypes() {
    return this.http.get<Array<NewsType>>(`${this.url}/newsTypes`);
  }

  deleteNews(newsId: string) {
    return this.http.delete(`${this.url}/${newsId}`);
  }

  likeNews(newsId: string) {
    return this.http.get(`${this.url}/like/${newsId}`);
  }

  dislikeNews(newsId: string) {
    return this.http.get(`${this.url}/dislike/${newsId}`);
  }

  increaseViewCount(newsId: string) {
    return this.http.get(`${this.url}/view/${newsId}`);
  }
}
