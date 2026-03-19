export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  techStack?: string[];
}

export interface Skill {
  name: string;
  level?: number;
}

export interface SkillCategory {
  name: string;
  color: string;
  glowColor: string;
  icon: string;
  skills: Skill[];
}

export interface HardwareProject {
  title: string;
  description: string;
  techStack: string[];
  github?: string;
  badge?: string;
  icon: string;
}

export interface SoftwareProject {
  title: string;
  description: string;
  techStack: string[];
  github?: string;
  live?: string;
  icon: string;
}

export interface FeaturedProject {
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  icon: string;
  gradient: string;
  status: string;
}

export interface Achievement {
  title: string;
  event: string;
  year: string;
  type: "winner" | "finalist" | "recognition";
  description: string;
  icon: string;
  org: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  organization: string;
  description: string;
  tags: string[];
}
