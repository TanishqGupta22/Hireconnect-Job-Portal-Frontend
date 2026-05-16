import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'CANDIDATE' | 'RECRUITER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  user: {
    id: number;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<AuthResponse['user'] | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        // Try to get user from localStorage first, then fallback to JWT claims
        const savedUser = localStorage.getItem('user');
        const user = savedUser ? JSON.parse(savedUser) : (decoded.user || {
          id: decoded.id,
          email: decoded.email || decoded.sub,
          name: decoded.name,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          role: decoded.role || decoded.roles?.[0]
        });
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error decoding token:', error);
        this.removeToken();
      }
    }
  }

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return { headers };
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('Attempting login to:', `${this.apiUrl}/auth/login`);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials, this.getHttpOptions()).pipe(
      tap(response => {
        const token = response.accessToken;
        this.setToken(token, response.user);
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. Please try again.';
        
        if (error.status === 400 || error.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.status === 0 || error.status === 503) {
          errorMessage = 'Authentication service is currently unavailable.';
        }
        
        return throwError(() => ({ ...error, userMessage: errorMessage }));
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData, this.getHttpOptions()).pipe(
      tap(response => {
        const token = response.accessToken;
        this.setToken(token, response.user);
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.status === 400) {
          errorMessage = error.error?.message || 'Invalid registration data.';
        } else if (error.status === 409) {
          errorMessage = 'Email already exists.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.status === 0 || error.status === 503) {
          errorMessage = 'Registration service is currently unavailable.';
        }
        
        return throwError(() => ({ ...error, userMessage: errorMessage }));
      })
    );
  }

  handleOAuth2Login(token: string, refreshToken: string): Observable<any> {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    try {
      const decoded = jwtDecode<any>(token);
      const user = decoded.user || {
        id: decoded.id,
        email: decoded.email || decoded.sub,
        name: decoded.name,
        role: decoded.role || decoded.roles?.[0]
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return new Observable(observer => {
        observer.next(user);
        observer.complete();
      });
    } catch (error) {
      return throwError(() => error);
    }
  }

  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string, user?: AuthResponse['user']): void {
    localStorage.setItem('token', token);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<any>(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (error) {
      return false;
    }
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.value;
    if (!user || !user.role) return null;
    
    // Handle both string and object { name: 'ROLE' } formats
    const roleValue = typeof user.role === 'string' ? user.role : (user.role as any).name;
    return roleValue ? roleValue.toUpperCase() : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isRecruiter(): boolean {
    return this.getUserRole() === 'RECRUITER';
  }

  isCandidate(): boolean {
    return this.getUserRole() === 'CANDIDATE';
  }

  getCurrentUser(): AuthResponse['user'] | null {
    return this.currentUserSubject.value;
  }

  changePassword(data: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/change-password`, data, this.getHttpOptions());
  }

  deactivateAccount(): Observable<void> {
    const user = this.getCurrentUser();
    return this.http.delete<void>(`${this.apiUrl}/auth/users/${user?.id}`, this.getHttpOptions()).pipe(
      tap(() => this.logout())
    );
  }
}
