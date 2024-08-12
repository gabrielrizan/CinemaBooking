import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BananasComponent } from './apples/bananas/bananas.component';
import { SignupComponent } from './auth/signup/signup.component';

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
];
