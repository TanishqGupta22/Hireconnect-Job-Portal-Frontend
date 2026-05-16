import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent, SidebarItem } from '../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationService } from '../../core/services/application.service';

@Component({
  selector: 'app-recruiter-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent
  ],
  template: `
    <div class="recruiter-layout">
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
    .recruiter-layout {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f8f9fa;
      overflow: hidden;
      padding-top: 80px; /* Space for fixed navbar */
    }

    .layout-container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      background: #f8f9fa;
      position: relative;
    }

    .content-wrapper {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .content-wrapper {
        padding: 16px;
      }
    }
  `]
})
export class RecruiterLayoutComponent implements OnInit {
  sidebarOpen = true;
  sidebarMenuItems: SidebarItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/recruiter/dashboard'
    },
    {
      icon: 'business',
      label: 'Company Profile',
      route: '/recruiter/company-profile'
    },
    {
      icon: 'post_add',
      label: 'Post Job',
      route: '/recruiter/post-job'
    },
    {
      icon: 'work',
      label: 'My Jobs',
      route: '/recruiter/my-jobs'
    },
    {
      icon: 'people',
      label: 'Applicants',
      route: '/recruiter/applicants',
      badge: 0
    },
    {
      icon: 'star',
      label: 'Shortlisted',
      route: '/recruiter/shortlisted'
    },
    {
      icon: 'event',
      label: 'Interviews',
      route: '/recruiter/interviews'
    },
    {
      icon: 'stars',
      label: 'Subscription',
      route: '/recruiter/subscription'
    },
    {
      icon: 'analytics',
      label: 'Analytics',
      route: '/recruiter/analytics'
    },
    {
      icon: 'settings',
      label: 'Settings',
      route: '/recruiter/settings'
    }
  ];

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.updateApplicationCount();
  }

  updateApplicationCount(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.applicationService.getRecruiterApplicationsCount(user.id).subscribe({
        next: (count) => {
          const applicantsItem = this.sidebarMenuItems.find(item => item.label === 'Applicants');
          if (applicantsItem) {
            applicantsItem.badge = count;
          }
        },
        error: (err) => {
          console.error('Error fetching application count:', err);
          // Set to 0 if service fails
          const applicantsItem = this.sidebarMenuItems.find(item => item.label === 'Applicants');
          if (applicantsItem) {
            applicantsItem.badge = 0;
          }
        }
      });
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
