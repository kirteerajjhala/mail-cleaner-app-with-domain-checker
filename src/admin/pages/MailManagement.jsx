import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import ConfirmModal from '../components/ConfirmModal';
import { getMails, deleteMail, deleteBulkMails, getMailStats } from '../services/adminApi';
import toast from 'react-hot-toast';

const MailManagement = () => {
  const [mails, setMails] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10, recipient: '', status: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mailRes, statsRes] = await Promise.all([
        getMails(filters),
        getMailStats()
      ]);
      setMails(mailRes.data.data.items);
      setPagination(mailRes.data.data.pagination);
      setStats(statsRes.data.data);
    } catch (error) {
      toast.error('Failed to load mails');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleDelete = async () => {
    try {
      await deleteMail(selectedId);
      toast.success('Mail deleted');
      fetchData();
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setModalOpen(false);
    }
  };

  const columns = [
    { header: 'Recipient', accessor: 'recipient' },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Status', render: (m) => <span className={`px-2 py-1 rounded text-xs ${m.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{m.status}</span> },
    { header: 'Date', render: (m) => new Date(m.sentAt).toLocaleDateString() },
    { header: 'Actions', render: (m) => (
      <button onClick={() => { setSelectedId(m._id); setModalOpen(true); }} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
    )}
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mail Management</h1>
        <div className="text-sm text-gray-500">
           Total: {stats?.total} | Sent: {stats?.sent} | Failed: {stats?.failed}
        </div>
      </div>
      
      <FilterBar 
        onSearch={(val) => setFilters({...filters, recipient: val, page: 1})}
        onFilterChange={(key, val) => setFilters({...filters, [key]: val, page: 1})}
        filterOptions={[
          { key: 'status', label: 'All Status', options: [{ value: 'sent', label: 'Sent' }, { value: 'failed', label: 'Failed' }] }
        ]}
        placeholder="Search recipient..."
      />
      
      <DataTable 
        columns={columns} 
        data={mails} 
        pagination={pagination} 
        onPageChange={(p) => setFilters({...filters, page: p})}
        isLoading={loading}
      />
      
      <ConfirmModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={handleDelete}
        title="Delete Mail"
        message="Are you sure you want to delete this mail record?"
        isDestructive={true}
      />
    </div>
  );
};

export default MailManagement;
