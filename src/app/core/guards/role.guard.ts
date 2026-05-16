import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }

    const userRole = authService.getUserRole()?.toUpperCase();
    
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Redirect to unauthorized page if user doesn't have required role
    router.navigate(['/unauthorized']);
    return false;
  };
};

// Specific role guards for convenience
export const adminGuard = roleGuard(['ADMIN']);
export const recruiterGuard = roleGuard(['RECRUITER', 'ADMIN']);
export const candidateGuard = roleGuard(['CANDIDATE', 'ADMIN']);
