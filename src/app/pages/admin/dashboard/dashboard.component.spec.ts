import { AdminDashboardComponent } from './dashboard.component';
import { of, throwError, Observable } from 'rxjs';

/**
 * Isolated Unit Test for AdminDashboardComponent
 * Tests the component logic without TestBed or DOM rendering.
 */
describe('AdminDashboardComponent Isolated Unit Test', () => {
  let component: AdminDashboardComponent;
  let mockAuthService: any;
  let mockAdminService: any;
  let mockRouter: any;

  beforeEach(() => {
    // 1. Setup isolated mocks (Compatible with Jest/Vitest)
    mockAuthService = {}; // Admin dashboard doesn't heavily use authService on init

    mockAdminService = {
      getRevenueStats: jest.fn().mockReturnValue(of({ activeSubscriptions: 10, totalRevenue: 5000 })),
      getSystemStats: jest.fn().mockReturnValue(of({ totalUsers: 100 })),
      getAllApplications: jest.fn().mockReturnValue(of([
        { status: 'SHORTLISTED' },
        { status: 'HIRED' }
      ])),
      getUsers: jest.fn().mockReturnValue(of([
        { id: 2, name: 'Alice', role: 'CANDIDATE', createdAt: new Date().toISOString() },
        { id: 1, name: 'Bob', role: 'RECRUITER', createdAt: new Date().toISOString() }
      ]))
    };

    mockRouter = {
      navigate: jest.fn()
    };

    // 2. Instantiate the component directly
    component = new AdminDashboardComponent(
      mockAuthService,
      mockAdminService,
      mockRouter
    );
  });

  it('should create the component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should load all stats on ngOnInit', () => {
    component.ngOnInit();
    
    // Verify services were called
    expect(mockAdminService.getRevenueStats).toHaveBeenCalled();
    expect(mockAdminService.getSystemStats).toHaveBeenCalled();
    expect(mockAdminService.getAllApplications).toHaveBeenCalled();
    expect(mockAdminService.getUsers).toHaveBeenCalled();

    // Verify component state
    expect(component.revenueStats.activeSubscriptions).toBe(10);
    expect(component.stats.totalUsers).toBe(100);
    expect(component.shortlistedCount).toBe(1);
    expect(component.hiredCount).toBe(1);
    expect(component.recentUsers.length).toBe(2);
  });

  it('should format time correctly for recent items', () => {
    expect(component.formatTime('')).toBe('Recently');
    
    const now = new Date();
    const tenMinsAgo = new Date(now.getTime() - 10 * 60000).toISOString();
    expect(component.formatTime(tenMinsAgo)).toBe('10 mins ago');
  });

  it('should fallback to default stats if getSystemStats fails', () => {
    mockAdminService.getSystemStats.mockReturnValue({
      subscribe: (handlers: any) => {
        handlers.error(new Error('API Error'));
        return { unsubscribe: () => {} };
      }
    });
    component.loadStats();
    expect(component.stats.totalUsers).toBe(0);
  });

  it('should navigate when navigateTo is called', () => {
    component.navigateTo('/admin/revenue');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/revenue']);
  });
});
