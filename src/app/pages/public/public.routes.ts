import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'browse-jobs',
    loadComponent: () => import('./browse-jobs/browse-jobs.component').then(c => c.BrowseJobsComponent)
  },
  {
    path: 'job-details/:id',
    loadComponent: () => import('./job-details/job-details.component').then(c => c.JobDetailsComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(c => c.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(c => c.ContactComponent)
  },
  ];
