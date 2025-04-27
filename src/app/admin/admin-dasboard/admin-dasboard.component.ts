import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AdminService } from '../../services/admin.service';
import {
  NowShowingService,
  Cinema,
  SeatLayout,
} from '../../services/now-showing.service';
import { LayoutCreationComponent } from '../layout-creation/layout-creation.component';
import { MovieCardComponent } from '../../movie-card/movie-card.component';
import { AddMovieComponent } from '../add-movie/add-movie.component';

interface SavedLayout {
  id: string;
  name: string;
  rows: number;
  layout: any;
  seatsPerRow: number[];
  createdAt: string;
}

@Component({
  selector: 'app-admin-dasboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TabViewModule,
    DialogModule,
    InputTextModule,
    CardModule,
    ConfirmDialog,
    ToastModule,
    TooltipModule,
    DropdownModule,
    LayoutCreationComponent,
    MovieCardComponent,
    AddMovieComponent,
  ],
  templateUrl: './admin-dasboard.component.html',
  styleUrls: ['./admin-dasboard.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AdminDasboardComponent implements OnInit {
  users: any[] = [];
  tickets: any[] = [];
  movies: any[] = [];
  allMovies: any[] = [];
  cinemas: Array<Cinema & { halls: SeatLayout[] }> = [];
  addMovieVisible = false;

  // dialogs
  cinemaDialogVisible = false;
  newCinema: Partial<Cinema> = { name: '', city: '', address: '' };

  hallDialogVisible = false;
  cinemaForNewHall: (Cinema & { halls: SeatLayout[] }) | null = null;
  newHallName = '';
  // <-- NEW dropdown state
  savedLayouts: SavedLayout[] = [];
  selectedLayoutId: string | null = null;

  constructor(
    private adminService: AdminService,
    private nowShowing: NowShowingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadTickets();
    this.loadCinemas();
    this.loadNowPlaying();
    this.loadAllMovies();

    // ←── LOAD your saved layouts from localStorage
    const stored = localStorage.getItem('savedLayouts');
    this.savedLayouts = stored ? JSON.parse(stored) : [];
  }

  loadUsers() {
    this.adminService.getUsers().subscribe((u) => (this.users = u));
  }

  loadTickets() {
    this.adminService.getTickets().subscribe((t) => (this.tickets = t));
  }

  loadCinemas() {
    this.nowShowing.getCinemas().subscribe((list) => {
      this.cinemas = list.map((c) => ({ ...c, halls: [] }));
      this.cinemas.forEach((cinema) =>
        this.nowShowing
          .getCinemaHallsByCinema(cinema.id)
          .subscribe((h) => (cinema.halls = h))
      );
    });
  }

  loadAllMovies() {
    this.nowShowing.getMovies().subscribe((data: any[]) => {
      console.log('All the movies', data);
      this.allMovies = data.map((movie) => ({
        title: movie.title,
        description: movie.synopsis,
        imageUrl: movie.poster,
        actors: movie.cast.split(',').map((a: string) => a.trim()),
        rating: +movie.rating / 10,
        trailerUrl: movie.trailer,
        movieId: movie.id,
        year: new Date(movie.release_date).getFullYear(),
        director: movie.director,
        duration: movie.runtime,
        genre: movie.genre,
        backgroundUrl: movie.backgroundUrl || 'default-background.jpg',
        ageRating: movie.ageRating || 'PG-13',
        nowPlaying: movie.nowPlaying,
      }));
    });
  }

  loadNowPlaying() {
    this.nowShowing.getNowPlayingMovies().subscribe((data: any[]) => {
      this.movies = data.map((movie) => ({
        title: movie.title,
        description: movie.synopsis,
        imageUrl: movie.poster,
        actors: movie.cast.split(',').map((a: string) => a.trim()),
        rating: +movie.rating / 10,
        trailerUrl: movie.trailer,
        movieId: movie.id,
        year: new Date(movie.release_date).getFullYear(),
        director: movie.director,
        duration: movie.runtime,
        genre: movie.genre,
        backgroundUrl: movie.backgroundUrl || 'default-background.jpg',
        ageRating: movie.ageRating || 'PG-13',
        nowPlaying: movie.nowPlaying,
      }));
    });
  }

  confirmCancel(event: Event, ticket: any) {
    this.confirmationService.confirm({
      key: 'cancelTicket',
      target: event.target as EventTarget,
      message: `Cancel ticket #${ticket.id}?`,
      header: 'Cancel ticket',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Close',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: { label: 'Cancel Ticket', severity: 'danger' },
      accept: () => {
        this.adminService.cancelTicket(ticket.id).subscribe(() => {
          ticket.payment_status = 'CANCELLED';
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: `Ticket #${ticket.id} cancelled`,
          });
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Aborted',
          detail: 'Cancellation aborted',
          life: 3000,
        });
      },
    });
  }

  confirmPromote(event: Event, user: any) {
    const makeAdmin = !user.is_staff;
    this.confirmationService.confirm({
      key: 'promoteUser',
      target: event.target as EventTarget,
      message: makeAdmin
        ? `Promote ${user.email} to Admin?`
        : `Revoke Admin from ${user.email}?`,
      header: 'Change Role',
      icon: 'pi pi-user-edit',
      rejectButtonProps: { label: 'No', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Yes', severity: 'success' },
      accept: () => {
        this.adminService.promoteUser(user.id, makeAdmin).subscribe(() => {
          user.is_staff = makeAdmin;
          this.messageService.add({
            severity: 'info',
            summary: 'Role Updated',
            detail: `${user.email} is now ${makeAdmin ? 'Admin' : 'User'}`,
          });
        });
      },
    });
  }

  createCinema() {
    this.newCinema = { name: '', city: '', address: '' };
    this.cinemaDialogVisible = true;
  }

  saveCinema() {
    this.nowShowing.addCinema(this.newCinema as Cinema).subscribe((cinema) => {
      this.cinemas.push({ ...cinema, halls: [] });
      this.cinemaDialogVisible = false;
    });
  }

  createHall(cinema: Cinema & { halls: SeatLayout[] }) {
    this.cinemaForNewHall = cinema;
    this.newHallName = '';
    this.selectedLayoutId = null; // ← reset dropdown
    this.hallDialogVisible = true;
  }

  saveHall() {
    if (!this.cinemaForNewHall) return;

    const chosen = this.savedLayouts.find(
      (l) => l.id === this.selectedLayoutId
    );
    if (!chosen) return; // nothing selected

    const payload: any = {
      name: this.newHallName,
      layout: chosen,
      rows: chosen.rows,
      seatsPerRow: chosen.seatsPerRow,
    };

    // 3️⃣ POST to your API
    this.nowShowing
      .addCinemaHall(this.cinemaForNewHall.id, payload)
      .subscribe((hall) => {
        this.cinemaForNewHall!.halls.push(hall);
        this.hallDialogVisible = false;
      });
  }

  get notShowingMovies() {
    return this.allMovies.filter((m) => !m.nowPlaying);
  }

  toggleNowPlaying(movieId: number, current: boolean) {
    const action = current
      ? 'pull this movie out of the cinemas'
      : 'put it back in the cinemas';
    this.confirmationService.confirm({
      message: `Are you sure you want to ${action}?`,
      header: 'Please Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.nowShowing
          .updateMovie(movieId, { nowPlaying: !current })
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: current
                ? 'Movie removed from cinemas'
                : 'Movie put back into cinemas',
            });
            this.loadNowPlaying();
            this.loadAllMovies();
          });
      },
    });
  }

  onMovieAdded() {
    this.addMovieVisible = false;
    this.loadNowPlaying();
    this.loadAllMovies();
  }
}
