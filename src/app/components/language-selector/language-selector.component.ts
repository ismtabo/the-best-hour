import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Language } from './language';
import { languages } from './languages';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorComponent implements OnInit {
  currentLanguage: Language;
  languages = languages;
  isOpen = false;

  constructor(private translate: TranslateService) {
    const currentCode = this.translate.currentLang;
    this.currentLanguage = this.languages.find(
      ({ code }) => code === currentCode
    );
  }

  ngOnInit(): void {}

  onLanguageChange(event: Event, language: Language) {
    this.translate.use(language.code);
    moment().locale(language.code);
  }
}
