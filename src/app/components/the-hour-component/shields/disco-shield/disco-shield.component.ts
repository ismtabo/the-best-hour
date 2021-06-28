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
  songs = [
    'f46525e0005a36a105eb344f185625dc',
    'd158cda6466f3334c46c29a7c52060b1',
  ];
  song: string;

  constructor() {
    let songIdx: number;
    if (Math.random() > 0.5) {
      songIdx = 0;
    } else {
      songIdx = 1;
    }
    this.song = `assets/sound/${this.songs[songIdx]}.mp3`;
  }

  ngOnInit(): void {}
}
