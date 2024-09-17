import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Base API URL for Djoser
  private apiUrl = 'http://127.0.0.1:8000/api/auth/'; // Adjusted base URL

  constructor(private http: HttpClient) {}

  /**
   * Register a new user
   * @param userData - The user data including firstname, lastname, email, dob, password, re_password
   * @returns Observable for the HTTP POST request
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}users/`, userData); // Register endpoint
  }

  /**
   * Log in with user credentials
   * @param credentials - The login credentials (email, password)
   * @returns Observable for the HTTP POST request
   */
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}jwt/create/`, credentials); // JWT login endpoint
  }

  /**
   * Log out the current user
   * @returns Observable for the HTTP POST request
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}jwt/logout/`, {}); // JWT logout endpoint
  }

  /**
   * Get details of the currently authenticated user
   * @returns Observable for the HTTP GET request
   */
  getUserDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}users/me/`); // Get current user details
  }
}
