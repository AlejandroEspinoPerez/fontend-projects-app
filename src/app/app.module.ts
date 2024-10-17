import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { } from '@angular/material';
import { AncianoComponent } from './ancianosComponents/anciano/anciano.component';
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
import { DialogAncianoComponent } from './ancianosComponents/dialog-anciano/dialog-anciano.component';
import { DialogActivitiesComponent } from './enfermedadesComponents/dialog-activities/dialog-activities.component';
import { DialogContactosComponent } from './contactosComponents/dialogContacto/dialog-contactos.component';
import { ContactosComponent } from './contactosComponents/contactos/contactos.component';
import { ActivitiesComponent } from './enfermedadesComponents/activities/activities.component';
import { AncianoDetalleComponent } from './ancianosComponents/anciano-detalles/anciano-detalle.component';
import { ActivitiesDetalleComponent } from './enfermedadesComponents/activities-detalles/activities-detalle.component';
import { ContactosDetalleComponent } from './contactosComponents/contactos-detalles/contactos-detalle.component';
import { ProjectsComponent } from './projectsComponents/projects/projects.component';
import { DialogProjectsComponent } from './projectsComponents/dialog-projects/dialog-projects.component';
import { ProjectsDetalleComponent } from './projectsComponents/projects-detalles/projects-detalle.component';


@NgModule({
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
    AncianoComponent,
    DialogAncianoComponent,
    DialogActivitiesComponent,
    DialogContactosComponent,
    ContactosComponent,
    ActivitiesComponent,
    AncianoDetalleComponent,
    ActivitiesDetalleComponent,
    ContactosDetalleComponent,
    ProjectsComponent,
    DialogProjectsComponent,
    ProjectsDetalleComponent



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

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
