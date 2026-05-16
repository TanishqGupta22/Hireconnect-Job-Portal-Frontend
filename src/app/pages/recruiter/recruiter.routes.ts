import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { recruiterGuard } from '../../core/guards/role.guard';

export const RECRUITER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.RecruiterDashboardComponent),
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.RecruiterDashboardComponent),
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'analytics',
    loadComponent: () => import('./analytics/analytics.component').then(c => c.RecruiterAnalyticsComponent),
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'company-profile',
    loadComponent: () => import('./company-profile/company-profile.component').then(c => c.CompanyProfileComponent),
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'post-job',
    loadComponent: () => import('./post-job/post-job.component').then(c => c.PostJobComponent),
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'my-jobs',
    loadComponent: () => import('./my-jobs/my-jobs.component').then(c => c.MyJobsComponent),
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'applicants',
    loadComponent: () => import('./applicants/applicants.component').then(c => c.ApplicantsComponent),
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'shortlisted',
    loadComponent: () => import('./applicants/applicants.component').then(c => c.ApplicantsComponent), // Reuse or specific shortlisted component
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'interviews',
    loadComponent: () => import('./interviews/interviews.component').then(c => c.InterviewsComponent),
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'subscription',
    loadComponent: () => import('./subscription/subscription.component').then(c => c.SubscriptionComponent),
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'candidate-profile/:id',
    loadComponent: () => import('./applicants/candidate-profile-view.component').then(c => c.CandidateProfileViewComponent),
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'schedule-interview',
    loadComponent: () => import('./interviews/schedule-interview.component').then(c => c.ScheduleInterviewComponent),
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications.component').then(c => c.NotificationsComponent),
    canActivate: [authGuard, recruiterGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(c => c.SettingsComponent),
    canActivate: [authGuard, recruiterGuard]
  }
];
