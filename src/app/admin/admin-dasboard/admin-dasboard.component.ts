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
  ],
  templateUrl: './admin-dasboard.component.html',
  styleUrls: ['./admin-dasboard.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AdminDasboardComponent implements OnInit {
  users: any[] = [];
  tickets: any[] = [];
  cinemas: Array<Cinema & { halls: SeatLayout[] }> = [];

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

    // 1️⃣ find the selected layout object
    const chosen = this.savedLayouts.find(
      (l) => l.id === this.selectedLayoutId
    );
    if (!chosen) return; // nothing selected

    // 2️⃣ build payload with the full SavedLayout
    const payload: any = {
      name: this.newHallName,
      layout: chosen, // <-- entire SavedLayout
      rows: chosen.rows,
      seatsPerRow: chosen.seatsPerRow,
    };

    // 3️⃣ POST to your API
    this.nowShowing
      .addCinemaHall(this.cinemaForNewHall.id, payload)
      .subscribe((hall) => {
        // push the newly created CinemaHall onto the UI list
        this.cinemaForNewHall!.halls.push(hall);
        this.hallDialogVisible = false;
      });
  }
}
