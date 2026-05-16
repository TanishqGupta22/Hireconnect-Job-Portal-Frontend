import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="not-found-page">
      <div class="not-found-container">
        <div class="error-content">
          <div class="error-icon">
            <i class="fas fa-search"></i>
          </div>
          <h1 class="error-title">404</h1>
          <h2 class="error-subtitle">Page Not Found</h2>
          <p class="error-description">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div class="error-actions">
            <button mat-raised-button color="primary" (click)="goHome()">
              <mat-icon>home</mat-icon>
              Go Home
            </button>
            <button mat-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .not-found-container {
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
      color: #667eea;
      margin-bottom: 24px;
    }

    .error-title {
      font-size: 4rem;
      font-weight: 700;
      color: #667eea;
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
        font-size: 3rem;
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
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }
}
