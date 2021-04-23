import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { skip } from 'rxjs/operators';
import { Locale } from '../models/locale';
import { locales } from '../models/locales';

@Injectable({
  providedIn: 'root',
})
export class UserConfigService {
  private localeSubject: BehaviorSubject<Locale>;
  locale$: Observable<Locale>;
  shield: string;

  constructor(
    private translate: TranslateService,
    private cookies: CookieService
  ) {
    this.localeSubject = new BehaviorSubject<Locale>(null);
    this.locale$ = this.localeSubject.asObservable().pipe(skip(1));
    const localeCode = this.cookies.get('locale') || 'es';
    const shield = this.cookies.get('shield') || 'taxi';

    this.setLocale(localeCode);
    this.setShield(shield);
  }

  setLocale(localeCode: string) {
    const locale = locales.find(({ code }) => code === localeCode);
    this.translate.use(locale.code);
    moment.locale(locale.code);
    this.cookies.set('locale', localeCode);
    this.localeSubject.next(locale);
  }

  getLocale(): Locale {
    return this.localeSubject.getValue();
  }

  getLanguages(): Locale[] {
    return locales;
  }

  setShield(shield: string) {
    this.shield = shield;
    this.cookies.set('shield', shield);
  }

  getShield(): string {
    return this.shield;
  }
}
