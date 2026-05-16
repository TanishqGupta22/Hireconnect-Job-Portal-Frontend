import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { adminGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.AdminDashboardComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.AdminDashboardComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./users/manage-users.component').then(c => c.ManageUsersComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'recruiters',
    loadComponent: () => import('./recruiters/manage-recruiters.component').then(c => c.ManageRecruitersComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'jobs',
    loadComponent: () => import('./jobs/manage-jobs.component').then(c => c.ManageJobsComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'applications',
    loadComponent: () => import('./applications/manage-applications.component').then(c => c.ManageApplicationsComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'analytics',
    loadComponent: () => import('./analytics/analytics.component').then(c => c.AdminAnalyticsComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'revenue',
    loadComponent: () => import('./revenue/revenue.component').then(c => c.RevenueComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'reports',
    loadComponent: () => import('./settings/admin-extra.component').then(c => c.ReportsComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/admin-extra.component').then(c => c.SettingsComponent),
    canActivate: [authGuard, adminGuard]
  }
];
