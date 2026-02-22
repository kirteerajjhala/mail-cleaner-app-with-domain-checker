import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import ConfirmModal from '../components/ConfirmModal';
import { getSecurityLogs, clearSecurityLogs, getSecuritySummary } from '../services/adminApi';
import toast from 'react-hot-toast';

const SecurityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: '', action: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [summary, setSummary] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const [logRes, sumRes] = await Promise.all([
        getSecurityLogs(filters),
        getSecuritySummary()
      ]);
      setLogs(logRes.data.data.items);
      setPagination(logRes.data.data.pagination);
      setSummary(sumRes.data.data);
    } catch (error) {
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const handleClear = async () => {
    try {
      // Clear logs older than 30 days by default or prompt for date
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      await clearSecurityLogs(thirtyDaysAgo);
      toast.success('Old logs cleared');
      fetchLogs();
    } catch (error) {
      toast.error('Clear failed');
    } finally {
      setModalOpen(false);
    }
  };

  const columns = [
    { header: 'Action', accessor: 'action' },
    { header: 'Performed By', render: (l) => l.performedBy?.email || 'System' },
    { header: 'Target User', render: (l) => l.targetUser?.email || '-' },
    { header: 'IP Address', accessor: 'ipAddress' },
    { header: 'Status', render: (l) => <span className={`px-2 py-1 rounded text-xs ${l.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{l.status}</span> },
    { header: 'Details', accessor: 'details' },
    { header: 'Date', render: (l) => new Date(l.createdAt).toLocaleString() },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Security Logs</h1>
        <div className="flex space-x-4 items-center">
            <span className="text-sm text-gray-500">Total: {summary?.total} | Failures: {summary?.failures}</span>
            <button 
            onClick={() => setModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
            >
            Clear Old Logs
            </button>
        </div>
      </div>

      <FilterBar 
        onSearch={(val) => setFilters({...filters, action: val, page: 1})}
        onFilterChange={(key, val) => setFilters({...filters, [key]: val, page: 1})}
        filterOptions={[
          { key: 'status', label: 'All Status', options: [{ value: 'success', label: 'Success' }, { value: 'failure', label: 'Failure' }] }
        ]}
        placeholder="Filter by action..."
      />

      <DataTable 
        columns={columns} 
        data={logs} 
        pagination={pagination} 
        onPageChange={(p) => setFilters({...filters, page: p})}
        isLoading={loading}
      />

      <ConfirmModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={handleClear}
        title="Clear Old Logs"
        message="This will delete security logs older than 30 days. This action cannot be undone."
        isDestructive={true}
      />
    </div>
  );
};

export default SecurityLogs;
