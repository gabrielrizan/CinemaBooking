import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    imports: [PasswordModule, DividerModule, CommonModule, FormsModule]
})
export class SignupComponent {
  signupForm = {
    firstname: '',
    lastname: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

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
      next: (response) => {
        console.log('User registered successfully:', response);
      },
      error: (error) => {
        console.error('Error during registration:', error);
        // Handle error (e.g., display validation errors)
      },
    });
  }
}
