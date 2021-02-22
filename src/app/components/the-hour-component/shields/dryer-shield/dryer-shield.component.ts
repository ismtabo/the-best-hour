import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-dryer-shield',
  templateUrl: './dryer-shield.component.html',
  styleUrls: ['./dryer-shield.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DryerShieldComponent {
  @ViewChild('audio') playerRef: ElementRef<HTMLAudioElement>;

  active = true;

  onClick() {
    this.active = !this.active;
    if (this.active) {
      this.playerRef.nativeElement.play();
    } else {
      this.playerRef.nativeElement.pause();
    }
  }
}
