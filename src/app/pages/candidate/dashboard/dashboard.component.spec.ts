import { CandidateDashboardComponent } from './dashboard.component';
import { of, throwError } from 'rxjs';

/**
 * Isolated Unit Test for CandidateDashboardComponent
 * Tests the component logic without TestBed or DOM rendering.
 */
describe('CandidateDashboardComponent Isolated Unit Test', () => {
  let component: CandidateDashboardComponent;
  let mockAuthService: any;
  let mockApplicationService: any;
  let mockJobService: any;
  let mockProfileService: any;
  let mockSubscriptionService: any;
  let mockRouter: any;

  beforeEach(() => {
    // 1. Setup isolated mocks (Compatible with Jest/Vitest)
    mockAuthService = {
      getCurrentUser: jest.fn().mockReturnValue({ id: 1, name: 'John Doe' })
    };

    mockApplicationService = {
      getApplicationsByCandidate: jest.fn().mockReturnValue(of([
        { id: 101, status: 'PENDING' },
        { id: 102, status: 'SHORTLISTED' },
        { id: 103, status: 'HIRED' }
      ]))
    };

    mockJobService = {
      getJobs: jest.fn().mockReturnValue(of([{ id: 1, title: 'Software Engineer' }]))
    };

    mockProfileService = {
      getCandidateProfile: jest.fn().mockReturnValue(of({ fullName: 'John Doe', mobile: '1234567890' }))
    };

    mockSubscriptionService = {
      getCurrentSubscription: jest.fn().mockReturnValue(of({ plan: 'PREMIUM', status: 'ACTIVE' }))
    };

    mockRouter = {
      navigate: jest.fn()
    };

    // 2. Instantiate the component directly
    component = new CandidateDashboardComponent(
      mockAuthService,
      mockApplicationService,
      mockJobService,
      mockProfileService,
      mockSubscriptionService,
      mockRouter
    );
  });

  it('should create the component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data on ngOnInit if user is logged in', () => {
    component.ngOnInit();
    
    // Verify services were called
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(mockApplicationService.getApplicationsByCandidate).toHaveBeenCalledWith(1);
    expect(mockJobService.getJobs).toHaveBeenCalled();
    expect(mockProfileService.getCandidateProfile).toHaveBeenCalledWith(1);
    expect(mockSubscriptionService.getCurrentSubscription).toHaveBeenCalledWith(1, 'CANDIDATE');

    // Verify state updates based on mock data
    expect(component.applications.length).toBe(3);
    expect(component.shortlistedCount).toBe(1);
    expect(component.hiredCount).toBe(1);
    expect(component.recommendedJobs.length).toBe(1);
    expect(component.isPremium).toBe(true);
  });

  it('should calculate profile completion correctly', () => {
    const profile = { fullName: 'John Doe', mobile: '12345', skills: ['Java'] }; // 3 fields filled
    const completion = component.calculateCompletion(profile);
    
    // 9 total fields in the calculation
    const expected = Math.round((3 / 9) * 100);
    expect(completion).toBe(expected);
  });

  it('should get current user name correctly', () => {
    const name = component.getCurrentUserName();
    expect(name).toBe('John'); // 'John Doe' split by space
  });
});
