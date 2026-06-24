import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiscinaComponent } from './piscina-component';

describe('PiscinaComponent', () => {
  let component: PiscinaComponent;
  let fixture: ComponentFixture<PiscinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiscinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiscinaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
