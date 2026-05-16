import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-candidate-dashboard-simple',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="candidate-dashboard-simple" style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <mat-card style="margin-bottom: 20px;">
        <mat-card-header>
          <mat-card-title>Candidate Dashboard</mat-card-title>
          <mat-card-subtitle>Welcome back, {{ getCurrentUserName() }}!</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>This is a simple version of the candidate dashboard that works without the layout.</p>
          <p>Current user: {{ authService.getCurrentUser()?.email }}</p>
          <p>User role: {{ authService.getUserRole() }}</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="goToBrowseJobs()">
            <mat-icon>search</mat-icon>
            Browse Jobs
          </button>
          <button mat-stroked-button (click)="goToProfile()">
            <mat-icon>edit</mat-icon>
            Profile
          </button>
          <button mat-stroked-button (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </mat-card-actions>
      </mat-card>
      
      <mat-card>
        <mat-card-header>
          <mat-card-title>Dashboard Status</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>✅ Dashboard component is working!</p>
          <p>✅ Authentication is working!</p>
          <p>✅ Routing is working!</p>
          <p>🔧 Layout issue identified - need to fix candidate layout component</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .candidate-dashboard-simple {
      min-height: 100vh;
      background: #f5f5f5;
    }
  `]
})
export class CandidateDashboardSimpleComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    console.log('CandidateDashboardSimpleComponent initialized');
  }

  ngOnInit(): void {
    console.log('Simple dashboard loaded');
    console.log('Current user:', this.authService.getCurrentUser());
  }

  getCurrentUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.firstName : 'User';
  }

  goToBrowseJobs(): void {
    console.log('Going to browse jobs...');
    // For now, just show a message since browse jobs depends on layout
    alert('Browse Jobs would work once layout is fixed');
  }

  goToProfile(): void {
    console.log('Going to profile...');
    alert('Profile would work once layout is fixed');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
