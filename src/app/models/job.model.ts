export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
  salaryRange?: string;
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE';
  category: string;
  skills: string[];
  postedDate: string;
  deadline?: string;
  isActive: boolean;
  company: Company;
  recruiter: Recruiter;
  applicationCount: number;
  viewCount: number;
}

export interface Company {
  id: number;
  name: string;
  description?: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  logoUrl?: string;
  foundedYear?: number;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface Recruiter {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: Company;
}

export interface JobApplication {
  id: number;
  jobId: number;
  job: Job;
  candidateId: number;
  candidate: Candidate;
  coverLetter?: string;
  resumeUrl: string;
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  appliedDate: string;
  lastUpdated: string;
  notes?: string;
}

export interface JobFilter {
  search?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  category?: string;
  salaryRange?: string;
  skills?: string[];
  postedDate?: string;
  page?: number;
  limit?: number;
}

export interface JobSearchResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  resumeUrl?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
}
