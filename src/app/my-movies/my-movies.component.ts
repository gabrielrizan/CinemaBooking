import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

interface UserMovie {
  title: string;
  date: Date;
  seats: string[];
  showtime: string;
  poster: string;
  ticketId: string;
  status: 'upcoming' | 'past' | 'cancelled';
}

@Component({
  selector: 'app-my-movies',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    TabViewModule,
    ButtonModule,
    TagModule,
  ],
  providers: [MessageService],
  templateUrl: './my-movies.component.html',
  styleUrls: ['./my-movies.component.css'],
})
export class MyMoviesComponent implements OnInit {
  upcomingMovies: UserMovie[] = [];
  pastMovies: UserMovie[] = [];
  activeTickets: UserMovie[] = [];

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Temporarily commented out for testing
    // if (!this.authService.isTokenValid()) {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Access Denied',
    //     detail: 'Please log in to view your movies',
    //   });
    //   return;
    // }

    // Load user movies
    this.loadUserMovies();
  }

  private loadUserMovies() {
    // Mock data - replace with actual API calls
    this.upcomingMovies = [
      {
        title: 'Upcoming Movie 1',
        date: new Date('2024-04-20'),
        seats: ['A1', 'A2'],
        showtime: '19:00',
        poster: 'assets/movie1.jpg',
        ticketId: 'T12345',
        status: 'upcoming',
      },
    ];

    this.pastMovies = [
      {
        title: 'Past Movie 1',
        date: new Date('2024-03-15'),
        seats: ['B3', 'B4'],
        showtime: '20:00',
        poster: 'assets/movie2.jpg',
        ticketId: 'T12344',
        status: 'past',
      },
    ];
  }

  getStatusSeverity(
    status: string
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Cancelled':
        return 'danger';
      case 'Expired':
        return 'secondary';
      case 'Pending':
        return 'warn';
      default:
        return 'info';
    }
  }

  cancelTicket(ticketId: string) {
    // TODO: Implement ticket cancellation logic
    this.messageService.add({
      severity: 'success',
      summary: 'Ticket Cancelled',
      detail: `Ticket ${ticketId} has been cancelled`,
    });
  }
}
