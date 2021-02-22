import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigComponent } from './pages/config/config.component';
import { CountdownComponent } from './pages/countdown/countdown.component';
import { HoursListComponent } from './pages/hours-list/hours-list.component';

const routes: Routes = [
  { path: '', component: CountdownComponent },
  { path: 'hours', component: HoursListComponent },
  { path: 'config', component: ConfigComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
