export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Candidate extends User {
  profile?: CandidateProfile;
}

export interface Recruiter extends User {
  company?: Company;
}

export interface CandidateProfile {
  id: number;
  userId: number;
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
