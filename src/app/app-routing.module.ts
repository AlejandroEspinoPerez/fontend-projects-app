import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { BodyComponent } from "./body/body.component";
import { RegisterComponent } from "./register/register.component";

import { UserlistingComponent } from "./userlisting/userlisting.component";
import { AuthGuard } from './guard/auth.guard';
import { ActivitiesComponent } from './activitiesComponents/activities/activities.component';
import { ProjectsComponent } from './projectsComponents/projects/projects.component';
import { TaskComponent } from './taskCompnents/task/task.component';
import { EventsComponent } from './eventsComponents/events/events.component';
import { Calendar } from '@fullcalendar/core';
import { CalendarComponent } from './calendar/calendar.component';
import { ReportsComponent } from './reports/reports.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', title: 'Dashboard', component: DashboardComponent },
  { path: 'projects', title: 'Projects', component: ProjectsComponent, canActivate: [AuthGuard] },
  { path: 'events', title: 'Eventos', component: EventsComponent, canActivate: [AuthGuard] },
  { path: 'activities/:id', title: 'Actividades', component: ActivitiesComponent, canActivate: [AuthGuard] },
  { path: 'task/:id', title: 'Tareas', component: TaskComponent, canActivate: [AuthGuard] },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'register', title: 'Registro', component: RegisterComponent },
  { path: 'calendar', title: 'Calendario', component: CalendarComponent },
  { path: 'reports', title: 'Reportes', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'userlisting', title: 'Usuarios', component: UserlistingComponent, canActivate: [AuthGuard] },
  { path: '404', title: 'Error', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

