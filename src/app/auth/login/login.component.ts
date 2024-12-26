import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
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
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  visible = false;
  username = '';
  password = '';
  isLoggedIn: boolean = false; // Set this based on your actual authentication logic
  userFirstName: string = '';

  @ViewChild('op') overlayPanel!: OverlayPanel;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {
    this.isLoggedIn = this.authService.isTokenValid();
    this.authService.userDetails$.subscribe((user) => {
      if (user) {
        this.userFirstName = user.firstname;
        this.updateLoggedInItems();
      }
    });
  }

  private updateLoggedInItems() {
    this.loggedInItems = [
      {
        label: `Hi, ${this.userFirstName}`,
        disabled: true,
        styleClass: 'font-bold',
      },
      { separator: true },
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
      { separator: true },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
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
      command: () => this.logout(),
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
        this.cdr.detectChanges(); // Trigger change detection to update the UI
        this.overlayPanel.hide(); // Hide the overlay panel
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful',
        });
        // Optionally redirect after login
      },
      error: (error) => {
        console.error('Login failed', error);
        // Handle login error (e.g., show a message to the user)
        alert('Login failed. Please check your credentials.');
      },
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.cdr.detectChanges(); // Trigger change detection to update the UI
    this.overlayPanel.hide(); // Hide the overlay panel
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Logged out',
    });
  }

  showSignUpForm() {
    this.visible = true;
  }
}
