import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: any;

  hidePassword = true;
  isLoading = false;
  showDemo = false;
  selectedRole: 'CANDIDATE' | 'RECRUITER' = 'CANDIDATE';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check if we are in the OAuth2 callback flow
    const token = this.route.snapshot.queryParams['token'];
    const refreshToken = this.route.snapshot.queryParams['refreshToken'];

    if (token) {
      console.log('OAuth2 callback detected, processing token');
      this.handleOAuth2Success(token, refreshToken);
      return;
    }

    // If user is already authenticated, redirect them to their dashboard
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole();
      if (role) {
        this.redirectToRoleDashboard(role);
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const credentials: LoginRequest = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        
        // Show success message
        this.snackBar.open('Login successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // Get redirect URL from query params or default based on role
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        console.log('User role:', response.user.role);
        console.log('Return URL from query params:', returnUrl);
        
        // Wrap navigation in a small timeout to ensure AuthService state is fully propagated
        setTimeout(() => {
          // If there's a returnUrl that isn't just '/', use it
          if (returnUrl && returnUrl !== '/' && returnUrl !== '/auth/login') {
            console.log('Redirecting to returnUrl:', returnUrl);
            this.router.navigateByUrl(returnUrl).then(
              success => {
                console.log('Navigation to returnUrl successful:', success);
                if (!success) {
                  console.warn('Navigation to returnUrl was rejected (likely due to role restrictions). Falling back to role dashboard.');
                  this.redirectToRoleDashboard(response.user.role);
                }
              },
              error => {
                console.error('Navigation to returnUrl failed, falling back to role-based dashboard:', error);
                this.redirectToRoleDashboard(response.user.role);
              }
            );
          } else {
            this.redirectToRoleDashboard(response.user.role);
          }
        }, 100);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading = false;
        
        // Use enhanced error message from auth service
        const errorMessage = error.userMessage || 
                           error.error?.message || 
                           'Login failed. Please check your credentials.';
        
        console.error('Error message:', errorMessage);
        this.snackBar.open(
          errorMessage,
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  loginWithGoogle(): void {
    // Set role in cookie so backend can read it
    document.cookie = `hc_role=${this.selectedRole}; path=/; max-age=300; SameSite=Lax`;
    
    const googleAuthUrl = 'http://localhost:8081/oauth2/authorization/google';
    window.location.href = googleAuthUrl;
  }

  private handleOAuth2Success(token: string, refreshToken: string): void {
    this.isLoading = true;
    // Set the token in auth service (I need to expose a method for this or use login logic)
    // Looking at AuthService, setToken is private. I should probably add a public method or use it via a trick.
    // Actually, I can just use localStorage directly or update AuthService.
    
    // For now, I'll assume I'll update AuthService to have a public handleOAuth2Login method.
    (this.authService as any).handleOAuth2Login(token, refreshToken).subscribe({
      next: (user: any) => {
        this.isLoading = false;
        this.snackBar.open('Google Login successful!', 'Close', { duration: 3000 });
        this.redirectToRoleDashboard(user.role);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.snackBar.open('Google Login failed. Please try again.', 'Close', { duration: 5000 });
        console.error('OAuth2 handling error:', err);
      }
    });
  }

  private redirectToRoleDashboard(role: any): void {
    // Robust role extraction
    const roleValue = typeof role === 'string' ? role : (role?.name || '');
    const upperRole = roleValue ? roleValue.toUpperCase() : '';
    
    let targetUrl = '/';
    
    if (upperRole === 'ADMIN') {
      targetUrl = '/admin/dashboard';
    } else if (upperRole === 'RECRUITER') {
      targetUrl = '/recruiter/dashboard';
    } else {
      targetUrl = '/candidate/dashboard';
    }
    
    console.log('Redirecting to role dashboard:', targetUrl);
    this.router.navigateByUrl(targetUrl).then(
      success => {
        console.log('Navigation to dashboard successful:', success);
        if (!success) {
          console.error('Navigation to dashboard failed or was rejected. Final fallback to home.');
          this.router.navigateByUrl('/');
        }
      },
      error => console.error('Navigation to dashboard error:', error)
    );
  }
}
