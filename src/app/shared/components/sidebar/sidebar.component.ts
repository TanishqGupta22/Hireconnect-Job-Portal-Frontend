import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

export interface SidebarItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLinkActive,
    RouterLink
  ],
  template: `
    <mat-sidenav-container class="sidebar-container">
      <mat-sidenav 
        [opened]="isOpen" 
        [mode]="mode" 
        [fixedInViewport]="fixedInViewport"
        class="sidebar">
        
        <div class="sidebar-content">
          <div class="sidebar-header">
            <div class="brand-logo-container">
              <img src="assets/logo.png" alt="HireConnect" class="sidebar-logo">
              <span class="brand-name">HireConnect</span>
            </div>
            <div class="user-info">
              <div class="user-avatar">
                <mat-icon>account_circle</mat-icon>
              </div>
              <div class="user-details">
                <div class="user-name">{{ getCurrentUserName() }}</div>
                <div class="user-role">{{ getUserRole() }}</div>
              </div>
            </div>
          </div>

          <mat-nav-list class="sidebar-menu">
            <a 
              *ngFor="let item of menuItems" 
              mat-list-item 
              [routerLink]="item.route"
              routerLinkActive="active"
              #rla="routerLinkActive">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
              <span 
                *ngIf="item.badge" 
                class="badge"
                [class.active]="rla.isActive">
                {{ item.badge }}
              </span>
            </a>
          </mat-nav-list>
        </div>

        <div class="sidebar-footer">
          <button mat-icon-button (click)="toggleSidebar()" class="toggle-btn" [matTooltip]="isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'">
            <mat-icon>{{ isOpen ? 'chevron_left' : 'chevron_right' }}</mat-icon>
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidebar-container {
      height: 100vh;
    }

    .sidebar {
      width: 280px;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--border-color);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    /* Custom Scrollbar for Sidebar Menu */
    .sidebar-content::-webkit-scrollbar {
      width: 4px;
    }
    .sidebar-content::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 4px;
    }

    .sidebar-header {
      padding: 24px 16px;
      border-bottom: 1px solid var(--border-color);
      background: var(--sidebar-header-bg);
      display: flex;
      flex-direction: column;
      gap: 20px;
      flex-shrink: 0;
    }

    .brand-logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .sidebar-logo {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 900;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .sidebar-menu {
      padding: 16px 0;
      flex: 1;
    }

    mat-list-item {
      height: 44px !important;
      margin: 2px 12px !important;
      border-radius: 10px !important;
      transition: all 0.2s ease !important;
    }

    .sidebar-footer {
      padding: 12px 16px;
      border-top: 1px solid var(--border-color);
      background: var(--sidebar-header-bg);
      flex-shrink: 0;
      display: flex;
      justify-content: center;
    }

    .toggle-btn {
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }

    .toggle-btn:hover {
      color: var(--primary-600);
      background: var(--hover-color);
    }

    .content {
      background: var(--bg-color);
      min-height: 100vh;
      transition: background-color 0.3s ease;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        max-width: 280px;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Input() mode: 'over' | 'push' | 'side' = 'side';
  @Input() fixedInViewport = false;
  @Input() menuItems: SidebarItem[] = [];
  @Output() sidebarToggle = new EventEmitter<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    public themeService: ThemeService
  ) {}

  getCurrentUserName(): string {
    const user = this.authService['currentUserSubject']?.value;
    return user ? (user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()) : '';
  }

  getUserRole(): string {
    return this.authService.getUserRole() || 'User';
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }
}
