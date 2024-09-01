import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GroupComponent } from './components/group/group.component';
import { SuperAdminComponent } from './components/superadmin/superadmin.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'group', component: GroupComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'super-admin', component: SuperAdminComponent },
];
