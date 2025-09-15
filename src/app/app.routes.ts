import { Routes } from '@angular/router';
import { LoginGuard } from './core/guards/login.guard'
import { PanelGuard } from './core/guards/panel.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent), canActivate: [PanelGuard]},
  { path: 'inicio', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), canActivate: [LoginGuard]},
  { path: 'gestion', loadComponent: () => import('./pages/buttons-menu/buttons-menu.component').then(m => m.ButtonsMenuComponent), canActivate: [LoginGuard]},
  { path: 'gestion/crear', loadComponent: () => import('./pages/create-manangement/create-manangement.component').then(m => m.CreateManangementComponent), canActivate: [LoginGuard] },
  { path: 'gestion/crearsemanal', loadComponent: () => import('./pages/create-manangement-week/create-manangement-week.component').then(m => m.CreateManangementWeekComponent), canActivate: [LoginGuard]},
  { path: 'gestion/historialsemanal', loadComponent: () => import('./pages/history-manangement-week/history-manangement-week.component').then(m => m.HistoryManangementWeekComponent), canActivate: [LoginGuard] },
  { path: 'gestion/historial', loadComponent: () => import('./pages/history-manangement/history-manangement.component').then(m => m.HistoryManangementComponent), canActivate: [LoginGuard] },
  { path: 'categoria/:cat_id', loadComponent: () => import('./pages/expenses/expenses.component').then(m => m.ExpensesComponent), canActivate: [LoginGuard]},
  { path: 'migrate', loadComponent: () => import('./pages/history-manangement-week/history-manangement-week.component').then(m => m.HistoryManangementWeekComponent), canActivate: [LoginGuard]},
  { path: 'categoria', loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent), canActivate: [LoginGuard]},
  { path: 'ventas', loadComponent: () => import('./pages/units-sold/units-sold.component').then(m => m.UnitsSoldComponent), canActivate: [LoginGuard]},
  { path: 'ventas/historial', loadComponent: () => import('./pages/units-sold-history/units-sold-history.component').then (m => m.UnitsSoldHistoryComponent), canActivate: [LoginGuard]},
  { path: 'resenas', loadComponent: () => import('./pages/review/review.component').then(m => m.ReviewComponent), canActivate: [LoginGuard]},
  { path: 'menuxr', loadComponent: () => import('./pages/review-menu/review-menu.component').then(m => m.ReviewMenuComponent), canActivate: [LoginGuard]},
  { path: 'review-stats', loadComponent: () => import('./pages/review-stats/review-stats.component').then(m => m.ReviewStatsComponent), canActivate: [LoginGuard] },
  { path: 'review-form', loadComponent: () => import('./pages/review-form/review-form.component').then(m => m.ReviewFormComponent) },





  { path: '', redirectTo: 'inicio', pathMatch: 'full' }, 

];
