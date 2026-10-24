import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import api from '../../api/client';
import { GraduationCap } from 'lucide-react';

export const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get('/admin/enrollments');
        if (res.success && res.data) {
          setEnrollments(res.data.enrollments || []);
        }
      } catch (_) {}
      finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  return (
    <DashboardLayout title="Student Enrollments & Progress">
      <div className="space-y-6">
        <p className="text-xs text-brand-muted">
          All student enrollments and verified course completions.
        </p>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg border-b border-brand-border text-brand-muted font-bold">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Course</th>
                  <th className="p-3.5">Progress</th>
                  <th className="p-3.5">Quiz Score</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {enrollments.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50/60">
                    <td className="p-3.5 font-bold text-brand-dark">
                      <div>{e.student?.name}</div>
                      <span className="text-[10px] text-brand-muted font-normal">
                        @{e.student?.username}
                      </span>
                    </td>
                    <td className="p-3.5 text-brand-text font-medium">{e.course?.title}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-brand-dark">{e.progressPercent || 0}%</span>
                    </td>
                    <td className="p-3.5">
                      {e.quizScore !== null && e.quizScore !== undefined ? (
                        <span className="font-extrabold text-emerald-700">{e.quizScore}%</span>
                      ) : (
                        <span className="text-gray-400">Not taken</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={e.status === 'completed' ? 'emerald' : 'mint'}>
                        {e.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      {e.certificateIssued ? (
                        <span className="text-emerald-700 font-bold text-[11px]">Issued</span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Pending</span>
                      )}
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

export default AdminEnrollments;
