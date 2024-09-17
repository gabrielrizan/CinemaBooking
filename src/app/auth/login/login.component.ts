import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AuthService } from '../../services/auth.service'; // Import the AuthService
import { DialogModule } from 'primeng/dialog';
import { SignupComponent } from '../signup/signup.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverlayPanelModule,
    ButtonModule,
    InputTextModule,
    DividerModule,
    TieredMenuModule,
    DialogModule,
    SignupComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  visible = false;
  username = '';
  password = '';
  isLoggedIn : boolean = false; // Set this based on your actual authentication logic

  @ViewChild('op') overlayPanel!: OverlayPanel;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isTokenValid(); // Check if the user is already logged in
  }

  togglePanel(event: Event) {
    this.overlayPanel.toggle(event); // Use the toggle method from OverlayPanel
  }

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
      command: () => this.authService.logout(),
    },
  ];

  onLogin() {
    const credentials = {
      email: this.username,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Store the JWT token
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);

        console.log('Login successful', response);

        // Mark user as logged in
        this.isLoggedIn = true;

        // Optionally redirect after login
        this.router.navigate(['/dashboard']); // Adjust this route
      },
      error: (error) => {
        console.error('Login failed', error);
        // Handle login error (e.g., show a message to the user)
        alert('Login failed. Please check your credentials.');
      },
    });
  }

  showSignUpForm() {
    this.visible = true;
  }
}
