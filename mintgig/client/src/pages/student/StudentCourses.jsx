import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import api from '../../api/client';
import { BookOpen, Clock, ArrowRight, Award } from 'lucide-react';

export const StudentCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get('/courses/my/enrollments');
        if (res.success) setEnrollments(res.data.enrollments || []);
      } catch (_) {}
      finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  return (
    <DashboardLayout title="My Enrolled Courses">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-muted">
            Track your ongoing lessons, take quizzes, and earn certificates.
          </p>
          <Link to="/courses">
            <Button variant="primary" size="sm">
              Discover More Courses
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-brand-muted">Loading your courses...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <Card className="p-12 text-center max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-brand-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-brand-dark">No courses enrolled yet</h3>
            <p className="text-xs text-brand-muted mt-1 mb-4">
              Browse our catalog of affordable, practical courses to start learning.
            </p>
            <Link to="/courses">
              <Button variant="primary" size="sm">Browse Courses</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enr) => (
              <Card key={enr._id} className="flex flex-col justify-between" hover>
                <div>
                  {enr.course?.thumbnail && (
                    <img
                      src={enr.course.thumbnail}
                      alt={enr.course.title}
                      className="w-full h-36 object-cover rounded-lg mb-3"
                    />
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={enr.status === 'completed' ? 'emerald' : 'mint'}>
                      {enr.status === 'completed' ? 'Completed' : 'Active'}
                    </Badge>
                    <span className="text-[11px] text-brand-muted">{enr.course?.level}</span>
                  </div>
                  <h3 className="text-sm font-bold text-brand-dark mb-1 line-clamp-1">
                    {enr.course?.title}
                  </h3>
                  <p className="text-xs text-brand-muted line-clamp-2 mb-3">
                    Instructor: {enr.course?.instructor}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-brand-dark">
                      <span>Progress</span>
                      <span>{enr.progressPercent || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand h-full rounded-full transition-all duration-300"
                        style={{ width: `${enr.progressPercent || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-border mt-4 flex items-center justify-between">
                  {enr.certificateIssued ? (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 inline" />
                      <span>Certificate Earned</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-brand-muted">
                      Quiz threshold: 75%
                    </span>
                  )}
                  <Link to={`/student/learn/${enr.course?._id}`}>
                    <Button variant="primary" size="sm">
                      {enr.status === 'completed' ? 'Review' : 'Continue'}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCourses;
