import { Routes } from '@angular/router';
import { candidateGuard, recruiterGuard, adminGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/public/public.routes').then(m => m.PUBLIC_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'candidate',
    canActivate: [candidateGuard],
    loadComponent: () => import('./layout/candidate-layout/candidate-layout.component').then(c => c.CandidateLayoutComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/candidate/candidate.routes').then(m => m.CANDIDATE_ROUTES)
      }
    ]
  },
  {
    path: 'candidate-direct',
    canActivate: [candidateGuard],
    loadComponent: () => import('./pages/candidate/dashboard/dashboard.component').then(c => c.CandidateDashboardComponent)
  },
  {
    path: 'recruiter',
    canActivate: [recruiterGuard],
    loadComponent: () => import('./layout/recruiter-layout/recruiter-layout.component').then(c => c.RecruiterLayoutComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/recruiter/recruiter.routes').then(m => m.RECRUITER_ROUTES)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(c => c.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/error/unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent)
  },
  {
    path: 'not-found',
    loadComponent: () => import('./pages/error/not-found/not-found.component').then(c => c.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '/not-found'
  }
];
