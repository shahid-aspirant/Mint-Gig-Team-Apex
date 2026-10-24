import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import api from '../api/client';
import {
  Sparkles,
  BookOpen,
  Award,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Code2,
  Users,
  ChevronDown,
  Layers,
  Star,
  ExternalLink,
} from 'lucide-react';

export const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          api.get('/courses?limit=3'),
          api.get('/projects?limit=3'),
        ]);
        if (cRes.success && cRes.data) setCourses(cRes.data.courses || []);
        if (pRes.success && pRes.data) setProjects(pRes.data.projects || []);
      } catch (_) {}
    };
    fetchData();
  }, []);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does mintGig differ from typical course platforms?',
      a: 'mintGig integrates the entire learn-to-earn pipeline. Instead of just watching video lessons, you complete interactive lessons, pass server-evaluated quizzes, earn cryptographically verifiable certificates, and your professional portfolio is automatically built and updated so you can directly apply for verified freelance gigs on the same platform.',
    },
    {
      q: 'How are certificates verified on mintGig?',
      a: 'Every certificate is generated with a unique identifier (e.g. MINT-DEMO-001) only after a student completes required lessons and exceeds the passing assessment score. Anyone or any client can independently verify authenticity at /verify-certificate/:certificateId.',
    },
    {
      q: 'Are the courses really affordable for students?',
      a: 'Yes! mintGig features zero-cost foundational tracks along with highly affordable specialization courses priced transparently in INR (₹). Our mission is to make industry-standard skill acquisition accessible to every college student.',
    },
    {
      q: 'How do clients review student applicants?',
      a: 'Clients receive proposals with full access to the student’s live mintGig portfolio. They can inspect verified course completions, exact quiz scores, and personal GitHub projects before accepting proposals or initiating project messaging.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-brand-accentLight/40 via-brand-bg to-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-accentLight border border-brand/20 text-brand-dark text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span>The Student Learning-to-Earning Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-dark leading-[1.12]">
                Turn the skills you learn into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-emerald-600">
                  opportunities you earn.
                </span>
              </h1>

              <p className="text-lg text-brand-muted max-w-xl leading-relaxed">
                Learn affordably, earn verified certificates, build your portfolio automatically, and connect with real freelance opportunities — all in one ecosystem.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link to="/courses">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md">
                    Explore Courses
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/register?role=client">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Hire Student Talent
                  </Button>
                </Link>
              </div>

              {/* Trust highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-border/60 text-xs">
                <div>
                  <p className="font-bold text-brand-dark text-base">₹0</p>
                  <p className="text-brand-muted">Free Starter Tracks</p>
                </div>
                <div>
                  <p className="font-bold text-brand-dark text-base">100%</p>
                  <p className="text-brand-muted">Verified Certificates</p>
                </div>
                <div>
                  <p className="font-bold text-brand-dark text-base">Automatic</p>
                  <p className="text-brand-muted">Portfolio Generation</p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Student Journey Card (Interactive application component) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-xl border border-brand-border/90 p-5 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-brand-dark">Student Journey Preview</span>
                  </div>
                  <Badge variant="mint">Live Simulation</Badge>
                </div>

                {/* Step 1: Course Progress */}
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-brand-text flex items-center space-x-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-brand" />
                        <span>Full-Stack MERN Course</span>
                      </span>
                      <span className="text-xs font-bold text-emerald-600">100% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-full" />
                    </div>
                  </div>

                  {/* Step 2: Certificate */}
                  <div className="p-3 rounded-xl bg-brand-accentLight/40 border border-brand/20 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-dark text-brand-accent flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-brand-dark">Verified Certificate</p>
                        <p className="text-[10px] text-brand-muted font-mono">ID: MINT-DEMO-001</p>
                      </div>
                    </div>
                    <Badge variant="emerald">Valid</Badge>
                  </div>

                  {/* Step 3: Auto Portfolio */}
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-brand-dark flex items-center space-x-1.5">
                        <Code2 className="w-3.5 h-3.5 text-brand" />
                        <span>mintgig.com/portfolio/aaravsharma</span>
                      </p>
                      <span className="text-[10px] text-brand font-semibold">Auto-Synced</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-700">React</span>
                      <span className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-700">Node.js</span>
                      <span className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-700">MongoDB</span>
                    </div>
                  </div>

                  {/* Step 4: Freelance Gig Matched */}
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-xs font-bold text-emerald-900">Landing Page Project</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700">₹8,000</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-1">
                      Proposal Status: <span className="font-semibold text-emerald-900">Accepted by Client</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-border/60 text-center">
                  <Link to="/portfolio/aaravsharma" className="text-xs font-semibold text-brand hover:underline inline-flex items-center">
                    Inspect Aarav's live portfolio <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How mintGig Works: 4 Distinct Stages */}
      <section className="py-16 md:py-24 bg-white border-y border-brand-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="mint" className="mb-2">The 4-Step Cycle</Badge>
            <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">
              From Learning a Skill to Landing Paid Projects
            </h2>
            <p className="text-sm text-brand-muted mt-2">
              Every part of mintGig connects seamlessly. Complete a course and your credentials instantly prove your talent to clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-brand-bg border border-brand-border">
              <div className="w-10 h-10 rounded-xl bg-brand-dark text-brand-accent font-bold flex items-center justify-center mb-4 text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">1. Learn Affordably</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Enroll in curated, project-oriented courses in modern web development, UI/UX, and APIs. Progress saves automatically.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-brand-bg border border-brand-border">
              <div className="w-10 h-10 rounded-xl bg-brand text-brand-accent font-bold flex items-center justify-center mb-4 text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">2. Prove Mastery</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Take comprehensive server-graded assessments. Pass with required thresholds to earn tamper-proof, verified certificates.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-brand-bg border border-brand-border">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">3. Auto Showcase</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Your portfolio generates automatically on registration and instantly populates with completed courses, verified badges, and personal projects.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-brand-bg border border-brand-border">
              <div className="w-10 h-10 rounded-xl bg-brand-accent text-brand-dark font-bold flex items-center justify-center mb-4 text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">4. Earn Freelance</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Apply to verified client projects with one click. Clients review your verified skills and hire you with complete confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 md:py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge variant="emerald" className="mb-2">Hands-on Learning</Badge>
              <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">
                Featured Skill Tracks
              </h2>
              <p className="text-sm text-brand-muted mt-1">
                Zero fluff. Industry-standard curriculum with real assessments.
              </p>
            </div>
            <Link to="/courses" className="mt-4 md:mt-0 text-sm font-semibold text-brand hover:underline flex items-center">
              View all courses <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Card key={course._id} className="flex flex-col justify-between" hover>
                  <div>
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="mint">{course.category}</Badge>
                      <span className="text-xs font-semibold text-brand-muted">{course.level}</span>
                    </div>
                    <h3 className="text-base font-bold text-brand-dark mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-brand-muted line-clamp-2 mb-4">
                      {course.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                    <div>
                      <p className="text-sm font-extrabold text-brand-dark">
                        {course.price === 0 ? 'Free' : `₹${course.price}`}
                      </p>
                      <p className="text-[10px] text-brand-muted">{course.duration} Hours · Certificate Included</p>
                    </div>
                    <Link to={`/courses/${course._id}`}>
                      <Button variant="outline" size="sm">
                        View Course
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-brand-muted text-sm">
                Loading courses...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Freelance Opportunities */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge variant="blue" className="mb-2">Earn While Studying</Badge>
              <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">
                Live Freelance Gigs
              </h2>
              <p className="text-sm text-brand-muted mt-1">
                Real projects posted by clients looking for verified student talent.
              </p>
            </div>
            <Link to="/projects" className="mt-4 md:mt-0 text-sm font-semibold text-brand hover:underline flex items-center">
              Explore all gigs <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.map((proj) => (
                <Card key={proj._id} className="flex flex-col justify-between" hover>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="emerald">{proj.category}</Badge>
                      <span className="text-xs font-bold text-emerald-700">
                        ₹{proj.budgetMin.toLocaleString()} - ₹{proj.budgetMax.toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-brand-dark mb-2 line-clamp-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-brand-muted line-clamp-3 mb-4">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {proj.requiredSkills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-border flex items-center justify-between">
                    <span className="text-[11px] text-brand-muted">
                      {proj.proposalCount || 0} Proposals submitted
                    </span>
                    <Link to={`/projects/${proj._id}`}>
                      <Button variant="primary" size="sm">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-brand-muted text-sm">
                Loading opportunities...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust & Verification Banner */}
      <section className="py-12 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/20 border border-brand-accent text-brand-accent flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Have a mintGig Certificate Identifier?</h3>
                <p className="text-xs text-gray-300">
                  Verify genuine completion, score, and issue date using our public verification portal.
                </p>
              </div>
            </div>
            <Link to="/verify-certificate/MINT-DEMO-001">
              <Button variant="mint" size="md">
                Try Sample Verification
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-brand-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-brand-dark">Frequently Asked Questions</h2>
            <p className="text-xs text-brand-muted mt-2">
              Everything you need to know about the mintGig platform.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-brand-border p-4 transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-brand-dark"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-muted transform transition-transform ${
                      faqOpen === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {faqOpen === index && (
                  <p className="mt-3 text-xs text-brand-muted leading-relaxed border-t border-brand-border/60 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-white border-t border-brand-border text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-3xl font-extrabold text-brand-dark">
            Ready to build your proof-of-work portfolio?
          </h2>
          <p className="text-sm text-brand-muted max-w-xl mx-auto">
            Join hundreds of motivated college students acquiring high-demand skills and landing real client gigs.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Create Free Account
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" size="lg">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
