import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

interface UserDetails {
  email: string;
  firstname: string;
  lastname: string;
  dob: string;
  is_staff: boolean;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

interface RegisterResponse {
  email: string;
  firstname: string;
  lastname: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isTokenValid());
  private userDetailsSubject = new BehaviorSubject<UserDetails | null>(null);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userDetails$ = this.userDetailsSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.setLoginStatus(this.isTokenValid());
    if (this.isTokenValid()) {
      this.loadUserDetails();
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}jwt/create/`, credentials)
      .pipe(
        tap((response) => {
          if (response.access) {
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);
            this.setLoginStatus(true);
            this.loadUserDetails();
          }
        })
      );
  }

  private async loadUserDetails() {
    try {
      await this.getUserDetails().toPromise();
    } catch (error) {
      // Handle error silently or with user notification
    }
  }

  getUserDetails(): Observable<UserDetails> {
    const token = localStorage.getItem('access_token');
    return this.http
      .get<UserDetails>(`${this.apiUrl}users/me/`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
      .pipe(
        tap({
          next: (user) => {
            this.userDetailsSubject.next(user);
            this.isAdminSubject.next(user.is_staff === true);
          },
          error: () => {
            this.userDetailsSubject.next(null);
            this.isAdminSubject.next(false);
          },
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.setLoginStatus(false);
    this.userDetailsSubject.next(null);
    this.isAdminSubject.next(false);
    this.router.navigate(['/home']);
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  setLoginStatus(loggedIn: boolean) {
    this.isLoggedInSubject.next(loggedIn);
  }

  register(userData: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    dob: string;
  }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}users/`, userData);
  }

  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }
}
