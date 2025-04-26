import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dasboard',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TabViewModule,
    ConfirmDialog,
    ToastModule,
    TooltipModule,
  ],
  templateUrl: './admin-dasboard.component.html',
  styleUrl: './admin-dasboard.component.css',
  providers: [ConfirmationService, MessageService],
})
export class AdminDasboardComponent implements OnInit {
  users: any[] = [];
  tickets: any[] = [];

  constructor(
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadTickets();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe((users) => {
      console.log(users);
      this.users = users;
    });
  }

  loadTickets() {
    this.adminService
      .getTickets()
      .subscribe((tickets) => (this.tickets = tickets));
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
      acceptButtonProps: {
        label: 'Cancel Ticket',
        severity: 'danger',
      },
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
}
