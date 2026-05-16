import { RecruiterDashboardComponent } from './dashboard.component';
import { of, throwError } from 'rxjs';

/**
 * Isolated Unit Test for RecruiterDashboardComponent
 * Tests the component logic without TestBed or DOM rendering.
 */
describe('RecruiterDashboardComponent Isolated Unit Test', () => {
  let component: RecruiterDashboardComponent;
  let mockAuthService: any;
  let mockJobService: any;
  let mockApplicationService: any;

  beforeEach(() => {
    // 1. Setup isolated mocks
    mockAuthService = {
      getCurrentUser: jest.fn().mockReturnValue({ id: 2, name: 'Jane Recruiter' })
    };

    mockJobService = {
      getJobsByRecruiter: jest.fn().mockReturnValue(of([
        { id: 1, title: 'Frontend Developer' }
      ]))
    };

    mockApplicationService = {
      getRecruiterApplicationsCount: jest.fn().mockReturnValue(of(15)),
      getRecruiterApplicationsCountByStatus: jest.fn().mockImplementation((id, status) => {
        if (status === 'SHORTLISTED') return of(5);
        if (status === 'HIRED') return of(2);
        return of(0);
      }),
      getApplicationsByRecruiter: jest.fn().mockReturnValue(of([
        { id: 101, status: 'PENDING' }
      ]))
    };

    // 2. Instantiate the component directly
    component = new RecruiterDashboardComponent(
      mockAuthService,
      mockJobService,
      mockApplicationService
    );
  });

  it('should create the component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on ngOnInit if user is logged in', () => {
    component.ngOnInit();
    
    // Verify services were called
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(mockJobService.getJobsByRecruiter).toHaveBeenCalledWith(2);
    expect(mockApplicationService.getRecruiterApplicationsCount).toHaveBeenCalledWith(2);
    expect(mockApplicationService.getApplicationsByRecruiter).toHaveBeenCalledWith(2, 0, 10);

    // Verify component state
    expect(component.jobs.length).toBe(1);
    expect(component.totalApplications).toBe(15);
    expect(component.shortlistedCount).toBe(5);
    expect(component.hiredCount).toBe(2);
    expect(component.recentApplications.length).toBe(1);
    expect(component.isLoading).toBe(false);
  });

  it('should format current user name correctly', () => {
    const name = component.getCurrentUserName();
    expect(name).toBe('Jane'); // 'Jane Recruiter' split by space
  });

  it('should return correct CSS class based on status', () => {
    expect(component.getStatusClass('PENDING')).toBe('status-pending');
    expect(component.getStatusClass('SHORTLISTED')).toBe('status-shortlisted');
    expect(component.getStatusClass('REJECTED')).toBe('');
  });
});
