import { BrowseJobsComponent } from './browse-jobs.component';
import { of, throwError } from 'rxjs';

/**
 * Isolated Unit Test for BrowseJobsComponent
 * Tests the component logic without TestBed or DOM rendering.
 */
describe('BrowseJobsComponent Isolated Unit Test', () => {
  let component: BrowseJobsComponent;
  let mockRouter: any;
  let mockSnackBar: any;
  let mockAuthService: any;
  let mockJobService: any;
  let mockProfileService: any;
  let mockApplicationService: any;

  beforeEach(() => {
    // 1. Setup isolated mocks
    mockRouter = {
      navigate: jest.fn()
    };

    mockSnackBar = {
      open: jest.fn()
    };

    mockAuthService = {
      getCurrentUser: jest.fn().mockReturnValue({ id: 1, role: 'CANDIDATE' })
    };

    mockJobService = {
      getJobs: jest.fn().mockReturnValue(of([
        { id: 1, title: 'Frontend Developer', recruiterId: 1, experienceLevel: 'Mid Level', experienceRequired: 2, workMode: 'Remote', isActive: true },
        { id: 2, title: 'Backend Developer', recruiterId: 1, experienceLevel: 'Senior Level', experienceRequired: 5, workMode: 'On-site', isActive: true }
      ]))
    };

    mockProfileService = {
      getCandidateProfile: jest.fn().mockReturnValue(of({ skills: ['JavaScript', 'React'] })),
      getRecruiterProfile: jest.fn().mockReturnValue(of({ companyName: 'Test Company', logoUrl: '' }))
    };

    mockApplicationService = {
      getApplicationsByCandidate: jest.fn().mockReturnValue(of([
        { jobId: 1, status: 'PENDING' }
      ]))
    };

    // 2. Instantiate the component directly
    component = new BrowseJobsComponent(
      mockRouter,
      mockSnackBar,
      mockAuthService,
      mockJobService,
      mockProfileService,
      mockApplicationService
    );
  });

  it('should create the component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial data and map applied jobs', () => {
    component.ngOnInit();
    
    expect(mockJobService.getJobs).toHaveBeenCalled();
    expect(mockApplicationService.getApplicationsByCandidate).toHaveBeenCalledWith(1);
    expect(mockProfileService.getCandidateProfile).toHaveBeenCalledWith(1);

    expect(component.jobs.length).toBe(2);
    expect(component.filteredJobs.length).toBe(2);
    expect(component.appliedJobIds.has(1)).toBe(true);
    expect(component.appliedJobIds.has(2)).toBe(false);
  });

  it('should filter jobs correctly based on search query', () => {
    component.ngOnInit(); // Load the 2 dummy jobs
    
    component.searchQuery = 'Frontend';
    component.filterJobs();
    
    expect(component.filteredJobs.length).toBe(1);
    expect(component.filteredJobs[0].title).toBe('Frontend Developer');
  });

  it('should filter jobs correctly based on experience level', () => {
    component.ngOnInit(); 
    
    component.selectedExperience = 'Senior Level';
    component.filterJobs();
    
    expect(component.filteredJobs.length).toBe(1);
    expect(component.filteredJobs[0].title).toBe('Backend Developer');
  });

  it('should filter remote jobs correctly', () => {
    component.ngOnInit();
    
    component.selectedRemote = 'Remote';
    component.filterJobs();
    
    expect(component.filteredJobs.length).toBe(1);
    expect(component.filteredJobs[0].title).toBe('Frontend Developer');
  });

  it('should toggle skills selection', () => {
    component.toggleSkill('React');
    expect(component.selectedSkills).toContain('React');
    
    component.toggleSkill('React');
    expect(component.selectedSkills).not.toContain('React');
  });

  it('should navigate to job details when a job is clicked', () => {
    component.viewJobDetails({ id: 1 } as any);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/job-details', 1]);
  });
});
