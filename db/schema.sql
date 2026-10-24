-- =============================================================================
-- mintGig — PostgreSQL / Supabase Database Schema
-- Project: https://yblwdprzljhpqkzdvklq.supabase.co
-- Description: Complete schema for Users, Student Profiles, Client Profiles,
--              Courses, Lessons, Enrollments, Certificates, Freelance Projects,
--              Proposals, Conversations, Messages, and Notifications.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. ENUM TYPES
-- =============================================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'client', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE course_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE certificate_status AS ENUM ('active', 'revoked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_budget_type AS ENUM ('fixed', 'hourly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled', 'paused');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proposal_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM (
        'enrollment',
        'course_complete',
        'certificate_issued',
        'proposal_received',
        'proposal_accepted',
        'proposal_rejected',
        'proposal_withdrawn',
        'new_message',
        'project_status'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 2. TABLES
-- =============================================================================

-- 2.1 USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    username VARCHAR(60) UNIQUE,
    avatar TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 STUDENT PROFILES
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    headline VARCHAR(200) DEFAULT '',
    bio TEXT DEFAULT '',
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    location VARCHAR(100) DEFAULT '',
    website TEXT DEFAULT '',
    github TEXT DEFAULT '',
    linkedin TEXT DEFAULT '',
    portfolio_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_portfolio_public BOOLEAN NOT NULL DEFAULT TRUE,
    available_for_hire BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 CLIENT PROFILES
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    company_name VARCHAR(200) DEFAULT '',
    company_size VARCHAR(50) DEFAULT '',
    industry VARCHAR(100) DEFAULT '',
    bio TEXT DEFAULT '',
    website TEXT DEFAULT '',
    location VARCHAR(100) DEFAULT '',
    total_projects_posted INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 COURSES
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    short_description VARCHAR(300) NOT NULL,
    description TEXT DEFAULT '',
    instructor VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    skill_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    level course_level NOT NULL DEFAULT 'Beginner',
    duration NUMERIC(5,2) NOT NULL DEFAULT 0,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    thumbnail TEXT DEFAULT '',
    learning_objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
    prerequisites JSONB NOT NULL DEFAULT '[]'::jsonb,
    status course_status NOT NULL DEFAULT 'draft',
    quiz JSONB NOT NULL DEFAULT '{}'::jsonb,
    certificate_eligible BOOLEAN NOT NULL DEFAULT TRUE,
    completion_threshold INT NOT NULL DEFAULT 80,
    enrollment_count INT NOT NULL DEFAULT 0,
    rating NUMERIC(3,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 LESSONS
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT DEFAULT '',
    video_url TEXT DEFAULT '',
    duration INT NOT NULL DEFAULT 0,
    lesson_order INT NOT NULL DEFAULT 1,
    is_free BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.6 ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    status enrollment_status NOT NULL DEFAULT 'active',
    completed_lessons JSONB NOT NULL DEFAULT '[]'::jsonb,
    progress_percent INT NOT NULL DEFAULT 0,
    quiz_score INT DEFAULT NULL,
    quiz_passed BOOLEAN NOT NULL DEFAULT FALSE,
    quiz_attempts INT NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NULL,
    certificate_issued BOOLEAN NOT NULL DEFAULT FALSE,
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_student_course_enrollment UNIQUE (student_id, course_id)
);

-- 2.7 CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id VARCHAR(50) NOT NULL UNIQUE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status certificate_status NOT NULL DEFAULT 'active',
    revoked_at TIMESTAMPTZ DEFAULT NULL,
    revoked_reason TEXT DEFAULT '',
    quiz_score INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_student_course_certificate UNIQUE (student_id, course_id)
);

-- 2.8 FREELANCE PROJECTS
CREATE TABLE IF NOT EXISTS public.freelance_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    category VARCHAR(100) NOT NULL,
    budget_type project_budget_type NOT NULL DEFAULT 'fixed',
    budget_min NUMERIC(10,2) NOT NULL DEFAULT 0,
    budget_max NUMERIC(10,2) NOT NULL DEFAULT 0,
    duration VARCHAR(50) DEFAULT '',
    deadline TIMESTAMPTZ DEFAULT NULL,
    status project_status NOT NULL DEFAULT 'open',
    proposal_count INT NOT NULL DEFAULT 0,
    view_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.9 PROPOSALS
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.freelance_projects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    cover_message TEXT NOT NULL,
    relevant_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    proposed_budget NUMERIC(10,2) NOT NULL,
    estimated_days INT NOT NULL,
    status proposal_status NOT NULL DEFAULT 'pending',
    client_note TEXT DEFAULT '',
    decided_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_project_student_proposal UNIQUE (project_id, student_id)
);

-- 2.10 CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.freelance_projects(id) ON DELETE CASCADE,
    participants JSONB NOT NULL DEFAULT '[]'::jsonb,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.11 MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.12 NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link TEXT DEFAULT '',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ DEFAULT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. INDEXES FOR PERFORMANCE & SEARCH
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_price ON public.courses(price);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student ON public.certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_cert_id ON public.certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.freelance_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.freelance_projects(category);
CREATE INDEX IF NOT EXISTS idx_proposals_project ON public.proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_student ON public.proposals(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- Full-Text Search Indexes
CREATE INDEX IF NOT EXISTS idx_courses_fts ON public.courses USING gin(to_tsvector('english', title || ' ' || short_description));
CREATE INDEX IF NOT EXISTS idx_projects_fts ON public.freelance_projects USING gin(to_tsvector('english', title || ' ' || description));

-- =============================================================================
-- 4. AUTO-UPDATE TRIGGER FUNCTION FOR updated_at
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name IN ('users', 'student_profiles', 'client_profiles', 'courses', 
                             'lessons', 'enrollments', 'certificates', 'freelance_projects', 
                             'proposals', 'conversations', 'notifications')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_update_timestamp ON public.%I', tbl);
        EXECUTE format('CREATE TRIGGER trg_update_timestamp BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', tbl);
    END LOOP;
END $$;

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelance_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public read access policies for discovery & verification
CREATE POLICY "Public read published courses" ON public.courses FOR SELECT USING (status = 'published');
CREATE POLICY "Public read active certificates" ON public.certificates FOR SELECT USING (status = 'active');
CREATE POLICY "Public read open projects" ON public.freelance_projects FOR SELECT USING (status = 'open');
CREATE POLICY "Public read student public portfolios" ON public.student_profiles FOR SELECT USING (is_portfolio_public = true);
CREATE POLICY "Public read users basic profile" ON public.users FOR SELECT USING (is_active = true);

-- Service/Authenticated full access policies
CREATE POLICY "Full access for service role" ON public.users FOR ALL USING (true);
CREATE POLICY "Full access for student profiles" ON public.student_profiles FOR ALL USING (true);
CREATE POLICY "Full access for client profiles" ON public.client_profiles FOR ALL USING (true);
CREATE POLICY "Full access for courses" ON public.courses FOR ALL USING (true);
CREATE POLICY "Full access for lessons" ON public.lessons FOR ALL USING (true);
CREATE POLICY "Full access for enrollments" ON public.enrollments FOR ALL USING (true);
CREATE POLICY "Full access for certificates" ON public.certificates FOR ALL USING (true);
CREATE POLICY "Full access for freelance projects" ON public.freelance_projects FOR ALL USING (true);
CREATE POLICY "Full access for proposals" ON public.proposals FOR ALL USING (true);
CREATE POLICY "Full access for conversations" ON public.conversations FOR ALL USING (true);
CREATE POLICY "Full access for messages" ON public.messages FOR ALL USING (true);
CREATE POLICY "Full access for notifications" ON public.notifications FOR ALL USING (true);

-- =============================================================================
-- 6. DEMO SEED DATA (Aarav, Priya, Neha, Vikram, Admin)
-- =============================================================================
INSERT INTO public.users (id, name, email, password, role, username, avatar)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'mintGig Admin', 'admin@mintgig.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'admin', 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'),
    ('a0000000-0000-0000-0000-000000000002', 'Aarav Sharma', 'student1@mintgig.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'student', 'aaravsharma', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav'),
    ('a0000000-0000-0000-0000-000000000003', 'Priya Patel', 'student2@mintgig.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'student', 'priyapatel', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'),
    ('a0000000-0000-0000-0000-000000000004', 'Neha Gupta', 'client1@mintgig.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'client', 'nehagupta', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha'),
    ('a0000000-0000-0000-0000-000000000005', 'Vikram Malhotra', 'client2@mintgig.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'client', 'vikrammalhotra', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram')
ON CONFLICT (email) DO NOTHING;

-- Student Profiles Seed
INSERT INTO public.student_profiles (user_id, headline, bio, skills, location, github, linkedin, portfolio_projects)
VALUES
    ('a0000000-0000-0000-0000-000000000002', 'Full-Stack Developer & React Specialist', 'Passionate computer science student dedicated to building clean, accessible web applications. Certified on mintGig.', '["React", "Node.js", "Express", "Tailwind CSS", "JavaScript", "REST APIs"]'::jsonb, 'Bengaluru, India', 'https://github.com/aaravsharma', 'https://linkedin.com/in/aaravsharma', '[{"title": "DevConnect Social Platform", "description": "Full-stack developer community platform built with React, Tailwind, and Node.js.", "technologies": ["React", "Node.js", "Tailwind CSS"], "link": "https://devconnect-demo.vercel.app", "featured": true}]'::jsonb),
    ('a0000000-0000-0000-0000-000000000003', 'UI/UX Designer & Frontend Craftsman', 'Bridging aesthetic interfaces with maintainable frontend architectures. Specializing in Tailwind CSS and Figma systems.', '["Figma", "UI/UX Design", "Tailwind CSS", "React", "Design Systems"]'::jsonb, 'Mumbai, India', 'https://github.com/priyapatel', 'https://linkedin.com/in/priyapatel', '[{"title": "Campus Marketplace Design System", "description": "Figma component system and prototype for university campus exchange.", "technologies": ["Figma", "Tailwind CSS"], "featured": true}]'::jsonb)
ON CONFLICT (user_id) DO NOTHING;

-- Client Profiles Seed
INSERT INTO public.client_profiles (user_id, company_name, company_size, industry, bio, location, total_projects_posted)
VALUES
    ('a0000000-0000-0000-0000-000000000004', 'EduNova Labs', '11-50', 'EdTech', 'Building next-generation educational tools for universities across India.', 'Delhi, India', 2),
    ('a0000000-0000-0000-0000-000000000005', 'Malhotra Digital Studio', '1-10', 'Design & Web Agency', 'Boutique digital agency delivering premium web applications for emerging startups.', 'Bengaluru, India', 1)
ON CONFLICT (user_id) DO NOTHING;

-- Sample Course
INSERT INTO public.courses (id, title, slug, short_description, description, instructor, category, skill_tags, level, duration, price, thumbnail, status, certificate_eligible, completion_threshold, enrollment_count, rating, quiz)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Full-Stack Web Development with React & Node.js', 'fullstack-react-nodejs', 'Master modern web development from foundational React state management to RESTful Express APIs and verified deployment.', 'Learn comprehensive full-stack architecture using the modern MERN stack.', 'Dr. Rajesh Verma', 'Web Development', '["React", "Node.js", "Express", "Tailwind CSS", "JavaScript"]'::jsonb, 'Intermediate', 24, 0, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop', 'published', true, 80, 142, 4.9, '{"title": "Full-Stack Proficiency Assessment", "passingScore": 75, "questions": [{"question": "Which HTTP status code indicates a successfully created resource in a RESTful API?", "options": ["200 OK", "201 Created", "204 No Content", "301 Moved Permanently"], "correctIndex": 1, "explanation": "HTTP 201 Created is the standard status code returned when a resource is successfully created via POST."}]}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Verified Certificate Seed for Aarav Sharma
INSERT INTO public.enrollments (id, student_id, course_id, status, progress_percent, quiz_score, quiz_passed, completed_at, certificate_issued)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'completed', 100, 92, true, NOW() - INTERVAL '3 days', true)
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO public.certificates (certificate_id, student_id, course_id, enrollment_id, issued_at, status, quiz_score)
VALUES
    ('MINT-DEMO-001', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 days', 'active', 92)
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Sample Freelance Project
INSERT INTO public.freelance_projects (id, client_id, title, description, required_skills, category, budget_type, budget_min, budget_max, duration, status, proposal_count)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'Build Modern Responsive Landing Page for EdTech Tool', 'We are looking for a certified student front-end developer to build a modern, high-converting responsive landing page in React and Tailwind CSS.', '["React", "Tailwind CSS", "Responsive Design"]'::jsonb, 'Web Development', 'fixed', 8000, 15000, '1-2 weeks', 'open', 1)
ON CONFLICT DO NOTHING;
