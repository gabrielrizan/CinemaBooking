import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { SignupComponent } from '../../auth/signup/signup.component';
import { DialogModule } from 'primeng/dialog';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    DividerModule,
    SignupComponent,
    DialogModule,
    TieredMenuModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;

  @ViewChild('op') overlayPanel: OverlayPanel | undefined;

  visible: boolean = false;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/home'],
      },
      {
        label: 'Movies',
        icon: 'pi pi-video',
        items: [
          {
            label: 'Now Showing',
            icon: 'pi pi-play',
            routerLink: ['/movies/now-showing'],
          },
          {
            label: 'Coming Soon',
            icon: 'pi pi-clock',
            routerLink: ['/movies/coming-soon'],
          },
          {
            label: 'Top Rated',
            icon: 'pi pi-thumbs-up',
            routerLink: ['/movies/top-rated'],
          },
        ],
      },
      {
        label: 'Offers',
        icon: 'pi pi-tag',
        items: [
          {
            label: 'Discounts',
            icon: 'pi pi-percentage',
            routerLink: ['/offers/discounts'],
          },
          {
            label: 'Memberships',
            icon: 'pi pi-id-card',
            routerLink: ['/offers/memberships'],
          },
        ],
      },
      {
        label: 'Snacks',
        icon: 'pi pi-shopping-bag',
        items: [
          {
            label: 'Popcorn',
            icon: 'pi pi-shopping-cart',
            routerLink: ['/snacks/popcorn'],
          },
          {
            label: 'Drinks',
            icon: 'pi pi-glass-martini',
            routerLink: ['/snacks/drinks'],
          },
          {
            label: 'Combos',
            icon: 'pi pi-box',
            routerLink: ['/snacks/combos'],
          },
        ],
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        routerLink: ['/contact'],
      },
      {
        label: 'About Us',
        icon: 'pi pi-info-circle',
        routerLink: ['/about'],
      },
    ];
  }

  isLoggedIn = true; // Set this based on your actual authentication logic

  loggedInItems: MenuItem[] = [
    {
      label: 'My Account',
      icon: 'pi pi-user',
      routerLink: ['/my-account'],
    },
    {
      label: 'My Tickets',
      icon: 'pi pi-ticket',
      routerLink: ['/my-tickets'],
    },
    {
      label: 'My Searches',
      icon: 'pi pi-history',
      routerLink: ['/my-searches'],
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
    },
  ];

  logout() {
    // Implement your logout logic here
    this.isLoggedIn = false;
    this.overlayPanel?.hide();
  }

  logIn() {
    // Handle log in logic
    console.log('Log In button clicked');
  }

  signUp() {
    // Handle sign up logic
    console.log('Sign Up button clicked');
  }

  showSignUpForm() {
    this.visible = true;
  }
}
