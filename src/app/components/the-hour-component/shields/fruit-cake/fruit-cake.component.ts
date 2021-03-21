import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-fruit-cake',
  templateUrl: './fruit-cake.component.html',
  styleUrls: ['./fruit-cake.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FruitCakeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
