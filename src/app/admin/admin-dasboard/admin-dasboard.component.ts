import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dasboard',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TabViewModule],
  templateUrl: './admin-dasboard.component.html',
  styleUrl: './admin-dasboard.component.css',
})
export class AdminDasboardComponent implements OnInit {
  users: any[] = [];
  tickets: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadTickets();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  loadTickets() {
    this.adminService.getTickets().subscribe((tickets) => {
      this.tickets = tickets;
    });
  }
}
