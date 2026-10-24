import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import api from '../../api/client';
import { Users, Search, Shield, CheckCircle, Ban } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      let query = `/admin/users?`;
      if (roleFilter) query += `role=${roleFilter}&`;
      if (search) query += `search=${encodeURIComponent(search)}&`;

      const res = await api.get(query);
      if (res.success && res.data) {
        setUsers(res.data.users || []);
      }
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const toggleUserStatus = async (user) => {
    try {
      const res = await api.put(`/admin/users/${user._id}`, {
        isActive: !user.isActive,
      });
      if (res.success) {
        await fetchUsers();
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-brand-muted">
            Manage student, client, and admin accounts.
          </p>

          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs bg-white border border-brand-border rounded-lg px-3 py-2"
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="client">Clients</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg border-b border-brand-border text-brand-muted font-bold">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Registered</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/60">
                    <td className="p-3.5 font-bold text-brand-dark">
                      <div>{u.name}</div>
                      {u.username && (
                        <span className="text-[10px] text-brand-muted font-mono font-normal">
                          @{u.username}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-brand-muted">{u.email}</td>
                    <td className="p-3.5">
                      <Badge variant={u.role === 'admin' ? 'rose' : u.role === 'student' ? 'mint' : 'blue'}>
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-brand-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => toggleUserStatus(u)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                            u.isActive
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {u.isActive ? 'Suspend' : 'Reactivate'}
                        </button>
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

export default AdminUsers;
