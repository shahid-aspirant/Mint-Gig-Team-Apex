import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import ClientProfile from '../models/ClientProfile.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Certificate from '../models/Certificate.js';
import FreelanceProject from '../models/FreelanceProject.js';
import Proposal from '../models/Proposal.js';
import Conversation from '../models/Conversation.js';
import Notification from '../models/Notification.js';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mintgig';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB. Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      ClientProfile.deleteMany({}),
      Course.deleteMany({}),
      Enrollment.deleteMany({}),
      Certificate.deleteMany({}),
      FreelanceProject.deleteMany({}),
      Proposal.deleteMany({}),
      Conversation.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('Collections cleared. Creating demo users...');

    const salt = await bcrypt.genSalt(12);
    const studentPass = await bcrypt.hash('StudentPass123!', salt);
    const clientPass = await bcrypt.hash('ClientPass123!', salt);
    const adminPass = await bcrypt.hash('AdminPass123!', salt);

    // 1. Users
    const adminUser = await User.create({
      name: 'mintGig Admin',
      email: 'admin@mintgig.com',
      password: adminPass,
      role: 'admin',
      username: 'admin',
    });

    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'student1@mintgig.com',
      password: studentPass,
      role: 'student',
      username: 'aaravsharma',
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'student2@mintgig.com',
      password: studentPass,
      role: 'student',
      username: 'priyapatel',
    });

    const client1 = await User.create({
      name: 'Neha Gupta',
      email: 'client1@mintgig.com',
      password: clientPass,
      role: 'client',
      username: 'nehagupta',
    });

    const client2 = await User.create({
      name: 'Vikram Malhotra',
      email: 'client2@mintgig.com',
      password: clientPass,
      role: 'client',
      username: 'vikramm',
    });

    console.log('Users created. Creating profiles...');

    // 2. Profiles
    await StudentProfile.create({
      user: student1._id,
      headline: 'Full-Stack MERN Developer & React Enthusiast',
      bio: 'Final year CS student passionate about building responsive, fast, and accessible web applications. Certified in Full-Stack Development on mintGig.',
      skills: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Git'],
      location: 'Bengaluru, India',
      website: 'https://aaravsharma.dev',
      github: 'https://github.com/aaravsharma',
      linkedin: 'https://linkedin.com/in/aaravsharma',
      isPortfolioPublic: true,
      availableForHire: true,
      portfolioProjects: [
        {
          title: 'Campus Food Delivery Portal',
          description: 'A responsive web application allowing university students to order from local campus canteens with real-time status tracking.',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
          link: 'https://campus-eats-demo.vercel.app',
          github: 'https://github.com/aaravsharma/campus-eats',
          featured: true,
        },
        {
          title: 'StudyBuddy Notes Sharing Platform',
          description: 'Collaborative peer-to-peer note-sharing application with PDF previews and upvoting system.',
          technologies: ['React', 'Tailwind CSS', 'Firebase'],
          link: 'https://study-buddy-demo.vercel.app',
          github: 'https://github.com/aaravsharma/study-buddy',
          featured: false,
        },
      ],
    });

    await StudentProfile.create({
      user: student2._id,
      headline: 'UI/UX Designer & Frontend Web Developer',
      bio: 'Design enthusiast creating intuitive student interfaces and modern design systems. Converting Figma prototypes into pixel-perfect React code.',
      skills: ['Figma', 'UI/UX Design', 'React', 'Tailwind CSS', 'Prototyping', 'User Research'],
      location: 'Pune, India',
      isPortfolioPublic: true,
      availableForHire: true,
      portfolioProjects: [
        {
          title: 'FinStudent Mobile Dashboard UI',
          description: 'Personal finance and budget tracking mobile UI design system for college students.',
          technologies: ['Figma', 'React', 'Tailwind CSS'],
          link: 'https://finstudent-ui.web.app',
          featured: true,
        },
      ],
    });

    await ClientProfile.create({
      user: client1._id,
      companyName: 'EdInnovate Solutions',
      companySize: '11-50',
      industry: 'EdTech',
      bio: 'Building next-generation digital learning tools for schools and universities across India.',
      website: 'https://edinnovate.io',
      location: 'Gurugram, India',
      totalProjectsPosted: 2,
    });

    await ClientProfile.create({
      user: client2._id,
      companyName: 'Apex Digital Studio',
      companySize: '1-10',
      industry: 'Digital Agency',
      bio: 'Boutique digital agency delivering modern web and mobile apps for local startups and small businesses.',
      website: 'https://apexdigital.co',
      location: 'Mumbai, India',
      totalProjectsPosted: 2,
    });

    console.log('Profiles created. Creating courses...');

    // 3. Courses
    const course1 = await Course.create({
      title: 'Full-Stack Web Development with React & Node.js',
      slug: 'full-stack-web-development-react-node',
      shortDescription: 'Master the MERN stack from the ground up: building modern REST APIs with Node/Express and dynamic SPAs with React.',
      description: 'A comprehensive, hands-on course covering real-world web architecture. Learn HTTP protocols, RESTful API design, state management with React Hooks, MongoDB data modeling, and JWT authentication.',
      instructor: 'Dr. Sameer Sen',
      category: 'Web Development',
      skillTags: ['React', 'Node.js', 'Express', 'MongoDB', 'REST API', 'JavaScript'],
      level: 'Beginner',
      duration: 16,
      price: 0,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      learningObjectives: [
        'Understand component architecture and hooks in React',
        'Build structured RESTful APIs with Express and Mongoose',
        'Implement secure token-based authentication',
        'Deploy and connect full-stack applications',
      ],
      prerequisites: ['Basic HTML, CSS, and modern JavaScript fundamentals'],
      status: 'published',
      completionThreshold: 75,
      certificateEligible: true,
      enrollmentCount: 42,
      rating: 4.8,
      lessons: [
        {
          title: 'Lesson 1: Introduction to Full-Stack Architecture & Modern React',
          content: 'In this lesson, we explore client-server architecture, Single Page Applications (SPAs), virtual DOM mechanics, and creating components with React and Vite. We will set up props, state, and unidirectional data flow.',
          duration: 35,
          order: 1,
          isFree: true,
        },
        {
          title: 'Lesson 2: State Management & React Hooks In-Depth',
          content: 'Delve into useState, useEffect, useContext, and custom hooks. Learn how side effects work, cleanup functions, and managing application-wide state cleanly without prop drilling.',
          duration: 45,
          order: 2,
          isFree: true,
        },
        {
          title: 'Lesson 3: RESTful Backend with Express.js & MongoDB',
          content: 'Set up an Express server with router modularity. Define Mongoose schemas with validation, connect to MongoDB, handle CRUD operations, and implement centralized error middleware.',
          duration: 50,
          order: 3,
          isFree: true,
        },
        {
          title: 'Lesson 4: Authentication, Security & Production Practices',
          content: 'Secure your application with JWTs in HTTP-only cookies, password hashing with bcrypt, input sanitization, rate limiting, and CORS configuration.',
          duration: 40,
          order: 4,
          isFree: true,
        },
      ],
      quiz: {
        title: 'Full-Stack React & Node Certification Assessment',
        description: 'Test your understanding of full-stack MERN development principles. Score 75% or higher to earn your verified certificate.',
        passingScore: 75,
        questions: [
          {
            question: 'What is the primary role of the useEffect hook in React?',
            options: [
              'To modify the component DOM directly without re-rendering',
              'To perform side effects such as data fetching, subscriptions, or manual DOM manipulations',
              'To define global CSS styles for the component',
              'To speed up JavaScript execution using Web Workers',
            ],
            correctIndex: 1,
            explanation: 'useEffect is designed specifically for managing side effects in functional React components.',
          },
          {
            question: 'Why should sensitive authentication tokens be stored in HTTP-only cookies rather than localStorage?',
            options: [
              'Because HTTP-only cookies allow infinite storage capacity',
              'Because HTTP-only cookies cannot be accessed by client-side JavaScript, mitigating XSS attacks',
              'Because localStorage is only supported on mobile devices',
              'Because cookies automatically encrypt the database password',
            ],
            correctIndex: 1,
            explanation: 'HTTP-only cookies are inaccessible to document.cookie, making stolen tokens via XSS attacks much harder.',
          },
          {
            question: 'In Express.js, what does the next() function do inside a middleware function?',
            options: [
              'It restarts the HTTP server to clear memory',
              'It passes control to the next middleware or route handler in the execution stack',
              'It immediately returns a 200 OK response to the client',
              'It commits changes to MongoDB transactions',
            ],
            correctIndex: 1,
            explanation: 'next() tells Express to invoke the subsequent middleware in the pipeline.',
          },
          {
            question: 'Which HTTP method should be used to partially update an existing resource according to REST conventions?',
            options: ['GET', 'POST', 'PATCH', 'DELETE'],
            correctIndex: 2,
            explanation: 'PATCH is the standard HTTP verb for applying partial modifications to a resource.',
          },
        ],
      },
    });

    const course2 = await Course.create({
      title: 'Modern UI/UX Design: Figma to Clean Tailwind CSS',
      slug: 'ui-ux-design-figma-to-tailwind',
      shortDescription: 'Learn interface design principles, design systems in Figma, and how to translate prototypes into responsive Tailwind CSS code.',
      description: 'Bridge the gap between design and engineering. Learn color hierarchy, typography scales, accessibility guidelines (WCAG), component variants in Figma, and build matching layouts in Tailwind CSS.',
      instructor: 'Ananya Mukherjee',
      category: 'Design',
      skillTags: ['UI/UX Design', 'Figma', 'Tailwind CSS', 'CSS', 'Accessibility'],
      level: 'Beginner',
      duration: 12,
      price: 0,
      thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80',
      learningObjectives: [
        'Master Figma layout grids, auto-layout, and components',
        'Apply color theory, typography, and contrast rules',
        'Implement responsive Tailwind CSS layouts effortlessly',
      ],
      prerequisites: ['Basic understanding of web pages and styling'],
      status: 'published',
      completionThreshold: 75,
      certificateEligible: true,
      enrollmentCount: 28,
      rating: 4.9,
      lessons: [
        {
          title: 'Lesson 1: Visual Hierarchy and Design Principles',
          content: 'Discover visual weight, contrast, white space, and reading patterns (F-pattern and Z-pattern). Understand how intentional typography hierarchy guides users.',
          duration: 30,
          order: 1,
          isFree: true,
        },
        {
          title: 'Lesson 2: Figma Auto-Layout & Design Tokens',
          content: 'Master auto-layout frames, constraints, component sets, and spacing tokens in Figma to construct scalable design systems.',
          duration: 40,
          order: 2,
          isFree: true,
        },
        {
          title: 'Lesson 3: Translating Figma Designs into Tailwind CSS',
          content: 'Convert Figma components into semantic HTML with utility classes: flexbox, CSS grid, responsive modifiers (sm, md, lg), and custom themes.',
          duration: 45,
          order: 3,
          isFree: true,
        },
      ],
      quiz: {
        title: 'UI/UX Design & Tailwind Assessment',
        description: 'Prove your proficiency in design systems and Tailwind implementation.',
        passingScore: 66,
        questions: [
          {
            question: 'What is the primary benefit of auto-layout in Figma?',
            options: [
              'It automatically generates backend database schemas',
              'It creates responsive components that adapt dynamically to content size and padding changes',
              'It compresses bitmap images for web delivery',
              'It converts raster graphics into vector icons',
            ],
            correctIndex: 1,
            explanation: 'Auto-layout mimics flexbox behavior, keeping cards and buttons aligned as labels and contents shift.',
          },
          {
            question: 'Which Tailwind CSS class applies a 16px padding on all sides according to the standard scale?',
            options: ['p-16', 'p-4', 'padding-all-4', 'pad-16'],
            correctIndex: 1,
            explanation: 'Tailwind spacing scale unit is 0.25rem (4px). Therefore, p-4 equals 1rem or 16px.',
          },
          {
            question: 'According to WCAG AA guidelines, what is the minimum contrast ratio for normal body text?',
            options: ['2:1', '3:1', '4.5:1', '7:1'],
            correctIndex: 2,
            explanation: 'WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text.',
          },
        ],
      },
    });

    const course3 = await Course.create({
      title: 'Python for Automation & Backend Web APIs',
      slug: 'python-automation-backend-apis',
      shortDescription: 'Build automation scripts, web scrapers, and high-performance asynchronous REST APIs using Python and FastAPI.',
      description: 'Harness Python for real-world developer workflows. Learn data manipulation, automation scripts, asynchronous request handling, and building clean web APIs with FastAPI.',
      instructor: 'Vikram Joshi',
      category: 'AI/ML',
      skillTags: ['Python', 'FastAPI', 'Automation', 'REST API', 'Backend'],
      level: 'Beginner',
      duration: 14,
      price: 0,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
      learningObjectives: [
        'Write clean, idiomatic Python code with type hints',
        'Automate repetitive file and web tasks',
        'Create performant REST endpoints using FastAPI',
      ],
      prerequisites: ['Basic programming concepts'],
      status: 'published',
      completionThreshold: 75,
      certificateEligible: true,
      enrollmentCount: 35,
      rating: 4.7,
      lessons: [
        {
          title: 'Lesson 1: Modern Python Essentials & Type Hinting',
          content: 'Overview of Python 3.12 syntax, list comprehensions, dictionary operations, functions, decorators, and modern type annotations.',
          duration: 35,
          order: 1,
          isFree: true,
        },
        {
          title: 'Lesson 2: Scripting & Task Automation',
          content: 'Work with the requests library, json parsing, file system management, and building automated CLI tools.',
          duration: 40,
          order: 2,
          isFree: true,
        },
        {
          title: 'Lesson 3: Asynchronous APIs with FastAPI',
          content: 'Create route operations, Pydantic request models, automatic Swagger docs, and dependency injection in FastAPI.',
          duration: 45,
          order: 3,
          isFree: true,
        },
      ],
      quiz: {
        title: 'Python & FastAPI Certification Quiz',
        description: 'Demonstrate your Python fundamentals and backend API knowledge.',
        passingScore: 66,
        questions: [
          {
            question: 'What library does FastAPI use under the hood for data validation and serialization?',
            options: ['SQLAlchemy', 'Pydantic', 'Celery', 'Django ORM'],
            correctIndex: 1,
            explanation: 'FastAPI relies heavily on Pydantic to validate request and response payloads using Python type hints.',
          },
          {
            question: 'What is the purpose of the async and await keywords in Python?',
            options: [
              'To compile Python code to C++ binary',
              'To perform non-blocking asynchronous operations, allowing the event loop to handle concurrent tasks',
              'To secure sensitive database passwords in environment variables',
              'To automatically parallelize CPU-bound loops across all GPU cores',
            ],
            correctIndex: 1,
            explanation: 'async/await allows cooperative multitasking for IO-bound work without spawning OS threads.',
          },
          {
            question: 'What Python data structure is defined with curly braces containing key:value pairs?',
            options: ['List', 'Tuple', 'Dictionary', 'Set'],
            correctIndex: 2,
            explanation: 'Dictionaries (dict) store key-value pairs in Python.',
          },
        ],
      },
    });

    const course4 = await Course.create({
      title: 'Advanced Data Structures & Algorithms in JavaScript',
      slug: 'advanced-dsa-javascript',
      shortDescription: 'Tackle coding interviews with confidence. Master trees, graphs, dynamic programming, and algorithm complexity.',
      description: 'Level up your problem-solving capabilities. Explore Big O analysis, sliding window, two-pointer techniques, binary search trees, graph traversals (BFS/DFS), and dynamic programming.',
      instructor: 'Karan Mehra',
      category: 'Web Development',
      skillTags: ['JavaScript', 'Algorithms', 'Data Structures', 'Problem Solving'],
      level: 'Intermediate',
      duration: 20,
      price: 499,
      thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc14d48509e?w=800&q=80',
      learningObjectives: [
        'Analyze space and time complexity using Big O notation',
        'Implement trees, heaps, and graph algorithms in JS',
        'Solve intermediate coding interview questions methodically',
      ],
      prerequisites: ['Solid proficiency with JavaScript data structures'],
      status: 'published',
      completionThreshold: 80,
      certificateEligible: true,
      enrollmentCount: 19,
      rating: 4.9,
      lessons: [
        {
          title: 'Lesson 1: Algorithmic Complexity & Big-O Notation',
          content: 'Detailed analysis of worst-case, average-case, and best-case time complexity. Identifying exponential vs polynomial runtimes.',
          duration: 40,
          order: 1,
          isFree: true,
        },
        {
          title: 'Lesson 2: Trees & Graph Traversal (BFS & DFS)',
          content: 'Building Binary Search Trees, breadth-first search with queues, and depth-first search with recursion and stacks.',
          duration: 50,
          order: 2,
          isFree: false,
        },
      ],
    });

    console.log('Courses created. Creating enrollments and certificates...');

    // 4. Enrollments & Certificate for Aarav Sharma
    // Completed course 1
    const enrollment1 = await Enrollment.create({
      student: student1._id,
      course: course1._id,
      status: 'completed',
      completedLessons: course1.lessons.map(l => l._id),
      progressPercent: 100,
      quizScore: 100,
      quizPassed: true,
      quizAttempts: 1,
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      certificateIssued: true,
    });

    // Certificate for course 1
    const cert1 = await Certificate.create({
      certificateId: 'MINT-DEMO-001',
      student: student1._id,
      course: course1._id,
      enrollment: enrollment1._id,
      issuedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'active',
      quizScore: 100,
    });

    // In-progress course 2 for Aarav
    await Enrollment.create({
      student: student1._id,
      course: course2._id,
      status: 'active',
      completedLessons: [course2.lessons[0]._id],
      progressPercent: 33,
      lastAccessedAt: new Date(),
    });

    // Enrollment for Priya in course 2 (Completed)
    const enrollmentPriya = await Enrollment.create({
      student: student2._id,
      course: course2._id,
      status: 'completed',
      completedLessons: course2.lessons.map(l => l._id),
      progressPercent: 100,
      quizScore: 100,
      quizPassed: true,
      quizAttempts: 1,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      certificateIssued: true,
    });

    await Certificate.create({
      certificateId: 'MINT-DEMO-002',
      student: student2._id,
      course: course2._id,
      enrollment: enrollmentPriya._id,
      issuedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'active',
      quizScore: 100,
    });

    console.log('Certificates created. Creating freelance projects...');

    // 5. Freelance Projects
    const project1 = await FreelanceProject.create({
      client: client1._id,
      title: 'Build a Modern Responsive Landing Page for EdTech Tool',
      description: 'We need a talented student developer to craft a high-converting, mobile-responsive landing page using React and Tailwind CSS. The design is ready in Figma and includes 5 sections: Hero, Features, Pricing table, Testimonials slider, and Contact form.',
      requiredSkills: ['React', 'Tailwind CSS', 'JavaScript', 'Responsive Design'],
      category: 'Web Development',
      budgetType: 'fixed',
      budgetMin: 5000,
      budgetMax: 8000,
      duration: '1-2 weeks',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'open',
      proposalCount: 1,
      viewCount: 34,
    });

    const project2 = await FreelanceProject.create({
      client: client2._id,
      title: 'Mobile App UI/UX Design System for Campus Marketplace',
      description: 'Looking for a creative UI/UX designer to build comprehensive Figma wireframes and high-fidelity mockups for a student-to-student campus marketplace app (buying books, dorm items, and gadgets). Includes 12 screens and a cohesive color style guide.',
      requiredSkills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping'],
      category: 'Design',
      budgetType: 'fixed',
      budgetMin: 4000,
      budgetMax: 7000,
      duration: '2 weeks',
      deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      status: 'open',
      proposalCount: 1,
      viewCount: 22,
    });

    const project3 = await FreelanceProject.create({
      client: client1._id,
      title: 'Node.js & Express REST API for Quiz Analytics Microservice',
      description: 'Need a backend developer to build a modular Express API service with MongoDB. Requirements include calculating student percentile rankings, quiz completion averages, and exporting summary reports in JSON.',
      requiredSkills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
      category: 'Web Development',
      budgetType: 'fixed',
      budgetMin: 6000,
      budgetMax: 10000,
      duration: '2-3 weeks',
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'open',
      proposalCount: 0,
      viewCount: 15,
    });

    const project4 = await FreelanceProject.create({
      client: client2._id,
      title: 'E-commerce Dynamic Search & Filter Component',
      description: 'Implement an interactive product filtering and multi-attribute search component with price sliders, category chips, and sort dropdowns in React.',
      requiredSkills: ['React', 'JavaScript', 'Tailwind CSS'],
      category: 'Web Development',
      budgetType: 'fixed',
      budgetMin: 3500,
      budgetMax: 5500,
      duration: '1 week',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'in_progress',
      proposalCount: 1,
      viewCount: 45,
    });

    console.log('Projects created. Creating proposals...');

    // 6. Proposals
    // Proposal for project 1 by Aarav (pending)
    const proposal1 = await Proposal.create({
      project: project1._id,
      student: student1._id,
      coverMessage: 'Hello Neha! I have certified expertise in React and Tailwind CSS on mintGig with a 100% quiz score. I have built multiple responsive web portals (including my campus delivery platform). I can translate your Figma file into a clean, pixel-perfect, accessible landing page within 7 days.',
      relevantSkills: ['React', 'Tailwind CSS', 'JavaScript', 'Responsive Design'],
      proposedBudget: 6500,
      estimatedDays: 7,
      status: 'pending',
    });

    // Proposal for project 4 by Aarav (accepted -> in_progress)
    const proposal2 = await Proposal.create({
      project: project4._id,
      student: student1._id,
      coverMessage: 'Hi Vikram, I specialize in building performant React filter components with memoized state and responsive touch-friendly controls. Excited to collaborate!',
      relevantSkills: ['React', 'JavaScript', 'Tailwind CSS'],
      proposedBudget: 4500,
      estimatedDays: 5,
      status: 'accepted',
      clientNote: 'Great portfolio and verified certification on mintGig. Looking forward to working together!',
      decidedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Proposal for project 2 by Priya (pending)
    await Proposal.create({
      project: project2._id,
      student: student2._id,
      coverMessage: 'Hi Vikram! I am a passionate UI/UX designer on mintGig certified in Figma to Tailwind. I have designed student dashboards and would love to design this campus marketplace.',
      relevantSkills: ['Figma', 'UI/UX Design', 'Wireframing'],
      proposedBudget: 5500,
      estimatedDays: 10,
      status: 'pending',
    });

    console.log('Proposals created. Creating conversations & messages...');

    // 7. Conversation between Vikram and Aarav for project 4
    const conversation1 = await Conversation.create({
      project: project4._id,
      participants: [client2._id, student1._id],
      lastMessage: 'Sounds perfect! I will share the GitHub repo link and initial layout draft tomorrow.',
      lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      messages: [
        {
          sender: client2._id,
          content: 'Hi Aarav, welcome to the project! Your certified skills in React look fantastic on your portfolio. Can you review the wireframe and confirm if the 5-day delivery timeline works?',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          sender: student1._id,
          content: 'Hi Vikram, thank you for accepting my proposal! Yes, 5 days is plenty of time. I will structure the state cleanly so the filters support price ranges, tags, and search keywords smoothly.',
          createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
          readAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
        },
        {
          sender: client2._id,
          content: 'Awesome. Please let me know if you need any additional assets or component references.',
          createdAt: new Date(Date.now() - 1.2 * 24 * 60 * 60 * 1000),
          readAt: new Date(Date.now() - 1.2 * 24 * 60 * 60 * 1000),
        },
        {
          sender: student1._id,
          content: 'Sounds perfect! I will share the GitHub repo link and initial layout draft tomorrow.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          readAt: null,
        },
      ],
    });

    console.log('Conversations created. Creating notifications...');

    // 8. Notifications
    await Notification.create([
      {
        user: student1._id,
        type: 'certificate_issued',
        title: 'Certificate Issued! 🎓',
        message: 'Congratulations! Your certificate for "Full-Stack Web Development with React & Node.js" is ready. Identifier: MINT-DEMO-001',
        link: '/student/certificates',
        isRead: false,
      },
      {
        user: student1._id,
        type: 'proposal_accepted',
        title: 'Proposal Accepted! 🎉',
        message: 'Vikram Malhotra accepted your proposal for "E-commerce Dynamic Search & Filter Component"',
        link: '/student/proposals',
        isRead: true,
      },
      {
        user: client1._id,
        type: 'proposal_received',
        title: 'New Proposal Received',
        message: 'Aarav Sharma submitted a proposal for "Build a Modern Responsive Landing Page for EdTech Tool"',
        link: '/client/proposals',
        isRead: false,
      },
      {
        user: client2._id,
        type: 'new_message',
        title: 'New message from Aarav Sharma',
        message: 'Sounds perfect! I will share the GitHub repo link and initial layout draft tomorrow.',
        link: '/client/messages',
        isRead: false,
      },
    ]);

    console.log('=============================================');
    console.log('✅ mintGig Database Seeded Successfully!');
    console.log('=============================================');
    console.log('Demo Credentials for Reviewers / Judges:');
    console.log('---------------------------------------------');
    console.log('ADMIN:');
    console.log('  Email:    admin@mintgig.com');
    console.log('  Password: AdminPass123!');
    console.log('STUDENT (with completed course, cert & portfolio):');
    console.log('  Email:    student1@mintgig.com');
    console.log('  Password: StudentPass123!');
    console.log('  Username: aaravsharma');
    console.log('STUDENT (Priya):');
    console.log('  Email:    student2@mintgig.com');
    console.log('  Password: StudentPass123!');
    console.log('  Username: priyapatel');
    console.log('CLIENT (Neha):');
    console.log('  Email:    client1@mintgig.com');
    console.log('  Password: ClientPass123!');
    console.log('CLIENT (Vikram):');
    console.log('  Email:    client2@mintgig.com');
    console.log('  Password: ClientPass123!');
    console.log('=============================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
