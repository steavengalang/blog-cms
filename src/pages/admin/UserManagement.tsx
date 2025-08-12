import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import type { User } from '../../types';

interface UserManagementProps {
  className?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ className = '' }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [_selectedUsers, _setSelectedUsers] = useState<string[]>([]);
  const [_showAddUser, _setShowAddUser] = useState(false);
  const [_editingUser, _setEditingUser] = useState<User | null>(null);
  const [_error, _setError] = useState<string | null>(null);

  // Mock data - replace with Supabase calls
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'admin',
        status: 'active',
        createdAt: new Date('2024-01-01T00:00:00Z')
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        role: 'editor',
        status: 'active',
        createdAt: new Date('2024-01-05T00:00:00Z')
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'viewer',
        status: 'active',
        createdAt: new Date('2024-01-10T00:00:00Z')
      }
    ];

    setUsers(mockUsers);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Remove unused functions

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      // Update in Supabase
      // await supabase
      //   .from('users')
      //   .update({ role: newRole })
      //   .eq('id', userId);

      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      // Update in Supabase
      // await supabase
      //   .from('users')
      //   .update({ status: newStatus })
      //   .eq('id', userId);

      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      // Delete from Supabase
      // await supabase
      //   .from('users')
      //   .delete()
      //   .eq('id', userId);

      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-20 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage blog users, roles, and permissions
          </p>
        </div>
        <Button
          onClick={() => _setShowAddUser(true)}
          variant="primary"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-32"
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="author">Author</option>
            <option value="subscriber">Subscriber</option>
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-32"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                      size={32}
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="author">Author</option>
                      <option value="subscriber">Subscriber</option>
                    </Select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                      size={32}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </Select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{user.role}</div>
                      <div>{user.status}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => _setEditingUser(user)}
                      >
                        <PencilIcon className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="xs"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <TrashIcon className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || roleFilter || statusFilter
                ? 'Try adjusting your search or filter criteria.'
                : 'Users will appear here once they are added.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
