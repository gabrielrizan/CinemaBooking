import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BananasComponent } from './apples/bananas/bananas.component';

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
];
