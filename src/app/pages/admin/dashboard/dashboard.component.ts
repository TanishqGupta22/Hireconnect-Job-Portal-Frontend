import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';
import { AdminService, SystemStats } from '../../../core/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <div class="admin-dashboard">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-content">
          <div class="welcome-text">
            <div class="dashboard-logo mb-4">
              <img src="assets/images/logo.png" alt="HireConnect Logo" class="h-10">
            </div>
            <h1 class="welcome-title">Admin Dashboard 📊</h1>
            <p class="welcome-subtitle">System overview and management control center</p>
          </div>
          <div class="welcome-actions">
            <button mat-raised-button class="btn-primary" (click)="navigateTo('/admin/users')">
              <mat-icon>add_circle</mat-icon>
              Add User
            </button>
            <button mat-stroked-button class="btn-secondary" (click)="navigateTo('/admin/analytics')">
              <mat-icon>insights</mat-icon>
              View Analytics
            </button>
          </div>
        </div>
      </div>

      <!-- System Overview Stats -->
      <div class="stats-section">
        <h2 class="section-title">System Overview</h2>
        <div class="stats-grid">
          <div class="stat-card users" (click)="navigateTo('/admin/users')">
            <div class="stat-icon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats?.totalUsers || 0 | number }}</div>
              <div class="stat-label">Total Users</div>
              <div class="stat-change" [class.positive]="(stats?.userGrowth || 0) >= 0" *ngIf="stats?.userGrowth !== undefined">
                {{ (stats?.userGrowth || 0) >= 0 ? '+' : '' }}{{ stats?.userGrowth }}%
              </div>
            </div>
          </div>

          <div class="stat-card recruiters" (click)="navigateTo('/admin/recruiters')">
            <div class="stat-icon">
              <mat-icon>business</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats?.totalRecruiters || 0 | number }}</div>
              <div class="stat-label">Recruiters</div>
              <div class="stat-change" [class.positive]="(stats?.recruiterGrowth || 0) >= 0" *ngIf="stats?.recruiterGrowth !== undefined">
                {{ (stats?.recruiterGrowth || 0) >= 0 ? '+' : '' }}{{ stats?.recruiterGrowth }}%
              </div>
            </div>
          </div>

          <div class="stat-card jobs" (click)="navigateTo('/admin/jobs')">
            <div class="stat-icon">
              <mat-icon>work</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats?.activeJobs || 0 | number }}</div>
              <div class="stat-label">Active Jobs</div>
              <div class="stat-change" [class.positive]="(stats?.jobGrowth || 0) >= 0" *ngIf="stats?.jobGrowth !== undefined">
                {{ (stats?.jobGrowth || 0) >= 0 ? '+' : '' }}{{ stats?.jobGrowth }}%
              </div>
            </div>
          </div>

          <div class="stat-card applications" (click)="navigateTo('/admin/applications')">
            <div class="stat-icon">
              <mat-icon>description</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats?.totalApplications || 0 | number }}</div>
              <div class="stat-label">Applications</div>
              <div class="stat-change" [class.positive]="(stats?.applicationGrowth || 0) >= 0" *ngIf="stats?.applicationGrowth !== undefined">
                {{ (stats?.applicationGrowth || 0) >= 0 ? '+' : '' }}{{ stats?.applicationGrowth }}%
              </div>
            </div>
          </div>

          <div class="stat-card subscriptions" (click)="navigateTo('/admin/revenue')">
            <div class="stat-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);">
              <mat-icon>subscriptions</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ revenueStats?.activeSubscriptions || 0 | number }}</div>
              <div class="stat-label">Active Subs</div>
            </div>
          </div>

          <div class="stat-card revenue" (click)="navigateTo('/admin/revenue')">
            <div class="stat-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
              <mat-icon>payments</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ revenueStats?.totalRevenue || 0 | currency:'INR':'symbol':'1.0-0' }}</div>
              <div class="stat-label">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Health & Performance -->
      <div class="dashboard-content">
        <div class="system-health">
          <mat-card class="health-card">
            <mat-card-header>
              <div class="card-header-content">
                <mat-card-title>System Health</mat-card-title>
                <mat-card-subtitle>Real-time monitoring dashboard</mat-card-subtitle>
                <button mat-icon-button class="refresh-btn">
                  <mat-icon>refresh</mat-icon>
                </button>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div class="health-metrics">
                <div class="metric">
                  <div class="metric-header">
                    <div class="metric-label">Server Status</div>
                    <div class="metric-status online">Online</div>
                  </div>
                  <div class="metric-value">
                    <div class="status-indicator online"></div>
                    <div class="status-text">All systems operational</div>
                  </div>
                </div>
                <div class="metric">
                  <div class="metric-header">
                    <div class="metric-label">Database</div>
                    <div class="metric-status healthy">Healthy</div>
                  </div>
                  <div class="metric-value">
                    <div class="status-indicator healthy"></div>
                    <div class="status-text">99.8% uptime</div>
                  </div>
                </div>
                <div class="metric">
                  <div class="metric-header">
                    <div class="metric-label">API Response</div>
                    <div class="metric-status good">Good</div>
                  </div>
                  <div class="metric-value">
                    <div class="response-time">124ms</div>
                    <div class="response-indicator good"></div>
                  </div>
                </div>
                <div class="metric">
                  <div class="metric-header">
                    <div class="metric-label">Uptime</div>
                    <div class="metric-status excellent">Excellent</div>
                  </div>
                  <div class="metric-value">
                    <div class="uptime-value">99.9%</div>
                    <div class="uptime-indicator excellent"></div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="recent-activity">
          <mat-card class="activity-card">
            <mat-card-header>
              <div class="card-header-content">
                <mat-card-title>Recent Activity</mat-card-title>
                <mat-card-subtitle>Latest system events and user actions</mat-card-subtitle>
                <button mat-icon-button class="view-all-btn">
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </mat-card-header>
            <mat-card-content>
              <mat-tab-group>
                <mat-tab label="User Registrations">
                  <div class="activity-list">
                    <div class="activity-item" *ngFor="let user of recentUsers">
                      <div class="activity-avatar">
                        <div class="avatar-placeholder">
                          <mat-icon>person</mat-icon>
                        </div>
                      </div>
                      <div class="activity-content">
                        <div class="activity-header">
                          <div class="activity-title">{{ user.name }} registered as {{ user.role }}</div>
                          <div class="activity-time">{{ user.time }}</div>
                        </div>
                        <div class="activity-meta">
                          <mat-chip [ngClass]="getUserRoleClass(user.role)">{{ user.role }}</mat-chip>
                        </div>
                      </div>
                    </div>
                  </div>
                </mat-tab>
                
                <mat-tab label="Job Postings">
                  <div class="activity-list">
                    <div class="activity-item" *ngFor="let job of recentJobs">
                      <div class="activity-avatar">
                        <div class="company-logo">
                          <mat-icon>business</mat-icon>
                        </div>
                      </div>
                      <div class="activity-content">
                        <div class="activity-header">
                          <div class="activity-title">{{ job.company }} posted {{ job.position }}</div>
                          <div class="activity-time">{{ job.time }}</div>
                        </div>
                        <div class="activity-meta">
                          <mat-chip color="primary">New Job</mat-chip>
                        </div>
                      </div>
                    </div>
                  </div>
                </mat-tab>

                <mat-tab label="System Alerts">
                  <div class="alerts-list">
                    <div class="alert-item" *ngFor="let alert of systemAlerts" [ngClass]="getAlertClass(alert.type)">
                      <div class="alert-icon">
                        <mat-icon [ngClass]="getAlertIconClass(alert.type)"></mat-icon>
                      </div>
                      <div class="alert-content">
                        <div class="alert-header">
                          <div class="alert-title">{{ alert.title }}</div>
                          <div class="alert-time">{{ alert.time }}</div>
                        </div>
                        <div class="alert-message">{{ alert.message }}</div>
                        <div class="alert-actions">
                          <button mat-icon-button class="alert-action">
                            <mat-icon>more_vert</mat-icon>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </mat-tab>
              </mat-tab-group>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Quick Actions Panel -->
      <div class="quick-actions-section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="quick-actions-grid">
          <mat-card class="action-card" (click)="navigateTo('/admin/users')">
            <mat-card-content>
              <div class="action-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="action-content">
                <h3>Manage Users</h3>
                <p>Add, edit, and manage user accounts</p>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card" (click)="navigateTo('/admin/recruiters')">
            <mat-card-content>
              <div class="action-icon">
                <mat-icon>business</mat-icon>
              </div>
              <div class="action-content">
                <h3>Manage Recruiters</h3>
                <p>Approve and manage recruiter accounts</p>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card" (click)="navigateTo('/admin/jobs')">
            <mat-card-content>
              <div class="action-icon">
                <mat-icon>work</mat-icon>
              </div>
              <div class="action-content">
                <h3>Manage Jobs</h3>
                <p>Moderate and manage job postings</p>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card" (click)="navigateTo('/admin/analytics')">
            <mat-card-content>
              <div class="action-icon">
                <mat-icon>assessment</mat-icon>
              </div>
              <div class="action-content">
                <h3>View Reports</h3>
                <p>Analytics and system reports</p>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card">
            <mat-card-content>
              <div class="action-icon">
                <mat-icon>settings</mat-icon>
              </div>
              <div class="action-content">
                <h3>System Settings</h3>
                <p>Configure system preferences</p>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card">
            <mat-card-content>
              <div class="action-icon">
                <mat-icon>security</mat-icon>
              </div>
              <div class="action-content">
                <h3>Security Center</h3>
                <p>Monitor and manage security</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      max-width: var(--container-xl);
      margin: 0 auto;
      padding: var(--spacing-lg);
      font-family: var(--font-family-primary);
      background: var(--neutral-50);
      min-height: 100vh;
    }

    /* Welcome Section */
    .welcome-section {
      background: var(--gradient-hero);
      border-radius: var(--border-radius-2xl);
      padding: var(--spacing-3xl) var(--spacing-2xl);
      margin-bottom: var(--spacing-2xl);
      position: relative;
      overflow: hidden;
    }

    .welcome-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.3;
    }

    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .welcome-text {
      flex: 1;
    }

    .welcome-title {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--spacing-md) 0;
      line-height: var(--line-height-tight);
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .welcome-subtitle {
      font-size: var(--font-size-lg);
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      line-height: var(--line-height-relaxed);
    }

    .welcome-actions {
      display: flex;
      gap: var(--spacing-md);
    }

    .btn-primary {
      background: var(--primary-600);
      color: white;
      border: none;
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md) var(--spacing-xl);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .btn-primary:hover {
      background: var(--primary-700);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(4px);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md) var(--spacing-xl);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all var(--transition-normal);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    /* Section Headers */
    .section-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--secondary-800);
      margin: 0 0 var(--spacing-lg) var(--spacing-xl);
      position: relative;
      padding-left: var(--spacing-md);
    }

    .section-title::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 24px;
      background: var(--primary-600);
      border-radius: var(--border-radius-full);
    }

    /* Stats Section */
    .stats-section {
      margin-bottom: var(--spacing-2xl);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-lg);
    }

    .stat-card {
      background: white;
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--neutral-100);
      padding: var(--spacing-xl);
      transition: all var(--transition-normal);
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--gradient-primary);
      opacity: 0;
      transition: opacity var(--transition-normal);
    }

    .stat-card:hover::before {
      opacity: 1;
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--border-radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--spacing-md);
      position: relative;
      background: var(--gradient-primary);
      color: white;
      font-size: var(--font-size-2xl);
    }

    .stat-content {
      text-align: center;
      flex: 1;
    }

    .stat-number {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--secondary-800);
      margin-bottom: var(--spacing-xs);
      line-height: var(--line-height-tight);
    }

    .stat-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--secondary-600);
      margin-bottom: var(--spacing-md);
    }

    .stat-change {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-full);
      display: inline-block;
      background: var(--success-100);
      color: var(--success-700);
    }

    .stat-sparkline {
      display: flex;
      align-items: flex-end;
      height: 40px;
      gap: 2px;
      margin-top: var(--spacing-sm);
    }

    .sparkline-bar {
      flex: 1;
      background: var(--primary-200);
      border-radius: 2px;
      transition: all var(--transition-normal);
    }

    /* Dashboard Content */
    .dashboard-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-xl);
      margin-bottom: var(--spacing-2xl);
    }

    /* System Health */
    .health-card,
    .activity-card {
      background: white;
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--neutral-100);
      overflow: hidden;
    }

    .card-header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg) var(--spacing-xl);
      background: linear-gradient(135deg, var(--primary-50) 0%, white 100%);
      border-bottom: 1px solid var(--neutral-100);
    }

    .card-header-content mat-card-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--secondary-800);
      margin: 0;
    }

    .card-header-content mat-card-subtitle {
      font-size: var(--font-size-sm);
      color: var(--secondary-600);
      margin: 0;
    }

    .refresh-btn,
    .view-all-btn {
      color: var(--primary-600);
    }

    .health-card mat-card-content {
      padding: var(--spacing-xl);
    }

    .health-metrics {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
    }

    .metric {
      background: var(--neutral-50);
      border: 1px solid var(--neutral-100);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-lg);
      text-align: center;
      transition: all var(--transition-normal);
    }

    .metric:hover {
      border-color: var(--primary-200);
      background: var(--primary-50);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .metric-header {
      margin-bottom: var(--spacing-md);
    }

    .metric-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--secondary-600);
      margin-bottom: var(--spacing-xs);
    }

    .metric-status {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-full);
      display: inline-block;
    }

    .metric-status.online {
      background: var(--success-100);
      color: var(--success-700);
    }

    .metric-status.healthy {
      background: var(--success-100);
      color: var(--success-700);
    }

    .metric-status.good {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    .metric-status.excellent {
      background: var(--primary-100);
      color: var(--primary-700);
    }

    .metric-value {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-sm);
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: var(--border-radius-full);
      display: inline-block;
    }

    .status-indicator.online,
    .status-indicator.healthy {
      background: var(--success-500);
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.3);
    }

    .status-indicator.good {
      background: var(--warning-500);
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.3);
    }

    .status-indicator.excellent {
      background: var(--primary-500);
      box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.3);
    }

    .status-text {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--secondary-700);
    }

    .response-time {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--secondary-800);
    }

    .response-indicator {
      width: 8px;
      height: 8px;
      border-radius: var(--border-radius-full);
      display: inline-block;
      margin-left: var(--spacing-sm);
    }

    .response-indicator.good {
      background: var(--warning-500);
    }

    .uptime-value {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--secondary-800);
    }

    .uptime-indicator {
      width: 8px;
      height: 8px;
      border-radius: var(--border-radius-full);
      display: inline-block;
      margin-left: var(--spacing-sm);
    }

    .uptime-indicator.excellent {
      background: var(--primary-500);
    }

    /* Activity Section */
    .activity-card mat-card-content {
      padding: var(--spacing-xl);
    }

    .activity-list,
    .alerts-list {
      max-height: 400px;
      overflow-y: auto;
      padding: var(--spacing-md);
    }

    .activity-item,
    .alert-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-lg);
      padding: var(--spacing-lg);
      border: 1px solid var(--neutral-100);
      border-radius: var(--border-radius-lg);
      transition: all var(--transition-normal);
      margin-bottom: var(--spacing-md);
    }

    .activity-item:hover,
    .alert-item:hover {
      border-color: var(--primary-200);
      box-shadow: var(--shadow-md);
      background: var(--primary-50);
    }

    .activity-avatar,
    .alert-icon {
      position: relative;
    }

    .avatar-placeholder,
    .alert-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--border-radius-full);
      background: var(--neutral-100);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--neutral-200);
      flex-shrink: 0;
    }

    .company-logo {
      background: var(--primary-600);
      color: white;
    }

    .avatar-placeholder mat-icon,
    .alert-icon mat-icon {
      font-size: var(--font-size-lg);
      color: var(--primary-600);
    }

    .company-logo mat-icon {
      color: white;
    }

    .activity-content,
    .alert-content {
      flex: 1;
    }

    .activity-header,
    .alert-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-sm);
    }

    .activity-title,
    .alert-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--secondary-800);
      margin-bottom: var(--spacing-xs);
      line-height: var(--line-height-tight);
    }

    .activity-time,
    .alert-time {
      font-size: var(--font-size-xs);
      color: var(--secondary-500);
      white-space: nowrap;
    }

    .activity-meta {
      margin-top: var(--spacing-sm);
    }

    .alert-message {
      font-size: var(--font-size-sm);
      color: var(--secondary-600);
      margin-bottom: var(--spacing-sm);
      line-height: var(--line-height-normal);
    }

    .alert-actions {
      margin-top: var(--spacing-sm);
    }

    .alert-action {
      width: 32px;
      height: 32px;
      border-radius: var(--border-radius-full);
      background: var(--neutral-100);
      border: 1px solid var(--neutral-200);
      color: var(--secondary-600);
    }

    .alert-action:hover {
      background: var(--primary-100);
      border-color: var(--primary-300);
      color: var(--primary-600);
    }

    /* Alert Types */
    .alert-item.info {
      background: var(--primary-50);
      border-left: 4px solid var(--primary-500);
    }

    .alert-item.warning {
      background: var(--warning-50);
      border-left: 4px solid var(--warning-500);
    }

    .alert-item.error {
      background: var(--error-50);
      border-left: 4px solid var(--error-500);
    }

    /* Role Classes */
    .role-candidate {
      background: var(--primary-100);
      color: var(--primary-700);
    }

    .role-recruiter {
      background: var(--success-100);
      color: var(--success-700);
    }

    .role-default {
      background: var(--neutral-100);
      color: var(--secondary-700);
    }

    /* Quick Actions Section */
    .quick-actions-section {
      margin-bottom: var(--spacing-2xl);
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
    }

    .action-card {
      background: white;
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--neutral-100);
      transition: all var(--transition-normal);
      overflow: hidden;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      border-color: var(--primary-200);
    }

    .action-card mat-card-content {
      padding: var(--spacing-xl);
      text-align: center;
    }

    .action-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--border-radius-xl);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--spacing-lg);
    }

    .action-icon mat-icon {
      font-size: var(--font-size-2xl);
      color: white;
    }

    .action-content {
      text-align: center;
    }

    .action-content h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--secondary-800);
      margin: 0 0 var(--spacing-sm) 0;
    }

    .action-content p {
      font-size: var(--font-size-sm);
      color: var(--secondary-600);
      margin: 0;
      line-height: var(--line-height-normal);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .admin-dashboard {
        padding: var(--spacing-md);
      }

      .stats-grid,
      .quick-actions-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .welcome-content {
        flex-direction: column;
        text-align: center;
        gap: var(--spacing-lg);
      }

      .welcome-actions {
        justify-content: center;
      }

      .dashboard-content {
        grid-template-columns: 1fr;
      }

      .health-metrics {
        grid-template-columns: 1fr;
      }

      .activity-item,
      .alert-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-md);
      }

      .activity-header,
      .alert-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xs);
      }
    }

    @media (max-width: 640px) {
      .welcome-section {
        padding: var(--spacing-xl) var(--spacing-md);
      }

      .welcome-title {
        font-size: var(--font-size-2xl);
      }

      .section-title {
        font-size: var(--font-size-xl);
      }

      .stat-icon,
      .action-icon {
        width: 56px;
        height: 56px;
      }

      .stat-icon mat-icon,
      .action-icon mat-icon {
        font-size: var(--font-size-xl);
      }

      .health-metrics {
        grid-template-columns: 1fr;
      }

      .metric {
        padding: var(--spacing-md);
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  recentUsers: any[] = [];
  recentJobs: any[] = [];
  systemAlerts: any[] = [];
  shortlistedCount = 0;
  hiredCount = 0;
  revenueStats: any = null;

  stats?: any;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentActivity();
  }

  loadStats(): void {
    this.adminService.getRevenueStats().subscribe({
      next: (data) => this.revenueStats = data,
      error: (err) => console.error('Error loading revenue stats:', err)
    });

    this.adminService.getSystemStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        // Reset stats to zero if API fails to avoid misleading dummy data
        this.stats = {
          totalUsers: 0,
          totalRecruiters: 0,
          activeJobs: 0,
          totalApplications: 0,
          userGrowth: 0,
          jobGrowth: 0,
          applicationGrowth: 0
        };
      }
    });

    this.adminService.getAllApplications().subscribe({
      next: (apps) => {
        this.shortlistedCount = apps.filter((a: any) => a.status === 'SHORTLISTED').length;
        this.hiredCount = apps.filter((a: any) => a.status === 'HIRED').length;
      },
      error: (err) => console.error('Error loading applications for admin stats:', err)
    });
  }

  loadRecentActivity(): void {
    this.adminService.getUsers().subscribe({
      next: (users) => {
        // Sort by ID descending to get recent first and take top 5
        this.recentUsers = users
          .sort((a, b) => b.id - a.id)
          .slice(0, 5)
          .map(u => ({
            name: u.name,
            role: u.role,
            time: this.formatTime(u.createdAt)
          }));
      },
      error: (err) => console.error('Error loading recent users:', err)
    });

    // Simulated recent jobs for now
    this.recentJobs = [
      { company: 'Google', position: 'Senior Angular Developer', time: '2 hours ago' },
      { company: 'Meta', position: 'Product Designer', time: '5 hours ago' },
      { company: 'Amazon', position: 'Cloud Architect', time: '1 day ago' }
    ];
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getAlertClass(type: string): string {
    return `alert-item ${type}`;
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'info': return 'fas fa-info-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'error': return 'fas fa-exclamation-circle';
      default: return 'fas fa-info-circle';
    }
  }

  getAlertIconClass(type: string): string {
    switch (type) {
      case 'info': return 'fas fa-info-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'error': return 'fas fa-exclamation-circle';
      default: return 'fas fa-info-circle';
    }
  }

  getUserRoleClass(role: string): string {
    switch (role) {
      case 'CANDIDATE': return 'role-candidate';
      case 'RECRUITER': return 'role-recruiter';
      default: return 'role-default';
    }
  }
}
