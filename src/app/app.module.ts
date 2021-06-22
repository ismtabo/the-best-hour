import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { OfflineModule } from '@ngx-pwa/offline';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JSBAngularFlipClockModule } from 'jsb-angular-flip-clock';
import { ClickOutsideModule } from 'ng-click-outside';
import { CookieService } from 'ngx-cookie-service';
import { NgxFlagIconCssModule } from 'ngx-flag-icon-css';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EngineComponent } from './components/engine/engine.component';
import { DigitsPipe } from './components/flipdown-hour/digits.pipe';
import { FlipdownHourComponent } from './components/flipdown-hour/flipdown-hour.component';
import { HourComponent } from './components/hour/hour.component';
import { HourPipe } from './components/hour/hour.pipe';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { DiscoShieldComponent } from './components/the-hour-component/shields/disco-shield/disco-shield.component';
import { DryerShieldComponent } from './components/the-hour-component/shields/dryer-shield/dryer-shield.component';
import { FruitCakeShieldComponent } from './components/the-hour-component/shields/fruit-cake-shield/fruit-cake-shield.component';
import { NightShieldComponent } from './components/the-hour-component/shields/night-shield/night-shield.component';
import { RainShieldComponent } from './components/the-hour-component/shields/rain-shield/rain-shield.component';
import { TaxiShieldComponent } from './components/the-hour-component/shields/taxi-shield/taxi-shield.component';
import { TheHourComponentComponent } from './components/the-hour-component/the-hour-component.component';
import { ConfigComponent } from './pages/config/config.component';
import { CountdownComponent } from './pages/countdown/countdown.component';
import { ProfileAvatarComponent } from './pages/countdown/profile-avatar.component';
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
    ConfigComponent,
    DryerShieldComponent,
    ProfileAvatarComponent,
    TaxiShieldComponent,
    FruitCakeShieldComponent,
    EngineComponent,
    DiscoShieldComponent,
  ],
  imports: [
    // configure the imports
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    RouterModule,
    JSBAngularFlipClockModule,
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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(), // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    OfflineModule.forRoot({ guardsRedirect: false }),
    DropdownModule,
    ButtonModule,
    AvatarModule,
    BadgeModule,
    InputSwitchModule,
  ],
  bootstrap: [AppComponent],
  providers: [CookieService],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
