/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TestValuesComponent } from './test-values.component';

describe('TestValuesComponent', () => {
  let component: TestValuesComponent;
  let fixture: ComponentFixture<TestValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
