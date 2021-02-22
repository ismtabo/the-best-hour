import { Component } from '@angular/core';
import { name, version } from '../../package.json';
import { UserConfigService } from './shared/services/user-config.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly name: string = name;
  readonly version: string = version;

  constructor(private userConfig: UserConfigService) {}
}
