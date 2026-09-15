import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonErrorComponent } from './common-error.component';

describe('CommonErrorComponent', () => {
  let component: CommonErrorComponent;
  let fixture: ComponentFixture<CommonErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonErrorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommonErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
