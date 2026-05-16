import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent, SidebarItem } from '../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-candidate-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent
  ],
  template: `
    <div class="candidate-layout">
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
    .candidate-layout {
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
export class CandidateLayoutComponent implements OnInit {
  sidebarOpen = true;
  sidebarMenuItems: SidebarItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/candidate/dashboard'
    },
    {
      icon: 'person',
      label: 'My Profile',
      route: '/candidate/profile'
    },
    {
      icon: 'work',
      label: 'Browse Jobs',
      route: '/candidate/browse-jobs'
    },
    {
      icon: 'bookmark',
      label: 'Saved Jobs',
      route: '/candidate/saved-jobs'
    },
    {
      icon: 'history',
      label: 'Applied Jobs',
      route: '/candidate/applied-jobs'
    },
    {
      icon: 'event',
      label: 'Interviews',
      route: '/candidate/interviews'
    },
    {
      icon: 'notifications',
      label: 'Notifications',
      route: '/candidate/notifications',
      badge: 0
    },
    {
      icon: 'settings',
      label: 'Settings',
      route: '/candidate/settings'
    },
    {
      icon: 'stars',
      label: 'Subscription',
      route: '/candidate/subscription'
    }
  ];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.updateNotificationCount();
  }

  updateNotificationCount(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.notificationService.getUserNotifications(user.id).subscribe({
        next: (data) => {
          const notificationsItem = this.sidebarMenuItems.find(item => item.label === 'Notifications');
          if (notificationsItem) {
            notificationsItem.badge = data.content.filter((n: any) => !n.isRead).length;
          }
        },
        error: (err) => console.error('Error fetching notifications:', err)
      });
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
