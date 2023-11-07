import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkDetailsComponent } from './link-details.component';

describe('LinkDetailsComponent', () => {
  let component: LinkDetailsComponent;
  let fixture: ComponentFixture<LinkDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkDetailsComponent],
    });
    fixture = TestBed.createComponent(LinkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
