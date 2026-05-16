import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { candidateGuard } from '../../core/guards/role.guard';
import { CandidateDashboardComponent } from './dashboard/dashboard.component';

export const CANDIDATE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: CandidateDashboardComponent
  },
  {
    path: 'browse-jobs',
    loadComponent: () => import('../../pages/public/browse-jobs/browse-jobs.component').then(c => c.BrowseJobsComponent)
  },
  {
    path: 'job-details/:id',
    loadComponent: () => import('../../pages/public/job-details/job-details.component').then(c => c.JobDetailsComponent)
  },
  {
    path: 'apply-job/:id',
    loadComponent: () => import('./apply-job/apply-job.component').then(c => c.ApplyJobComponent)
  },
  {
    path: 'my-applications',
    loadComponent: () => import('./my-applications/my-applications.component').then(c => c.MyApplicationsComponent)
  },
  {
    path: 'applied-jobs',
    loadComponent: () => import('./my-applications/my-applications.component').then(c => c.MyApplicationsComponent)
  },
  {
    path: 'saved-jobs',
    loadComponent: () => import('./saved-jobs/saved-jobs.component').then(c => c.SavedJobsComponent)
  },
  {
    path: 'interviews',
    loadComponent: () => import('./interviews/interviews.component').then(c => c.InterviewsComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications.component').then(c => c.NotificationsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(c => c.SettingsComponent)
  },
  {
    path: 'subscription',
    loadComponent: () => import('./subscription/subscription.component').then(c => c.CandidateSubscriptionComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
  }
];
