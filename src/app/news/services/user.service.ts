import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { baseUrl } from '../models/baseUrl';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl = `http://localhost:5000/api/user`;

  constructor(private http: HttpClient) {
  }

  register(userDto: User): Observable<User> {
    return this.http.post<User>(this.userUrl, userDto);
  }

  login(userDto: User): Observable<string> {
    return this.http.post<string>(`${this.userUrl}/login`, userDto);
  }
}
