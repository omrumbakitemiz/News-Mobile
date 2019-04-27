import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';
import { UserService } from './news/services/user.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FCM,
    private router: Router,
    private userService: UserService,
    private storage: Storage,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get('user').then(user => {
        if (user) {
          this.userService.isAuthenticated.next(true);
          this.userService.token.next(user.token);
        }
      });
      if (this.platform.is('android')) {
        this.fcm.getToken().then(token => {
          console.log(token);
        });
        this.fcm.onTokenRefresh().subscribe(token => {
          console.log(token);
        });

        this.fcm.subscribeToTopic('news');

        this.fcm.onNotification().subscribe(data => {
          console.log('data:', data);
          if (data.wasTapped) {
            console.log('Received in background');
            this.router.navigate([`news/${data.newsId}`]);
          } else {
            console.log('Received in foreground');
            this.router.navigate([`news/${data.newsId}`]);
          }
        });
      }
    });
  }
}
