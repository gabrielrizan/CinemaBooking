import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Popover, PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AuthService } from '../../services/auth.service';
import { DialogModule } from 'primeng/dialog';
import { SignupComponent } from '../signup/signup.component';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PopoverModule, // Use Popover instead of OverlayPanel
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
export class LoginComponent implements OnInit {
  visible = false;
  username = '';
  password = '';
  isLoggedIn: boolean = false;
  userFirstName: string = '';
  isAdmin: boolean = false;
  public avatarElementRef?: HTMLElement;
  public setAvatarReference(element: HTMLElement): void {
    this.avatarElementRef = element;
  }

  @ViewChild('op') popover!: Popover;

  ngOnInit(): void {
    this.sharedService.loginPanel$.subscribe(() => {
      this.openPanelAtTarget(
        this.avatarElementRef ?? this.popover.el.nativeElement
      );
    });
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
      routerLink: ['/my-movies'],
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private sharedService: SharedService
  ) {
    this.isLoggedIn = this.authService.isTokenValid();
    this.authService.userDetails$.subscribe((user) => {
      if (user) {
        this.userFirstName = user.firstname;
        this.isAdmin = user.is_staff === true;
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
      ...(this.isAdmin
        ? [
            {
              label: this.authService.isAdminView()
                ? 'Switch to Regular View'
                : 'Switch to Admin View',
              icon: 'pi pi-sync',
              command: () => {
                this.authService.toggleAdminView();
                this.updateLoggedInItems();
              },
            },
            { separator: true },
          ]
        : []),
      {
        label: 'My Account',
        icon: 'pi pi-user',
        routerLink: ['/my-account'],
      },
      {
        label: 'My Tickets',
        icon: 'pi pi-ticket',
        routerLink: ['/my-movies'],
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
    this.popover.toggle(event);
  }

  openPanelAtTarget(targetElement: HTMLElement): void {
    const pseudoEvent = {
      type: 'click',
      target: targetElement,
      currentTarget: targetElement,
      preventDefault: () => {},
      stopPropagation: () => {},
    };
    this.popover.show(pseudoEvent, targetElement);
  }

  onLogin() {
    const credentials = {
      email: this.username,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);

        console.log('Login successful', response);

        this.isLoggedIn = true;
        this.cdr.detectChanges();
        this.popover.hide();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful',
        });
      },
      error: (error) => {
        console.error('Login failed', error);
        alert('Login failed. Please check your credentials.');
      },
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.cdr.detectChanges();
    this.popover.hide();
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Logged out',
    });
  }

  showSignUpForm() {
    this.visible = true;
  }

  onSignupSuccess() {
    this.visible = false; // Close modal
    this.isLoggedIn = true;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Signed up successfully',
    });
  }
}
