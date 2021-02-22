import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Locale } from 'src/app/shared/models/locale';
import { UserConfigService } from '../../shared/services/user-config.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorComponent {
  currentLanguage: Locale;
  languages: Array<Locale | { label: string }>;

  constructor(
    private userConfig: UserConfigService,
    private translate: TranslateService
  ) {
    this.languages = this.userConfig.getLanguages().map((locale) => ({
      ...locale,
      label: this.translate.instant('app.languages.' + locale.code),
    }));
    this.currentLanguage = this.userConfig.getLocale();
  }

  onLanguageChange(selectedCode: string) {
    this.userConfig.setLocale(selectedCode);
    this.currentLanguage = this.userConfig.getLocale();
  }
}
