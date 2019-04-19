import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegisterResource } from '../models/registerResource';
import { LoginResource } from '../models/loginResource';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl = `http://localhost:5000/api/user`;
  isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  register(userDto: User): Observable<RegisterResource> {
    return this.http.post<RegisterResource>(this.userUrl, userDto);
  }

  login(userDto: User): Observable<LoginResource> {
    return this.http.post<LoginResource>(`${this.userUrl}/login`, userDto);
  }
}
