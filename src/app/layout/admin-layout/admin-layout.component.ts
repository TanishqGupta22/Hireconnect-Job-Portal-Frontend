import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent, SidebarItem } from '../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent
  ],
  template: `
    <div class="admin-layout">
      <app-navbar></app-navbar>
      
      <div class="layout-container">
        <app-sidebar 
          [menuItems]="sidebarMenuItems"
          [isOpen]="sidebarOpen"
          (sidebarToggle)="toggleSidebar()">
        </app-sidebar>
        
        <main class="main-content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      min-height: 100vh;
      background: var(--bg-color);
      display: flex;
      flex-direction: column;
    }

    .layout-container {
      display: flex;
      height: calc(100vh - 80px);
      background: var(--bg-color);
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      background: var(--bg-color);
      display: flex;
      flex-direction: column;
    }

    .content-wrapper {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .content-wrapper {
        padding: 16px;
      }
    }
  `]
})
export class AdminLayoutComponent {
  sidebarOpen = true;
  sidebarMenuItems: SidebarItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/admin/dashboard'
    },
    {
      icon: 'people',
      label: 'Manage Users',
      route: '/admin/users'
    },
    {
      icon: 'business',
      label: 'Manage Recruiters',
      route: '/admin/recruiters'
    },
    {
      icon: 'work',
      label: 'Manage Jobs',
      route: '/admin/jobs'
    },
    {
      icon: 'analytics',
      label: 'Analytics',
      route: '/admin/analytics'
    },
    {
      icon: 'payments',
      label: 'Revenue',
      route: '/admin/revenue'
    },
    {
      icon: 'assessment',
      label: 'Reports',
      route: '/admin/reports'
    },
    {
      icon: 'settings',
      label: 'Settings',
      route: '/admin/settings'
    }
  ];

  constructor(private authService: AuthService) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
