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
  alternative = false;

  async onClick(event: Event) {
    event.stopPropagation();
    this.active = !this.active;
    return this.active
      ? this.playerRef.nativeElement.play()
      : this.playerRef.nativeElement.pause();
  }
}
