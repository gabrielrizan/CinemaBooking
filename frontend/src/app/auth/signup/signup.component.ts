import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [PasswordModule, DividerModule, CommonModule, FormsModule],
})
export class SignupComponent {
  @Output() registered = new EventEmitter<void>();
  isLoggedIn: boolean = false;
  signupForm = {
    firstname: '',
    lastname: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  isModalOpen = true;

  signupSuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.isLoggedIn = this.authService.isTokenValid();
  }

  onSubmit() {
    if (this.signupForm.password !== this.signupForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const payload = {
      firstname: this.signupForm.firstname,
      lastname: this.signupForm.lastname,
      dob: this.signupForm.dob,
      email: this.signupForm.email,
      password: this.signupForm.password,
      re_password: this.signupForm.confirmPassword,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        const credentials = {
          email: this.signupForm.email,
          password: this.signupForm.password,
        };

        this.authService.login(credentials).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Signed up and logged in successfully!',
            });

            this.registered.emit();
          },
          error: (err) => {
            console.error('Auto-login failed after registration:', err);
          },
        });
      },
      error: (error) => {
        console.error('Error during registration:', error);
      },
    });
  }
}
