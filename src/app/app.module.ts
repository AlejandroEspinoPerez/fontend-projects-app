import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './register/register.component'
import { MaterialModule } from 'src/material.module';
import { LoginComponent } from './login/login.component';
import { CdkTableModule, CdkTableDataSourceInput } from "@angular/cdk/table";
import { UserlistingComponent } from './userlisting/userlisting.component';
import { UpdatepopupComponent } from './updatepopup/updatepopup.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DialogActivitiesComponent } from './activitiesComponents/dialog-activities/dialog-activities.component';
import { ActivitiesComponent } from './activitiesComponents/activities/activities.component';
import { ActivitiesDetalleComponent } from './activitiesComponents/activities-detalles/activities-detalle.component';
import { ProjectsComponent } from './projectsComponents/projects/projects.component';
import { DialogProjectsComponent } from './projectsComponents/dialog-projects/dialog-projects.component';
import { ProjectsDetalleComponent } from './projectsComponents/projects-detalles/projects-detalle.component';
import { TaskComponent } from './taskCompnents/task/task.component';
import { TaskDetalleComponent } from './taskCompnents/task-detalles/task-detalle.component';
import { DialogTaskComponent } from './taskCompnents/dialog-task/dialog-task.component';
import { EventsComponent } from './eventsComponents/events/events.component';
import { EventsDetalleComponent } from './eventsComponents/events-detalles/events-detalle.component';
import { DialogEventsComponent } from './eventsComponents/dialogEvents/dialog-events.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarEventsDetalleComponent } from './calendar/calendarDetalles/calendar-events-detalle.component';
import { ReportsComponent } from './reports/reports.component';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    PageNotFoundComponent,
    RegisterComponent,
    LoginComponent,
    UserlistingComponent,
    UpdatepopupComponent,
    DialogActivitiesComponent,
    ActivitiesComponent,
    ActivitiesDetalleComponent,
    ProjectsComponent,
    DialogProjectsComponent,
    ProjectsDetalleComponent,
    TaskComponent,
    TaskDetalleComponent,
    DialogTaskComponent,
    EventsComponent,
    EventsDetalleComponent,
    DialogEventsComponent,
    CalendarComponent,
    CalendarEventsDetalleComponent,
    ReportsComponent



  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    CdkTableModule,
    FullCalendarModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
