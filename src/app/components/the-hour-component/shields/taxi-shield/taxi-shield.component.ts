import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-taxi-shield',
  templateUrl: './taxi-shield.component.html',
  styleUrls: ['./taxi-shield.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxiShieldComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
