import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (authService.isLoggedIn) {
    return true;
  }

  messageService.add(`AuthGuard: blocked access to ${state.url}. Login required.`);
  return router.createUrlTree(['/dashboard'], { queryParams: { loginRequired: true } });
};
