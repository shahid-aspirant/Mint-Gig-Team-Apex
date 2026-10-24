import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import api from '../../api/client';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Award,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

export const CoursePlayer = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourseData = async () => {
    try {
      const res = await api.get(`/courses/${courseId}/learn`);
      if (res.success && res.data) {
        setCourse(res.data.course);
        setEnrollment(res.data.enrollment);
      }
    } catch (err) {
      setError(err.message || 'Failed to load course player');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const handleMarkComplete = async (lessonId) => {
    setMarkingComplete(true);
    try {
      const res = await api.post(`/courses/${courseId}/lessons/${lessonId}/complete`);
      if (res.success && res.data) {
        setEnrollment(res.data.enrollment);
        // Move to next lesson if available
        if (activeLessonIndex < (course.lessons?.length || 1) - 1) {
          setActiveLessonIndex(activeLessonIndex + 1);
        }
      }
    } catch (err) {
      alert(err.message || 'Error marking lesson complete');
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleQuizAnswer = (questionIndex, optionIndex) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = async () => {
    const questionsCount = course?.quiz?.questions?.length || 0;
    const answeredCount = Object.keys(quizAnswers).length;

    if (answeredCount < questionsCount) {
      alert(`Please answer all ${questionsCount} questions before submitting.`);
      return;
    }

    // Prepare answers array ordered by question index
    const answersArray = [];
    for (let i = 0; i < questionsCount; i++) {
      answersArray.push(quizAnswers[i]);
    }

    setSubmittingQuiz(true);
    try {
      const res = await api.post(`/courses/${courseId}/quiz/submit`, {
        answers: answersArray,
      });

      if (res.success && res.data) {
        setQuizResult(res.data);
        await fetchCourseData(); // reload fresh enrollment & certificate status
      }
    } catch (err) {
      alert(err.message || 'Quiz submission failed');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Course Player">
        <div className="text-center py-24">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-brand-muted">Loading learning materials...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout title="Course Player">
        <Card className="p-12 text-center max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-brand-dark">Cannot Access Course</h3>
          <p className="text-xs text-brand-muted mt-1 mb-4">{error || 'Course not found'}</p>
          <Link to="/student/courses">
            <Button variant="outline" size="sm">Back to My Courses</Button>
          </Link>
        </Card>
      </DashboardLayout>
    );
  }

  const lessons = course.lessons || [];
  const currentLesson = lessons[activeLessonIndex] || lessons[0];
  const isCurrentLessonCompleted = enrollment?.completedLessons?.includes(currentLesson?._id);
  const thresholdMet = (enrollment?.progressPercent || 0) >= (course.completionThreshold || 75);

  return (
    <DashboardLayout title={course.title}>
      {/* Top Banner with Progress */}
      <div className="bg-white rounded-xl border border-brand-border p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-brand-dark">Course Progress:</span>
            <span className="text-xs font-extrabold text-brand">{enrollment?.progressPercent || 0}%</span>
            {enrollment?.status === 'completed' && (
              <Badge variant="emerald">Completed 🎓</Badge>
            )}
          </div>
          <div className="w-64 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand h-full rounded-full transition-all duration-300"
              style={{ width: `${enrollment?.progressPercent || 0}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {enrollment?.certificateIssued && (
            <Link to="/student/certificates">
              <Button variant="mint" size="sm">
                <Award className="w-4 h-4 mr-1.5" />
                <span>View Certificate</span>
              </Button>
            </Link>
          )}
          <Link to="/student/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Lesson Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-brand-border p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-3">
              Lessons & Assessment
            </h3>

            <div className="space-y-1.5">
              {lessons.map((lesson, idx) => {
                const isCompleted = enrollment?.completedLessons?.includes(lesson._id);
                const isActive = !quizMode && activeLessonIndex === idx;

                return (
                  <button
                    key={lesson._id || idx}
                    onClick={() => {
                      setQuizMode(false);
                      setActiveLessonIndex(idx);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-colors ${
                      isActive
                        ? 'bg-brand text-white font-bold'
                        : 'hover:bg-gray-50 text-brand-text'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isActive
                            ? 'bg-white text-brand'
                            : isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span className="truncate">{lesson.title}</span>
                    </div>
                    <span
                      className={`text-[10px] ml-2 ${
                        isActive ? 'text-gray-200' : 'text-brand-muted'
                      }`}
                    >
                      {lesson.duration}m
                    </span>
                  </button>
                );
              })}

              {/* Quiz Link */}
              {course.quiz && (
                <button
                  onClick={() => setQuizMode(true)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-colors mt-3 border ${
                    quizMode
                      ? 'bg-brand text-white font-bold border-brand'
                      : thresholdMet
                      ? 'bg-brand-accentLight/50 text-brand-dark border-brand/30 hover:bg-brand-accentLight'
                      : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                  disabled={!thresholdMet}
                >
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Certification Assessment</span>
                  </div>
                  {enrollment?.quizPassed ? (
                    <Badge variant="emerald">Passed ({enrollment.quizScore}%)</Badge>
                  ) : thresholdMet ? (
                    <Badge variant="mint">Ready</Badge>
                  ) : (
                    <span className="text-[10px] text-gray-400">
                      Need {course.completionThreshold}%
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8">
          {quizMode ? (
            /* QUIZ / ASSESSMENT VIEW */
            <Card className="p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                <div>
                  <h2 className="text-xl font-bold text-brand-dark">
                    {course.quiz?.title || 'Certification Assessment'}
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Passing score required: <strong className="text-brand-dark">{course.quiz?.passingScore || 70}%</strong>
                  </p>
                </div>
                <Badge variant="mint">Server Graded</Badge>
              </div>

              {quizResult ? (
                /* QUIZ RESULT BANNER */
                <div
                  className={`p-6 rounded-2xl border text-center space-y-4 ${
                    quizResult.passed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-white shadow-sm">
                    {quizResult.passed ? (
                      <Sparkles className="w-8 h-8 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-rose-600" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold">
                      {quizResult.passed ? 'Congratulations! You Passed! 🎓' : 'Assessment Not Passed Yet'}
                    </h3>
                    <p className="text-xs mt-1">
                      You scored <strong className="text-base">{quizResult.score}%</strong> ({quizResult.correct} of {quizResult.total} questions correct).
                    </p>
                  </div>

                  {quizResult.passed ? (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs">
                        Your verified completion has been recorded and your certificate has been issued. Your portfolio has also been updated automatically.
                      </p>
                      <Link to="/student/certificates">
                        <Button variant="primary" size="md">
                          View My Certificate & Portfolio
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <p className="text-xs mb-3">
                        Review the lessons and try the quiz again to meet the passing threshold.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setQuizResult(null)}>
                        Retake Assessment
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                /* QUIZ QUESTIONS FORM */
                <div className="space-y-6">
                  {(course.quiz?.questions || []).map((q, qIndex) => (
                    <div key={qIndex} className="p-4 rounded-xl bg-brand-bg border border-brand-border space-y-3">
                      <p className="text-xs font-bold text-brand-dark">
                        Question {qIndex + 1}: {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((option, optIndex) => (
                          <label
                            key={optIndex}
                            className={`flex items-center space-x-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                              quizAnswers[qIndex] === optIndex
                                ? 'bg-white border-brand text-brand font-semibold shadow-sm'
                                : 'bg-white/60 border-brand-border/60 hover:bg-white text-brand-text'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${qIndex}`}
                              checked={quizAnswers[qIndex] === optIndex}
                              onChange={() => handleQuizAnswer(qIndex, optIndex)}
                              className="text-brand focus:ring-brand"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                    <span className="text-xs text-brand-muted">
                      {Object.keys(quizAnswers).length} of {course.quiz?.questions?.length || 0} answered
                    </span>
                    <Button
                      variant="primary"
                      size="lg"
                      loading={submittingQuiz}
                      onClick={handleSubmitQuiz}
                    >
                      Submit Assessment
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            /* LESSON VIEWER */
            <Card className="p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                    Lesson {activeLessonIndex + 1} of {lessons.length}
                  </span>
                  <h2 className="text-xl font-bold text-brand-dark mt-1">
                    {currentLesson?.title}
                  </h2>
                </div>
                <div className="flex items-center space-x-2 text-xs text-brand-muted">
                  <Clock className="w-4 h-4" />
                  <span>{currentLesson?.duration} mins</span>
                </div>
              </div>

              {/* Lesson Text / Video Content */}
              <div className="prose max-w-none text-xs text-brand-text leading-relaxed space-y-4">
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700 bg-brand-bg p-5 rounded-xl border border-brand-border">
                  {currentLesson?.content || 'Lesson content is available for review.'}
                </p>
              </div>

              {/* Mark Complete CTA */}
              <div className="pt-6 border-t border-brand-border flex items-center justify-between">
                <div>
                  {isCurrentLessonCompleted ? (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Lesson marked complete</span>
                    </span>
                  ) : (
                    <span className="text-xs text-brand-muted">
                      Mark complete to track your course progress.
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {!isCurrentLessonCompleted && (
                    <Button
                      variant="primary"
                      size="md"
                      loading={markingComplete}
                      onClick={() => handleMarkComplete(currentLesson?._id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      <span>Complete & Next</span>
                    </Button>
                  )}
                  {activeLessonIndex < lessons.length - 1 && (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setActiveLessonIndex(activeLessonIndex + 1)}
                    >
                      Next Lesson
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoursePlayer;
