import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import ConfirmModal from '../components/ConfirmModal';
import { getUsers, blockUser, unblockUser, updateUserRole, deleteUser } from '../services/adminApi';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', role: '', status: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null); // 'block', 'unblock', 'delete', 'role'

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers(filters);
      setUsers(res.data.data.items);
      setPagination(res.data.data.pagination);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleAction = async () => {
    try {
      if (actionType === 'block') await blockUser(selectedUser._id);
      if (actionType === 'unblock') await unblockUser(selectedUser._id);
      if (actionType === 'delete') await deleteUser(selectedUser._id);
      if (actionType === 'promote') await updateUserRole(selectedUser._id, 'admin');
      if (actionType === 'demote') await updateUserRole(selectedUser._id, 'user');

      toast.success('Action successful');
      fetchUsers();
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setModalOpen(false);
    }
  };

  const columns = [
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', render: (u) => <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : u.role === 'superadmin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>{u.role}</span> },
    { header: 'Status', render: (u) => <span className={`px-2 py-1 rounded text-xs ${u.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span> },
    { header: 'Actions', render: (u) => (
      <div className="flex space-x-2">
        {u.role !== 'superadmin' && (
          <>
            {u.role === 'admin' ? (
              <button onClick={(e) => { e.stopPropagation(); setSelectedUser(u); setActionType('demote'); setModalOpen(true); }} className="text-purple-600 hover:text-purple-800 text-sm font-medium">Demote</button>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); setSelectedUser(u); setActionType('promote'); setModalOpen(true); }} className="text-purple-600 hover:text-purple-800 text-sm font-medium">Promote</button>
            )}
            {u.isBlocked ? (
               <button onClick={(e) => { e.stopPropagation(); setSelectedUser(u); setActionType('unblock'); setModalOpen(true); }} className="text-green-600 hover:text-green-800 text-sm font-medium">Unblock</button>
            ) : (
               <button onClick={(e) => { e.stopPropagation(); setSelectedUser(u); setActionType('block'); setModalOpen(true); }} className="text-orange-600 hover:text-orange-800 text-sm font-medium">Block</button>
            )}
            <button onClick={(e) => { e.stopPropagation(); setSelectedUser(u); setActionType('delete'); setModalOpen(true); }} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
          </>
        )}
      </div>
    )}
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">User Management</h1>
      <FilterBar 
        onSearch={(val) => setFilters({...filters, search: val, page: 1})}
        onFilterChange={(key, val) => setFilters({...filters, [key]: val, page: 1})}
        filterOptions={[
          { key: 'role', label: 'All Roles', options: [{ value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }] },
          { key: 'status', label: 'All Status', options: [{ value: 'active', label: 'Active' }, { value: 'blocked', label: 'Blocked' }] }
        ]}
      />
      <DataTable 
        columns={columns} 
        data={users} 
        pagination={pagination} 
        onPageChange={(p) => setFilters({...filters, page: p})}
        isLoading={loading}
      />
      <ConfirmModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={handleAction}
        title="Confirm Action"
        message={`Are you sure you want to ${actionType} this user?`}
        isDestructive={['block', 'delete'].includes(actionType)}
      />
    </div>
  );
};

export default UserManagement;
