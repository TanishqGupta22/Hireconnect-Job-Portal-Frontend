import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule
  ],
  template: `
    <div class="revenue-page">
      <div class="header">
        <h1>Revenue & Subscriptions 💸</h1>
        <p>Monitor platform earnings and subscription trends</p>
      </div>

      <div class="revenue-grid">
        <mat-card class="revenue-stat total">
          <mat-card-content>
            <div class="icon-box"><mat-icon>account_balance_wallet</mat-icon></div>
            <div class="stat-info">
              <span class="label">Total Revenue</span>
              <span class="value">{{ (stats?.totalRevenue || 0) | currency:'INR':'symbol' }}</span>
              <span class="trend" [class.positive]="(stats?.monthlyGrowth || 0) > 0">
                {{ (stats?.monthlyGrowth || 0) > 0 ? '+' : '' }}{{ stats?.monthlyGrowth }}% this month
              </span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="revenue-stat sub">
          <mat-card-content>
            <div class="icon-box"><mat-icon>subscriptions</mat-icon></div>
            <div class="stat-info">
              <span class="label">Active Subscriptions</span>
              <span class="value">{{ stats?.activeSubscriptions || 0 }}</span>
              <span class="trend neutral">Total: {{ stats?.totalSubscriptions || 0 }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="revenue-stat average">
          <mat-card-content>
            <div class="icon-box"><mat-icon>trending_up</mat-icon></div>
            <div class="stat-info">
              <span class="label">Avg. Revenue / User</span>
              <span class="value">{{ (stats?.averageRevenuePerUser || 0) | currency:'INR':'symbol' }}</span>
              <span class="trend neutral">Based on total users</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="charts-row">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Earnings Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="mock-chart earnings-chart">
              <div class="chart-placeholder">
                <p class="no-data" *ngIf="!chartData?.labels?.length">No revenue data available</p>
                <div *ngFor="let value of chartData?.values" class="bar" [style.height.%]="value"></div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Subscription Mix</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="plan-list" *ngIf="stats?.totalSubscriptions; else noSubs">
              <div class="plan-item">
                <span class="dot pro"></span>
                <span class="name">Active</span>
                <span class="count">{{ stats?.activeSubscriptions }}</span>
                <span class="pct">{{ (stats?.activeSubscriptions / stats?.totalSubscriptions * 100) | number:'1.0-0' }}%</span>
              </div>
              <div class="plan-item">
                <span class="dot starter"></span>
                <span class="name">Inactive/Other</span>
                <span class="count">{{ stats?.totalSubscriptions - stats?.activeSubscriptions }}</span>
                <span class="pct">{{ ((stats?.totalSubscriptions - stats?.activeSubscriptions) / stats?.totalSubscriptions * 100) | number:'1.0-0' }}%</span>
              </div>
            </div>
            <ng-template #noSubs>
              <div class="no-data-msg">No active subscriptions</div>
            </ng-template>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="transactions-card">
        <mat-card-header>
          <mat-card-title>Recent Transactions</mat-card-title>
        </mat-card-header>
        <div class="table-container">
          <table mat-table [dataSource]="transactions" class="transactions-table" *ngIf="transactions.length > 0; else noTrans">
            <ng-container matColumnDef="user">
              <th mat-header-cell *matHeaderCellDef>User</th>
              <td mat-cell *matCellDef="let t">{{ t.user }}</td>
            </ng-container>
            <ng-container matColumnDef="plan">
              <th mat-header-cell *matHeaderCellDef>Plan</th>
              <td mat-cell *matCellDef="let t">{{ t.plan }}</td>
            </ng-container>
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let t" class="amount">{{ t.amount | currency:'INR':'symbol' }}</td>
            </ng-container>
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let t">{{ t.date | date }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let t">
                <span class="badge success">{{ t.status || 'Paid' }}</span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <ng-template #noTrans>
            <div class="no-data-msg p-4 text-center">No recent transactions found</div>
          </ng-template>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .revenue-page {
      padding: 24px;
      animation: fadeIn 0.5s ease-out;
    }

    .header { margin-bottom: 24px; }
    .header h1 { font-size: 28px; font-weight: 700; margin: 0; color: #1e293b; }
    .header p { color: #64748b; margin: 4px 0 0 0; }

    .revenue-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .revenue-stat mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
    }

    .icon-box {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eff6ff;
      color: #3b82f6;
    }

    .total .icon-box { background: #f0fdf4; color: #22c55e; }
    .sub .icon-box { background: #f5f3ff; color: #8b5cf6; }

    .stat-info { display: flex; flex-direction: column; }
    .label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; }
    .value { font-size: 24px; font-weight: 700; color: #1e293b; }
    .trend { font-size: 11px; margin-top: 2px; }
    .trend.positive { color: #22c55e; }

    .charts-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .chart-placeholder {
      height: 200px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 10px;
      padding: 20px 0;
      position: relative;
    }

    .no-data { color: #94a3b8; font-size: 14px; }
    .no-data-msg { padding: 32px; text-align: center; color: #64748b; font-style: italic; }

    .bar {
      flex: 1;
      background: #3b82f6;
      border-radius: 4px 4px 0 0;
      opacity: 0.8;
      max-width: 40px;
    }

    .plan-list { display: flex; flex-direction: column; gap: 12px; padding: 12px 0; }
    .plan-item { display: flex; align-items: center; gap: 12px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.pro { background: #3b82f6; }
    .dot.enterprise { background: #8b5cf6; }
    .dot.starter { background: #94a3b8; }
    .plan-item .name { flex: 1; font-weight: 500; }
    .plan-item .count { color: #64748b; font-size: 13px; }
    .plan-item .pct { font-weight: 600; min-width: 40px; text-align: right; }

    .transactions-card { border-radius: 12px; overflow: hidden; }
    .transactions-table { width: 100%; }
    .amount { font-weight: 600; color: #1e293b; }
    .badge.success { background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class RevenueComponent implements OnInit {
  displayedColumns = ['user', 'plan', 'amount', 'date', 'status'];
  transactions: any[] = [];
  stats: any = null;
  chartData: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadRevenueStats();
    this.loadChartData();
  }

  private loadRevenueStats(): void {
    this.adminService.getRevenueStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Error loading revenue stats:', err)
    });
  }

  private loadChartData(): void {
    this.adminService.getRevenueChartData().subscribe({
      next: (data) => {
        this.chartData = data;
      },
      error: (err) => console.error('Error loading chart data:', err)
    });
  }
}
