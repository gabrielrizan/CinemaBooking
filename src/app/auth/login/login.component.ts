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
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  isLoggedIn = false;
  loggedInItems = []; // Replace with your menu items

  @ViewChild('op') overlayPanel!: OverlayPanel;

  constructor(private authService: AuthService, private router: Router) {}

  togglePanel(event: Event) {
    this.overlayPanel.toggle(event); // Use the toggle method from OverlayPanel
  }

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
    console.log('Redirecting to signup');
    this.router.navigate(['/signup']);
  }
}
