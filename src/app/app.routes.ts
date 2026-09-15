import { Routes } from '@angular/router';
import { GuestDashboardComponent } from './core/post-login/guest-dashboard/guest-dashboard.component';
import { RegisterFormComponent } from './core/pre-login/register-form/register-form.component';
import { LoginFormComponent } from './core/pre-login/login-form/login-form.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./core/pre-login/login-form/login-form.component')
        .then(m => m.LoginFormComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./core/pre-login/register-form/register-form.component')
        .then(m => m.RegisterFormComponent)
  },

  {
    path: '',
    component: LayoutComponent,
    children: [

      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./core/post-login/guest-dashboard/guest-dashboard.component')
        .then(m=>m.GuestDashboardComponent)
      },
        {
          path: 'profile',
          loadComponent: () =>
            import('./core/post-login/profile/profile.component')
              .then(m => m.ProfileComponent)
        },
        {
          path: 'study-planner',
          loadComponent: () =>
            import('./core/post-login/study-planner/study-planner.component')
              .then(m => m.StudyPlannerComponent)
        },
         {
          path: 'courses',
          loadComponent: () =>
            import('./core/post-login/courses/courses.component')
              .then(m => m.CoursesComponent)
        }

    ]
  },


];
// export const routes: Routes = [
//      {
//         path:'',
//         redirectTo: 'dashboard', pathMatch: 'full'
//     },
//     {
//         path:'dashboard',
//         component: GuestDashboardComponent
//     },
//      {
//         path:'register',
//         component: RegisterFormComponent
//     },
//     {
//         path:'login',
//         component: LoginFormComponent
//     },
//      { path: '404', component: PageNotFoundComponent },
//       { path: '**', redirectTo: '404', pathMatch: 'full' },
// ];
