import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { name, version } from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly name: string = name;
  readonly version: string = version;

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('es');
  }
}
