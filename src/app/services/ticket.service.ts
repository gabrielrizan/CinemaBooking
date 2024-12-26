import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: new HttpHeaders({
        Authorization: `JWT ${token}`,
      }),
    };
  }

  createTicket(ticketData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/tickets/`,
      ticketData,
      this.getHeaders()
    );
  }

  getUserTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(
      `${this.apiUrl}/tickets/`,
      this.getHeaders()
    );
  }

  confirmPayment(ticketId: number, paymentIntentId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/tickets/${ticketId}/confirm_payment/`,
      {
        payment_intent_id: paymentIntentId,
      },
      this.getHeaders()
    );
  }

  updateTicketStatus(ticketId: string, status: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/tickets/${ticketId}/`,
      { payment_status: status },
      this.getHeaders()
    );
  }
}
