import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BananasComponent } from './apples/bananas/bananas.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SearchCardComponent } from './search-card/search-card.component';
import { BigsearchComponent } from './bigsearch/bigsearch.component';
import { MovieInfoComponent } from './movie-info/movie-info.component';
import { TicketsaleComponent } from './ticketsale/ticketsale.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'bananas',
    component: BananasComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'sign-up',
    component: SignupComponent,
  },
  {
    path: 'search-card',
    component: SearchCardComponent,
  },
  {
    path: 'bigsearch',
    component: BigsearchComponent,
  },
  {
    path: 'movie-info/:id',
    component: MovieInfoComponent,
  },
  {
    path: 'tickets/:name',
    component: TicketsaleComponent,
  },
];
