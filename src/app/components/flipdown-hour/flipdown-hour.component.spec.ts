import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlipdownHourComponent } from './flipdown-hour.component';

describe('FlipdownHourComponent', () => {
  let component: FlipdownHourComponent;
  let fixture: ComponentFixture<FlipdownHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlipdownHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlipdownHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
