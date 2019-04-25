import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { News } from '../models/news';
import { NewsType } from '../models/news-types.enum';
import { baseUrl } from '../models/baseUrl';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  newsUrl = `${ baseUrl }/news`;

  constructor(private http: HttpClient, private userService: UserService) {
  }

  getAllNews() {
    return this.http.get<Array<News>>(this.newsUrl);
  }

  saveNews(news: News) {
    return this.http.post<News>(this.newsUrl, news);
  }

  getAllNewsTypes() {
    const headers = new HttpHeaders();
    headers.append('Authentication', this.userService.token.value);
    return this.http.get<Array<NewsType>>(`${ this.newsUrl }/newsTypes`, {headers: headers});
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
