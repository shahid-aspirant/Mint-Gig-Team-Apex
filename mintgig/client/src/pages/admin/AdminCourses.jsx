import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import api from '../../api/client';
import { BookOpen, PlusCircle, ExternalLink } from 'lucide-react';

export const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/admin/all');
      if (res.success && res.data) {
        setCourses(res.data.courses || []);
      }
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleStatus = async (course) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      const res = await api.put(`/courses/admin/${course._id}`, { status: nextStatus });
      if (res.success) {
        await fetchCourses();
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  return (
    <DashboardLayout title="Course Catalog Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-muted">
            Manage course curriculum, publication status, and pricing.
          </p>
          <Link to="/admin/courses/new">
            <Button variant="primary" size="sm" className="flex items-center space-x-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>Create New Course</span>
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg border-b border-brand-border text-brand-muted font-bold">
                <tr>
                  <th className="p-3.5">Course Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Lessons</th>
                  <th className="p-3.5">Enrollments</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {courses.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/60">
                    <td className="p-3.5 font-bold text-brand-dark">
                      <div>{c.title}</div>
                      <span className="text-[10px] text-brand-muted font-normal">
                        Instructor: {c.instructor}
                      </span>
                    </td>
                    <td className="p-3.5 text-brand-muted">{c.category}</td>
                    <td className="p-3.5 font-bold text-brand-dark">
                      {c.price === 0 ? 'Free' : `₹${c.price}`}
                    </td>
                    <td className="p-3.5 text-brand-muted">
                      {c.lessons?.length || 0} Lessons
                    </td>
                    <td className="p-3.5 font-bold text-brand-dark">
                      {c.enrollmentCount || 0}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={c.status === 'published' ? 'emerald' : 'gray'}>
                        {c.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => toggleStatus(c)}
                        className="text-xs font-semibold text-brand hover:underline"
                      >
                        {c.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link
                        to={`/courses/${c._id}`}
                        target="_blank"
                        className="text-xs font-semibold text-gray-500 hover:text-brand-dark"
                      >
                        Preview
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCourses;
