import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="unauthorized-page">
      <div class="unauthorized-container">
        <div class="error-content">
          <div class="error-icon">
            <i class="fas fa-lock"></i>
          </div>
          <h1 class="error-title">Access Denied</h1>
          <h2 class="error-subtitle">Unauthorized Access</h2>
          <p class="error-description">
            You don't have permission to access this page. Please contact your administrator if you think this is a mistake.
          </p>
          <div class="error-actions">
            <button mat-raised-button color="primary" (click)="goToDashboard()">
              <mat-icon>dashboard</mat-icon>
              Go to Dashboard
            </button>
            <button mat-button (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .unauthorized-container {
      text-align: center;
      max-width: 500px;
    }

    .error-content {
      background: white;
      padding: 48px 32px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .error-icon {
      font-size: 4rem;
      color: #f5576c;
      margin-bottom: 24px;
    }

    .error-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #f5576c;
      margin: 0 0 16px 0;
    }

    .error-subtitle {
      font-size: 1.5rem;
      font-weight: 600;
      color: #212529;
      margin: 0 0 16px 0;
    }

    .error-description {
      font-size: 1rem;
      color: #6c757d;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .error-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .error-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 480px) {
      .error-content {
        padding: 32px 24px;
      }

      .error-title {
        font-size: 2rem;
      }

      .error-subtitle {
        font-size: 1.25rem;
      }

      .error-actions {
        flex-direction: column;
        align-items: center;
      }

      .error-actions button {
        width: 200px;
      }
    }
  `]
})
export class UnauthorizedComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goToDashboard(): void {
    const userRole = this.authService.getUserRole();
    
    switch (userRole) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'RECRUITER':
        this.router.navigate(['/recruiter/dashboard']);
        break;
      case 'CANDIDATE':
        this.router.navigate(['/candidate/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
