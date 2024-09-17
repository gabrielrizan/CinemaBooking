import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode as default

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/'; // Adjust to your API base URL
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isTokenValid());

  // Observable to track login status globally
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    // On application load, set the login status based on token validity
    this.setLoginStatus(this.isTokenValid());
    console.log('Login status:', this.isTokenValid());
  }

  // Method to log in using Djoser's JWT token endpoint
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}jwt/create/`, credentials);
  }

  //
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}users/`, userData); // Register endpoint
  }

  // Check if token exists and is valid
  isTokenValid(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token); // Decode the token correctly
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
      if (decodedToken?.exp && decodedToken.exp > currentTime) {
        // Token is valid
        return true;
      } else {
        // Token has expired
        return false;
      }
    } catch (error) {
      // If token decoding fails, consider it invalid
      return false;
    }
  }

  // Update login status when user logs in
  setLoginStatus(loggedIn: boolean) {
    this.isLoggedInSubject.next(loggedIn);
  }

  // Store the tokens and update login status
  storeTokens(tokens: { access: string; refresh: string }) {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    this.setLoginStatus(true);
  }

  // Remove tokens and set login status to false
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.setLoginStatus(false);
  }
}
