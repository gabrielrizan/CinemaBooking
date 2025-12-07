import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isTokenValid = authService.isTokenValid();

  if (!isTokenValid) {
    router.navigate(['/home']);
    return false;
  }

  try {
    await firstValueFrom(authService.getUserDetails());
    const isAdmin = authService.isAdmin();

    if (isAdmin) {
      return true;
    }
  } catch (error) {
    // Optional: Handle error silently or with a user notification
  }

  router.navigate(['/home']);
  return false;
};
