import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LineChartComponent } from '../../../shared/components/charts/line-chart.component';
import { BarChartComponent } from '../../../shared/components/charts/bar-chart.component';
import { AnalyticsService, RecruiterAnalytics } from '../../../core/services/analytics.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-recruiter-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressBarModule,
    LineChartComponent,
    BarChartComponent
  ],
  template: `
    <div class="recruiter-analytics">
      <div class="analytics-header">
        <h1>Recruitment Analytics</h1>
        <div class="time-filter">
          <mat-form-field appearance="outline">
            <mat-label>Time Period</mat-label>
            <mat-select [(ngModel)]="selectedPeriod" (selectionChange)="onPeriodChange()">
              <mat-option value="7">Last 7 Days</mat-option>
              <mat-option value="30">Last 30 Days</mat-option>
              <mat-option value="90">Last 90 Days</mat-option>
              <mat-option value="365">Last Year</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>

      <div class="analytics-grid" *ngIf="!isLoading && analyticsData">
        <!-- Applications Over Time -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Applications Trend</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-line-chart 
              [title]="'Job Applications'"
              [data]="trendData"
              [color]="'#667eea'">
            </app-line-chart>
          </mat-card-content>
        </mat-card>

        <!-- Key Metrics -->
        <div class="metrics-section">
          <div class="metrics-grid">
            <mat-card class="metric-card">
              <mat-card-content>
                <div class="metric-icon"><mat-icon>work</mat-icon></div>
                <div class="metric-info">
                  <div class="metric-value">{{ analyticsData.totalJobs }}</div>
                  <div class="metric-label">Total Jobs</div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="metric-card">
              <mat-card-content>
                <div class="metric-icon"><mat-icon>description</mat-icon></div>
                <div class="metric-info">
                  <div class="metric-value">{{ analyticsData.totalApplications }}</div>
                  <div class="metric-label">Total Applications</div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="metric-card">
              <mat-card-content>
                <div class="metric-icon"><mat-icon>check_circle</mat-icon></div>
                <div class="metric-info">
                  <div class="metric-value">{{ analyticsData.shortlistedCandidates }}</div>
                  <div class="metric-label">Shortlisted</div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="metric-card">
              <mat-card-content>
                <div class="metric-icon"><mat-icon>event</mat-icon></div>
                <div class="metric-info">
                  <div class="metric-value">{{ analyticsData.interviewCount }}</div>
                  <div class="metric-label">Interviews</div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recruiter-analytics { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .analytics-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .analytics-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; margin-bottom: 32px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .metric-card mat-card-content { display: flex; align-items: center; gap: 16px; padding: 20px; }
    .metric-icon { width: 48px; height: 48px; border-radius: 12px; background: #e3f2fd; display: flex; align-items: center; justify-content: center; color: #1976d2; }
    .metric-value { font-size: 1.5rem; font-weight: 700; }
    .metric-label { color: #666; font-size: 0.875rem; }
    .chart-card { border-radius: 16px; }
    @media (max-width: 900px) { .analytics-grid { grid-template-columns: 1fr; } }
  `]
})
export class RecruiterAnalyticsComponent implements OnInit {
  selectedPeriod = '30';
  isLoading = false;
  analyticsData: RecruiterAnalytics | null = null;
  trendData: any = { labels: [], datasets: [] };
  recruiterId: number | null = null;

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.recruiterId = user.id;
      this.loadAnalytics();
    }
  }

  loadAnalytics(): void {
    if (!this.recruiterId) return;

    this.isLoading = true;
    this.analyticsService.getRecruiterAnalytics(this.recruiterId).subscribe({
      next: (data) => {
        this.analyticsData = data;
        if (data && data.applicationTrends) {
          this.trendData = {
            labels: data.applicationTrends.map(t => t.date),
            datasets: [{
              label: 'Applications',
              data: data.applicationTrends.map(t => t.count),
              fill: true,
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              tension: 0.4
            }]
          };
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading analytics:', err);
        this.isLoading = false;
      }
    });
  }

  onPeriodChange(): void {
    this.loadAnalytics();
  }
}
