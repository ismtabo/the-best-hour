import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JSBAngularFlipClockModule } from 'jsb-angular-flip-clock';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxFlagIconCssModule } from 'ngx-flag-icon-css';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DigitsPipe } from './components/flipdown-hour/digits.pipe';
import { FlipdownHourComponent } from './components/flipdown-hour/flipdown-hour.component';
import { HourComponent } from './components/hour/hour.component';
import { HourPipe } from './components/hour/hour.pipe';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { DryerShieldComponent } from './components/the-hour-component/shields/dryer-shield/dryer-shield.component';
import { NightShieldComponent } from './components/the-hour-component/shields/night-shield/night-shield.component';
import { RainShieldComponent } from './components/the-hour-component/shields/rain-shield/rain-shield.component';
import { TheHourComponentComponent } from './components/the-hour-component/the-hour-component.component';
import { CountdownComponent } from './pages/countdown/countdown.component';
import { HoursListComponent } from './pages/hours-list/hours-list.component';
import { SortHoursPipe } from './pages/hours-list/sort-hours.pipe';
import { dbConfig } from './shared/database/config';

@NgModule({
  declarations: [
    AppComponent,
    FlipdownHourComponent,
    DigitsPipe,
    LanguageSelectorComponent,
    TheHourComponentComponent,
    CountdownComponent,
    HoursListComponent,
    HourComponent,
    HourPipe,
    SortHoursPipe,
    NightShieldComponent,
    RainShieldComponent,
    DryerShieldComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    RouterModule,
    JSBAngularFlipClockModule,
    // configure the imports
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxFlagIconCssModule,
    OverlayModule,
    BrowserAnimationsModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    FormsModule,
    ClickOutsideModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
