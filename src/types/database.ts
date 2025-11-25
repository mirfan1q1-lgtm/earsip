export interface HeroSection {
  id: string;
  name: string;
  role: string;
  description: string;
  profile_image_url: string;
  updated_at: string;
}

export interface AboutMe {
  id: string;
  bio: string;
  cv_url: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  title: string;
  position: string;
  start_year: number;
  end_year: number | null;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  year: number;
  demo_link: string | null;
  github_link: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
