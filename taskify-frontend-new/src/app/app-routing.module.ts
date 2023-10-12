import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { UpdateTaskComponent } from './update-task/update-task.component';

const routes: Routes = [
  //login
  {
    path:'',component:LoginComponent
  },
  {
    path:'register',component:RegistrationComponent

  },
  {
    path:'home',component:HomeComponent

  },
  {
    path:'dashboard',component:DashboardComponent

  },
  {
    path:'transaction',component:TransactionsComponent

  },
  {
    path:'update/:id',component:UpdateTaskComponent
  },
  {
    path:'**',component:PageNotFoundComponent

  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
