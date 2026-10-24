import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, TextArea } from '../../components/common/Input';
import api from '../../api/client';
import { PlusCircle, Trash2, AlertCircle } from 'lucide-react';

export const AdminNewCourse = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('mintGig Faculty');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Beginner');
  const [duration, setDuration] = useState('10');
  const [price, setPrice] = useState('0');
  const [skillTags, setSkillTags] = useState('React, JavaScript, Web');

  // Lessons list
  const [lessons, setLessons] = useState([
    { title: 'Lesson 1: Core Fundamentals', content: 'Comprehensive overview of core fundamentals and architecture.', duration: 30, order: 1, isFree: true },
    { title: 'Lesson 2: Advanced Concepts & Project', content: 'In-depth implementation of hands-on practice projects.', duration: 45, order: 2, isFree: true },
  ]);

  // Quiz questions
  const [quizQuestions, setQuizQuestions] = useState([
    {
      question: 'What is the primary objective of this course topic?',
      options: ['Building production-grade web solutions', 'Memorizing syntax without practice', 'Ignoring responsive standards', 'None of the above'],
      correctIndex: 0,
    },
    {
      question: 'Which of the following describes best security practice?',
      options: ['Hardcoding secrets in git', 'Using HTTP-only cookies and bcrypt password hashing', 'Disabling CORS protection', 'Skipping validation'],
      correctIndex: 1,
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addLesson = () => {
    setLessons([
      ...lessons,
      {
        title: `Lesson ${lessons.length + 1}: Practical Application`,
        content: 'Detailed lesson explanations and guided coding instructions.',
        duration: 30,
        order: lessons.length + 1,
        isFree: true,
      },
    ]);
  };

  const removeLesson = (idx) => {
    setLessons(lessons.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !shortDescription) {
      setError('Title and short description are required');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const tags = skillTags.split(',').map(s => s.trim()).filter(Boolean);

      const coursePayload = {
        title: title.trim(),
        slug: generatedSlug,
        shortDescription: shortDescription.trim(),
        description: description.trim() || shortDescription.trim(),
        instructor: instructor.trim(),
        category,
        level,
        duration: Number(duration),
        price: Number(price),
        skillTags: tags,
        status: 'published',
        certificateEligible: true,
        completionThreshold: 75,
        lessons,
        quiz: {
          title: `${title} Certification Assessment`,
          passingScore: 70,
          questions: quizQuestions,
        },
      };

      const res = await api.post('/courses/admin', coursePayload);
      if (res.success) {
        navigate('/admin/courses');
      }
    } catch (err) {
      setError(err.message || 'Course creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Create New Course">
      <div className="max-w-4xl space-y-6">
        <p className="text-xs text-brand-muted">
          Define curriculum, lessons, and assessment questions.
        </p>

        <Card className="p-8 bg-white">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200 mb-4 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Course Title"
              required
              placeholder="e.g. Next.js 14 & Full-Stack TypeScript"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Course Slug (URL identifier)"
                placeholder="e.g. nextjs-fullstack-typescript"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <Input
                label="Instructor Name"
                required
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-brand-border rounded-lg"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Design">Design</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Difficulty</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-brand-border rounded-lg"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <Input
                label="Price (INR ₹ - 0 for Free)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <TextArea
              label="Short Description"
              required
              rows={2}
              placeholder="Catchy summary for catalog cards..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />

            <TextArea
              label="Full Description"
              rows={4}
              placeholder="Comprehensive curriculum breakdown and prerequisites..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Input
              label="Skill Tags (comma separated)"
              placeholder="Next.js, TypeScript, Tailwind, API"
              value={skillTags}
              onChange={(e) => setSkillTags(e.target.value)}
            />

            {/* Lesson Builder */}
            <div className="pt-4 border-t border-brand-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-brand-dark">Curriculum Lessons ({lessons.length})</h3>
                <Button variant="outline" size="sm" onClick={addLesson} type="button">
                  Add Lesson
                </Button>
              </div>

              <div className="space-y-3">
                {lessons.map((lesson, idx) => (
                  <div key={idx} className="p-4 bg-brand-bg rounded-xl border border-brand-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-dark">Lesson {idx + 1}</span>
                      {lessons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLesson(idx)}
                          className="text-rose-600 text-xs hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <Input
                      placeholder="Lesson title"
                      value={lesson.title}
                      onChange={(e) => {
                        const copy = [...lessons];
                        copy[idx].title = e.target.value;
                        setLessons(copy);
                      }}
                    />
                    <TextArea
                      rows={2}
                      placeholder="Lesson content"
                      value={lesson.content}
                      onChange={(e) => {
                        const copy = [...lessons];
                        copy[idx].content = e.target.value;
                        setLessons(copy);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-brand-border">
              <Button type="submit" variant="primary" size="lg" loading={submitting}>
                Publish Course to Catalog
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminNewCourse;
