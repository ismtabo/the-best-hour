import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/components/engine/engine.service';
import { DiscoShieldEngineService } from './disco-shield-engine.service';

@Component({
  selector: 'app-disco',
  templateUrl: './disco-shield.component.html',
  styleUrls: ['./disco-shield.component.scss'],
  providers: [
    {
      provide: EngineService,
      useClass: DiscoShieldEngineService,
    },
  ],
})
export class DiscoShieldComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
