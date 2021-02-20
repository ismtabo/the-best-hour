import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-the-hour-component',
  templateUrl: './the-hour-component.component.html',
  styleUrls: ['./the-hour-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TheHourComponentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
