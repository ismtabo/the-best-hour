import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { JSBAngularFlipClockModule } from 'jsb-angular-flip-clock';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { FlipdownHourComponent } from './components/flipdown-hour/flipdown-hour.component';
import { DigitsPipe } from './components/flipdown-hour/digits.pipe';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    FlipdownHourComponent,
    DigitsPipe,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule,
    JSBAngularFlipClockModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
