import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountdownComponent } from './pages/countdown/countdown.component';
import { HoursListComponent } from './pages/hours-list/hours-list.component';

const routes: Routes = [
  { path: '', component: CountdownComponent },
  { path: 'hours', component: HoursListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
