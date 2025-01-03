import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: {
        Authorization: `JWT ${token}`,
      },
    };
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}admin/users/`,
      this.getHeaders()
    );
  }

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}admin/tickets/`,
      this.getHeaders()
    );
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}admin/users/${userId}/`,
      userData,
      this.getHeaders()
    );
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}admin/users/${userId}/`,
      this.getHeaders()
    );
  }
}
