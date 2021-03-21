import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-fruit-cake',
  templateUrl: './fruit-cake-shield.component.html',
  styleUrls: ['./fruit-cake-shield.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FruitCakeShieldComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
