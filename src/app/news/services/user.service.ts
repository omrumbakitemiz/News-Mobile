import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { baseUrl } from '../models/baseUrl';
import { UserDto } from '../models/userDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl = `http://localhost:5000/api/user`;

  constructor(private http: HttpClient) {
  }

  register(userDto: UserDto) {
    return this.http.post(this.userUrl, userDto);
  }

  login(userDto: UserDto) {
    return this.http.post(`${this.userUrl}/login`, userDto);
  }
}
