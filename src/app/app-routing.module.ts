import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { NewsDetailsComponent } from './news/news-details/news-details.component';
import { NewsGuard } from './news/news.guard';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'news'},
  {path: 'news', component: NewsComponent, canActivate: [NewsGuard]},
  {path: 'news/:id', component: NewsDetailsComponent, canActivate: [NewsGuard]},
  {path: 'sign-up', loadChildren: './sign-up/sign-up.module#SignUpPageModule'},
  {path: 'sign-in', loadChildren: './sign-in/sign-in.module#SignInPageModule'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
