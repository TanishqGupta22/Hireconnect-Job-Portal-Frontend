import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { LineChartComponent } from '../../../shared/components/charts/line-chart.component';
import { BarChartComponent } from '../../../shared/components/charts/bar-chart.component';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatTabsModule,
    FormsModule,
    LineChartComponent,
    BarChartComponent
  ],
  template: `
    <div class="admin-analytics">
      <div class="analytics-header">
        <h1>System Analytics</h1>
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

      <div class="analytics-grid">
        <!-- User Growth -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>User Growth</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-line-chart 
              [title]="'User Registration Trend'"
              [color]="'#667eea'">
            </app-line-chart>
          </mat-card-content>
        </mat-card>

        <!-- Job Postings -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Job Postings</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-bar-chart 
              [title]="'Jobs Posted by Day'"
              [color]="'#f093fb'">
            </app-bar-chart>
          </mat-card-content>
        </mat-card>

        <!-- Application Trends -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Application Trends</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-line-chart 
              [title]="'Daily Applications'"
              [color]="'#43e97b'">
            </app-line-chart>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Key Metrics -->
      <div class="metrics-section">
        <h2>Platform Metrics</h2>
        <div class="metrics-grid">
          <mat-card class="metric-card">
            <mat-card-content>
              <div class="metric-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ totalUsers.toLocaleString() }}</div>
                <div class="metric-label">Total Users</div>
                <div class="metric-change positive">+{{ userGrowth }}%</div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card">
            <mat-card-content>
              <div class="metric-icon">
                <i class="fas fa-briefcase"></i>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ totalJobs.toLocaleString() }}</div>
                <div class="metric-label">Active Jobs</div>
                <div class="metric-change positive">+{{ jobGrowth }}%</div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card">
            <mat-card-content>
              <div class="metric-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ totalApplications.toLocaleString() }}</div>
                <div class="metric-label">Total Applications</div>
                <div class="metric-change positive">+{{ applicationGrowth }}%</div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card">
            <mat-card-content>
              <div class="metric-icon">
                <i class="fas fa-percentage"></i>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ successRate }}%</div>
                <div class="metric-label">Success Rate</div>
                <div class="metric-change positive">+{{ successRateGrowth }}%</div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Platform Usage -->
      <div class="usage-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Platform Usage</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-tab-group>
              <mat-tab label="User Activity">
                <div class="usage-stats">
                  <div class="usage-item">
                    <div class="usage-label">Daily Active Users</div>
                    <div class="usage-value">{{ dailyActiveUsers.toLocaleString() }}</div>
                  </div>
                  <div class="usage-item">
                    <div class="usage-label">Weekly Active Users</div>
                    <div class="usage-value">{{ weeklyActiveUsers.toLocaleString() }}</div>
                  </div>
                  <div class="usage-item">
                    <div class="usage-label">Monthly Active Users</div>
                    <div class="usage-value">{{ monthlyActiveUsers.toLocaleString() }}</div>
                  </div>
                  <div class="usage-item">
                    <div class="usage-label">Avg. Session Duration</div>
                    <div class="usage-value">{{ avgSessionDuration }} min</div>
                  </div>
                </div>
              </mat-tab>
              
              <mat-tab label="System Performance">
                <div class="performance-stats">
                  <div class="performance-item">
                    <div class="performance-label">Server Response Time</div>
                    <div class="performance-value">{{ avgResponseTime }}ms</div>
                  </div>
                  <div class="performance-item">
                    <div class="performance-label">Database Query Time</div>
                    <div class="performance-value">{{ dbQueryTime }}ms</div>
                  </div>
                  <div class="performance-item">
                    <div class="performance-label">API Success Rate</div>
                    <div class="performance-value">{{ apiSuccessRate }}%</div>
                  </div>
                  <div class="performance-item">
                    <div class="performance-label">System Uptime</div>
                    <div class="performance-value">{{ systemUptime }}%</div>
                  </div>
                </div>
              </mat-tab>
            </mat-tab-group>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-analytics {
      max-width: 1200px;
      margin: 0 auto;
    }

    .analytics-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .analytics-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #212529;
      margin: 0;
    }

    .time-filter {
      min-width: 200px;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .chart-card {
      height: 500px;
    }

    .chart-card mat-card-content {
      height: calc(100% - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .metrics-section {
      margin-bottom: 32px;
    }

    .metrics-section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #212529;
      margin-bottom: 24px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .metric-card {
      transition: transform 0.3s ease;
    }

    .metric-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .metric-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
    }

    .metric-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }

    .metric-info {
      flex: 1;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      color: #212529;
      line-height: 1;
    }

    .metric-label {
      color: #6c757d;
      font-size: 0.875rem;
      margin-top: 4px;
    }

    .metric-change {
      font-size: 0.875rem;
      font-weight: 600;
      margin-top: 4px;
    }

    .metric-change.positive {
      color: #22c55e;
    }

    .metric-change.negative {
      color: #ef4444;
    }

    .usage-section {
      margin-bottom: 32px;
    }

    .usage-stats, .performance-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .usage-item, .performance-item {
      text-align: center;
      padding: 16px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
    }

    .usage-label, .performance-label {
      font-size: 0.875rem;
      color: #6c757d;
      margin-bottom: 8px;
    }

    .usage-value, .performance-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #212529;
    }

    @media (max-width: 768px) {
      .analytics-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .analytics-grid {
        grid-template-columns: 1fr;
      }

      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .usage-stats, .performance-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .usage-stats, .performance-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminAnalyticsComponent implements OnInit {
  selectedPeriod = 30;
  totalUsers = 0;
  userGrowth = 0;
  totalJobs = 0;
  jobGrowth = 0;
  totalApplications = 0;
  applicationGrowth = 0;
  successRate = 0;
  successRateGrowth = 0;
  dailyActiveUsers = 0;
  weeklyActiveUsers = 0;
  monthlyActiveUsers = 0;
  avgSessionDuration = 0;
  avgResponseTime = 0;
  dbQueryTime = 0;
  apiSuccessRate = 0;
  systemUptime = 0;

  userGrowthData = {
    labels: [],
    datasets: [{
      label: 'New Users',
      data: [],
      fill: true
    }]
  };

  jobPostingsData = {
    labels: [],
    datasets: [{
      label: 'Jobs Posted',
      data: [],
      fill: true
    }]
  };

  applicationTrendsData = {
    labels: [],
    datasets: [{
      label: 'Applications',
      data: [],
      fill: true
    }]
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.adminService.getSystemStats().subscribe({
      next: (data: any) => {
        if (data) {
          this.totalUsers = data.totalUsers || 0;
          this.totalJobs = data.activeJobs || 0;
          this.totalApplications = data.totalApplications || 0;
          this.userGrowth = data.userGrowth || 0;
          this.jobGrowth = data.jobGrowth || 0;
          this.applicationGrowth = data.applicationGrowth || 0;
        }
      },
      error: (err: any) => console.error('Error loading analytics:', err)
    });
  }

  onPeriodChange(): void {
    console.log('Period changed to:', this.selectedPeriod);
    // In real app, this would fetch new data from API
  }
}
