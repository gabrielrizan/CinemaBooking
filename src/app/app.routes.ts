import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BananasComponent } from './apples/bananas/bananas.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SearchCardComponent } from './search-card/search-card.component';
import { BigsearchComponent } from './bigsearch/bigsearch.component';
import { MovieInfoComponent } from './movie-info/movie-info.component';
import { NowShowingComponent } from './layout/now-showing/now-showing.component';
import { TicketSelectionComponent } from './layout/ticket-selection/ticket-selection.component';
import { MyMoviesComponent } from './my-movies/my-movies.component';
import { authGuard } from './layout/guards/auth.guard';
import { AdminDasboardComponent } from './admin/admin-dasboard/admin-dasboard.component';
import { adminGuard } from './layout/guards/admin.guard';
import { LayoutCreationComponent } from './admin/layout-creation/layout-creation.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { RecommendationComponent } from './recommendation/recommendation.component';

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
    path: 'movie-info/:mediaType/:id',
    component: MovieInfoComponent,
  },
  {
    path: 'movies/now-showing',
    component: NowShowingComponent,
  },
  {
    path: 'select-tickets',
    component: TicketSelectionComponent,
  },
  {
    path: 'my-movies',
    component: MyMoviesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/dashboard',
    component: AdminDasboardComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'layout',
    component: LayoutCreationComponent,
  },
  {
    path: 'chatbot',
    component: ChatbotComponent,
  },
  {
    path: 'for-you',
    component: RecommendationComponent,
  },
];
