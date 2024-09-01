import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminComponent } from './superadmin.component';

// import { SuperadminComponent } from './superadmin.component';

describe('SuperadminComponent', () => {
  let component: SuperAdminComponent;
  let fixture: ComponentFixture<SuperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
