import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { ObsComponent } from './components/obs/obs.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'obs', component: ObsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
