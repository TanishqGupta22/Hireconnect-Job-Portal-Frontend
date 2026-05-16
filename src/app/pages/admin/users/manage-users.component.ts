import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService, AdminUser } from '../../../core/services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  template: `
    <div class="manage-users">
      <div class="header">
        <div class="title-section">
          <h1>Manage Users 👥</h1>
          <p>View and manage all registered candidates and recruiters</p>
        </div>
        <div class="actions">
          <span class="count-badge" *ngIf="users.length > 0">Total: {{ users.length }}</span>
          <button mat-raised-button color="primary">
            <mat-icon>person_add</mat-icon>
            Add New User
          </button>
        </div>
      </div>

      <mat-card class="filter-card">
        <mat-card-content>
          <div class="filters-grid">
            <div class="search-wrapper">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Search users</mat-label>
                <input matInput placeholder="Search by name or email..." [(ngModel)]="searchQuery" (keyup)="applyFilters()">
                <mat-icon matPrefix>search</mat-icon>
              </mat-form-field>
            </div>

            <div class="dropdowns-wrapper">
              <mat-form-field appearance="outline">
                <mat-label>Role</mat-label>
                <mat-select [(ngModel)]="roleFilter" (selectionChange)="applyFilters()">
                  <mat-option value="">All Roles</mat-option>
                  <mat-option value="CANDIDATE">Candidate</mat-option>
                  <mat-option value="RECRUITER">Recruiter</mat-option>
                  <mat-option value="ADMIN">Admin</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
                  <mat-option value="">All Status</mat-option>
                  <mat-option value="ACTIVE">Active</mat-option>
                  <mat-option value="PENDING">Pending</mat-option>
                  <mat-option value="SUSPENDED">Suspended</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <table mat-table [dataSource]="filteredUsers" class="users-table">
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>User</th>
            <td mat-cell *matCellDef="let user">
              <div class="user-info">
                <div class="avatar">{{ user.name?.charAt(0) || 'U' }}</div>
                <div class="details">
                  <span class="name">{{ user.name || 'Unknown User' }}</span>
                  <span class="email">{{ user.email }}</span>
                </div>
              </div>
            </td>
          </ng-container>

          <!-- Role Column -->
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Role</th>
            <td mat-cell *matCellDef="let user">
              <mat-chip [ngClass]="user.role?.toLowerCase() || ''">{{ user.role }}</mat-chip>
            </td>
          </ng-container>

          <!-- Joined Column -->
          <ng-container matColumnDef="joined">
            <th mat-header-cell *matHeaderCellDef>Joined Date</th>
            <td mat-cell *matCellDef="let user">{{ user.createdAt | date:'mediumDate' }}</td>
          </ng-container>

          <!-- Company Column -->
          <ng-container matColumnDef="company">
            <th mat-header-cell *matHeaderCellDef>Office/Company</th>
            <td mat-cell *matCellDef="let user">
              <span *ngIf="user.role === 'RECRUITER'" class="company-name">
                {{ user.companyName || 'Not Set' }}
              </span>
              <span *ngIf="user.role !== 'RECRUITER'" class="text-muted">-</span>
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let user">
              <span class="status-badge" [ngClass]="user.status?.toLowerCase() || 'pending'">
                {{ user.status || 'PENDING' }}
              </span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button [matMenuTriggerFor]="null" matTooltip="More actions">
                <mat-icon>more_vert</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div class="loading-state" *ngIf="isLoading">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading users...</p>
        </div>

        <div class="no-results" *ngIf="!isLoading && filteredUsers.length === 0">
          <mat-icon>search_off</mat-icon>
          <p>No users found matching your filters (Total: {{ users.length }})</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .manage-users {
      padding: 24px;
      animation: fadeIn 0.5s ease-out;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .title-section h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .title-section p {
      color: #64748b;
      margin: 4px 0 0 0;
    }

    .filter-card {
      margin-bottom: 24px;
      border-radius: 16px;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      border: 1px solid #f1f5f9;
    }

    .filters-grid {
      display: flex;
      gap: 20px;
      align-items: center;
      padding: 12px 16px;
    }

    .search-wrapper {
      flex: 2;
    }

    .dropdowns-wrapper {
      flex: 3;
      display: flex;
      gap: 16px;
    }

    .filters-grid mat-form-field {
      width: 100%;
    }

    ::ng-deep .filters-grid .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .table-card {
      border-radius: 12px;
      overflow: hidden;
    }

    .users-table {
      width: 100%;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .avatar {
      width: 36px;
      height: 36px;
      background: #e2e8f0;
      color: #475569;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .details {
      display: flex;
      flex-direction: column;
    }

    .name {
      font-weight: 600;
      color: #1e293b;
    }

    .email {
      font-size: 12px;
      color: #64748b;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.active { background: #dcfce7; color: #15803d; }
    .status-badge.suspended { background: #fee2e2; color: #b91c1c; }
    .status-badge.pending { background: #fef9c3; color: #a16207; }

    mat-chip.candidate { background: #e0f2fe; color: #0369a1; }
    mat-chip.recruiter { background: #f5f3ff; color: #6d28d9; }
    mat-chip.admin { background: #fef2f2; color: #991b1b; }

    .no-results {
      padding: 48px;
      text-align: center;
      color: #64748b;
    }

    .no-results mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ManageUsersComponent implements OnInit {
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  displayedColumns: string[] = ['name', 'role', 'company', 'joined', 'status', 'actions'];

  isLoading = false;
  searchQuery: string = '';
  roleFilter: string = '';
  statusFilter: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    
    // Fetch all roles separately with individual error handling
    const adminObs = this.adminService.getUsers('ADMIN').pipe(catchError(() => of([])));
    const recruiterObs = this.adminService.getUsers('RECRUITER').pipe(catchError(() => of([])));
    const candidateObs = this.adminService.getUsers('CANDIDATE').pipe(catchError(() => of([])));

    forkJoin([adminObs, recruiterObs, candidateObs]).subscribe({
      next: ([admins, recruiters, candidates]) => {
        const allUsers = [...admins, ...recruiters, ...candidates];
        const uniqueUsers = Array.from(new Map(allUsers.map(u => [u.id, u])).values());
        
        this.users = uniqueUsers;
        this.filteredUsers = [...this.users];
        this.applyFilters();
        this.isLoading = false;
        
        if (this.users.length > 0) {
          this.adminService.showNotification(`Data Synced! Loaded ${this.users.length} users.`);
        } else {
          this.fetchGeneralUsers();
        }
      },
      error: (err) => {
        console.error('Critical failure in user sync:', err);
        this.fetchGeneralUsers();
      }
    });
  }

  private fetchGeneralUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data || [];
        this.filteredUsers = [...this.users];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.adminService.showNotification('System connection error. Please check backend services.');
        this.isLoading = false;
      }
    });
  }

  loadMockUsers(): void {
    // Dummy data removed as requested
    this.users = [];
    this.filteredUsers = [];
  }

  applyFilters(): void {
    const search = this.searchQuery.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !search || 
                          (user.name?.toLowerCase().includes(search)) ||
                          (user.email?.toLowerCase().includes(search));
      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      const matchesStatus = !this.statusFilter || user.status === this.statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
    console.log(`Filtered users: ${this.filteredUsers.length} out of ${this.users.length}`);
  }
}
