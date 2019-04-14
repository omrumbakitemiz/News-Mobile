import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { NewsDetailsComponent } from './news/news-details/news-details.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'news'},
  {path: 'news', component: NewsComponent},
  {path: 'news/:id', component: NewsDetailsComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
