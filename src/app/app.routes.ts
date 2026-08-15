import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.Login) },
  { path: 'forgot-password', loadComponent: () => import('./auth/forgot-password/forgot-password').then(m => m.ForgotPassword) },
  { path: 'register', loadComponent: () => import('./auth/register/register').then(m => m.Register) },
  {
    path: 'dashboard',
    loadComponent: () => import('./layout/dashboard/dashboard').then(m => m.Dashboard),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./home/home').then(m => m.Home) },
      { path: 'quality/change-requests', loadComponent: () => import('./quality/change-requests/change-requests').then(m => m.ChangeRequests) },
      { path: 'quality/manage', loadComponent: () => import('./quality/manage/manage').then(m => m.Manage) },
      { path: 'quality/reports', loadComponent: () => import('./quality/reports/reports').then(m => m.Reports) },
      { path: 'documents', loadComponent: () => import('./documents/documents').then(m => m.Documents) },
      { path: 'documents/add-folder', loadComponent: () => import('./documents/add-folder/add-folder').then(m => m.AddFolder) },
      { path: 'documents/add-folder/:documentId', loadComponent: () => import('./documents/add-folder/add-folder').then(m => m.AddFolder) },
      { path: 'documents/add', loadComponent: () => import('./documents/add-document/add-document').then(m => m.AddDocument) },
      { path: 'documents/add/folder/:folderId', loadComponent: () => import('./documents/add-document/add-document').then(m => m.AddDocument) },
      { path: 'documents/add/:documentId', loadComponent: () => import('./documents/add-document/add-document').then(m => m.AddDocument) },
      { path: 'documents/folder/:folderId', loadComponent: () => import('./documents/SubFolders/subDocument').then(m => m.SubDocument) },
      { path: 'training/my-trainings', loadComponent: () => import('./training/my-trainings/my-trainings').then(m => m.MyTrainings) },
      { path: 'training/manage-trainings', loadComponent: () => import('./training/manage-trainings/manage-trainings').then(m => m.ManageTrainings) },
      { path: 'training/instructor-trainings', loadComponent: () => import('./training/instructor-trainings/instructor-trainings').then(m => m.InstructorTrainings) },
      { path: 'training/user-trainings/manage', loadComponent: () => import('./training/user-trainings/manage/manage').then(m => m.Manage) },
      { path: 'training/user-trainings/review', loadComponent: () => import('./training/user-trainings/review/review').then(m => m.Review) },
      { path: 'training/reports', loadComponent: () => import('./training/reports/reports').then(m => m.Reports) },
      { path: 'admin/organization-configuration', loadComponent: () => import('./admin/organization-configuration/organization-configuration').then(m => m.OrganizationConfiguration) },
      { path: 'admin/user-management', loadComponent: () => import('./admin/user-management/user-management').then(m => m.UserManagement) },
      { path: 'admin/reports', loadComponent: () => import('./admin/reports/reports').then(m => m.Reports) },
      { path: 'settings/system-codes', loadComponent: () => import('./settings/system-codes/system-codes').then(m => m.SystemCodes) },
      { path: 'settings/schedules', loadComponent: () => import('./settings/schedules/schedules').then(m => m.Schedules) }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
