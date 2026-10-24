import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  AlertCircle,
} from 'lucide-react';

export const CourseDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        if (res.success && res.data) {
          setCourse(res.data.course);
          setEnrolled(res.data.enrolled);
        }
      } catch (_) {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    if (user.role !== 'student') {
      setMessage({ type: 'error', text: 'Only student accounts can enroll in courses.' });
      return;
    }

    if (course.price > 0) {
      setMessage({
        type: 'info',
        text: 'Development Note: Payment processing is not implemented in this MVP. Paid courses cannot be unlocked without real gateway verification.',
      });
      return;
    }

    setEnrolling(true);
    setMessage(null);
    try {
      const res = await api.post(`/courses/${id}/enroll`);
      if (res.success) {
        setEnrolled(true);
        navigate(`/student/learn/${id}`);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-bg">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-bg">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
          <h2 className="text-xl font-bold text-brand-dark">Course Not Found</h2>
          <p className="text-xs text-brand-muted mt-1 mb-4">The requested course does not exist or has been archived.</p>
          <Link to="/courses">
            <Button variant="outline" size="sm">Back to Courses</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-brand-dark text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="mint">{course.category}</Badge>
                <span className="text-xs text-gray-300 font-medium px-2 py-0.5 rounded bg-white/10">
                  {course.level}
                </span>
                <span className="text-xs text-gray-300 font-medium flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-brand-accent inline" />
                  <span>{course.duration} Hours</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {course.title}
              </h1>

              <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
                {course.shortDescription}
              </p>

              <div className="flex items-center space-x-3 pt-2 text-xs text-gray-300">
                <div className="flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-brand-accent" />
                  <span>Instructor: <strong className="text-white">{course.instructor}</strong></span>
                </div>
                <span>·</span>
                <div className="flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-brand-accent" />
                  <span>Verified mintGig Certificate Included</span>
                </div>
              </div>
            </div>

            {/* Quick Action Card in Header for Mobile/Desktop */}
            <div className="lg:col-span-4">
              <div className="bg-white text-brand-text rounded-2xl p-6 shadow-xl border border-brand-border">
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-44 object-cover rounded-xl mb-4"
                  />
                )}
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-2xl font-extrabold text-brand-dark">
                    {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString()}`}
                  </span>
                  {course.price === 0 && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      100% Free Access
                    </span>
                  )}
                </div>

                {message && (
                  <div
                    className={`p-3 rounded-lg text-xs mb-4 ${
                      message.type === 'error'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {enrolled ? (
                  <Link to={`/student/learn/${course._id}`} className="block">
                    <Button variant="primary" className="w-full" size="lg">
                      Resume Learning
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant={course.price > 0 ? 'outline' : 'primary'}
                    className="w-full"
                    size="lg"
                    loading={enrolling}
                    onClick={handleEnroll}
                  >
                    {course.price > 0 ? 'Enroll (₹' + course.price + ')' : 'Enroll for Free'}
                  </Button>
                )}

                <ul className="mt-4 space-y-2 text-xs text-brand-muted border-t border-brand-border pt-4">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-brand" />
                    <span>Self-paced lessons with tracked progress</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-brand" />
                    <span>Graded assessment quiz</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-brand" />
                    <span>Certificate automatically pinned to portfolio</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Overview */}
            <section className="bg-white rounded-xl border border-brand-border p-6">
              <h2 className="text-lg font-bold text-brand-dark mb-3">About this Course</h2>
              <p className="text-xs text-brand-muted leading-relaxed whitespace-pre-line">
                {course.description || course.shortDescription}
              </p>
            </section>

            {/* Learning Objectives */}
            {course.learningObjectives && course.learningObjectives.length > 0 && (
              <section className="bg-white rounded-xl border border-brand-border p-6">
                <h2 className="text-lg font-bold text-brand-dark mb-4">What You Will Learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.learningObjectives.map((obj, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-brand-text">
                      <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Curriculum */}
            <section className="bg-white rounded-xl border border-brand-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-brand-dark">Curriculum Lessons</h2>
                <span className="text-xs text-brand-muted">
                  {course.lessons?.length || 0} Lessons · Assessment Included
                </span>
              </div>

              <div className="divide-y divide-brand-border/60">
                {(course.lessons || []).map((lesson, idx) => (
                  <div key={lesson._id || idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-brand-bg text-brand font-bold text-[11px] flex items-center justify-center border border-brand/20">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-brand-text">{lesson.title}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-brand-muted">
                      <span>{lesson.duration} mins</span>
                      {enrolled ? (
                        <CheckCircle2 className="w-4 h-4 text-brand" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {course.quiz && (
                <div className="mt-4 p-3.5 rounded-xl bg-brand-accentLight/40 border border-brand/20 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Award className="w-5 h-5 text-brand" />
                    <div>
                      <p className="text-xs font-bold text-brand-dark">{course.quiz.title || 'Course Assessment'}</p>
                      <p className="text-[11px] text-brand-muted">
                        Passing criteria: {course.quiz.passingScore || 70}% minimum score
                      </p>
                    </div>
                  </div>
                  <Badge variant="mint">Required for Certificate</Badge>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Skills & Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-brand-border p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                Skills Covered
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(course.skillTags || []).map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-brand-bg text-brand-dark px-2.5 py-1 rounded-md border border-brand-border font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="pt-4 border-t border-brand-border">
                  <h4 className="text-xs font-bold text-brand-dark mb-2">Prerequisites</h4>
                  <ul className="text-xs text-brand-muted space-y-1">
                    {course.prerequisites.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetailsPage;
