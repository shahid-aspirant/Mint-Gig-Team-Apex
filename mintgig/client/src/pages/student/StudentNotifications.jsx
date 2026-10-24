import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useNotifications } from '../../context/NotificationContext';
import {
  Bell,
  Award,
  BookOpen,
  Briefcase,
  MessageSquare,
  CheckCircle2,
  Check,
} from 'lucide-react';

export const StudentNotifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'certificate_issued':
      case 'course_complete':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'proposal_accepted':
      case 'proposal_received':
      case 'proposal_rejected':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-brand" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-muted">
            You have {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}.
          </p>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="w-3.5 h-3.5 mr-1" />
              <span>Mark All as Read</span>
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card className="p-12 text-center max-w-md mx-auto">
            <Bell className="w-10 h-10 text-brand-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-brand-dark">No notifications yet</h3>
            <p className="text-xs text-brand-muted mt-1">
              Course completions, certificate announcements, and proposal updates will appear here.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && markAsRead(n._id)}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                  n.isRead
                    ? 'bg-white border-brand-border text-brand-text'
                    : 'bg-emerald-50/50 border-emerald-200 shadow-xs'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-white border border-brand-border/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-brand-dark">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-brand" />
                      )}
                    </div>
                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-2 block">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {n.link && (
                  <Link to={n.link} className="flex-shrink-0">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentNotifications;
