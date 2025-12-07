import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  dob: string;
}

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
  providers: [MessageService],
  imports: [
    CalendarModule,
    CommonModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    CardModule,
  ],
})
export class MyAccountComponent implements OnInit {
  user: User = { id: 0, email: '', firstname: '', lastname: '', dob: '' };
  loading = false;

  constructor(private auth: AuthService, private messages: MessageService) {}

  ngOnInit() {
    this.auth.getUserDetails().subscribe({
      next: (u) => (this.user = u),
      error: () =>
        this.messages.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load your data',
        }),
    });
  }

  onSave(form: NgForm) {
    if (form.invalid) return;
    this.loading = true;
    const payload = {
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      dob: this.user.dob,
    };
    this.auth.updateCurrentUser(payload).subscribe({
      next: () => {
        this.loading = false;
        this.messages.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'Your profile has been updated',
        });
      },
      error: () => {
        this.loading = false;
        this.messages.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Update failed',
        });
      },
    });
  }
}
