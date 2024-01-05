import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalSaveConfigComponent } from './cal-save-config.component';

describe('CalSaveConfigComponent', () => {
  let component: CalSaveConfigComponent;
  let fixture: ComponentFixture<CalSaveConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalSaveConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalSaveConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
