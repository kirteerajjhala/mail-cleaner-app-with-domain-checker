// import React, { useState, useEffect } from 'react';
// import DataTable from '../components/DataTable';
// import FilterBar from '../components/FilterBar';
// import ConfirmModal from '../components/ConfirmModal';
// import { getSpamLogs, deleteSpamLog, flagSpamLog, clearSpamLog, getSpamAnalytics } from '../services/adminApi';
// import toast from 'react-hot-toast';

// const SpamMonitoring = () => {
//   const [logs, setLogs] = useState([]);
//   const [pagination, setPagination] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({ page: 1, limit: 10, source: '', isSpam: '' });
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [actionType, setActionType] = useState(null);

//   const fetchLogs = async () => {
//     setLoading(true);
//     try {
//       const res = await getSpamLogs(filters);
//       setLogs(res.data.data.items);
//       setPagination(res.data.data.pagination);
//     } catch (error) {
//       toast.error('Failed to load spam logs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLogs();
//   }, [filters]);

//   const handleAction = async () => {
//     try {
//       if (actionType === 'delete') await deleteSpamLog(selectedId);
//       if (actionType === 'flag') await flagSpamLog(selectedId);
//       if (actionType === 'clear') await clearSpamLog(selectedId);
//       toast.success('Action successful');
//       fetchLogs();
//     } catch (error) {
//       toast.error('Action failed');
//     } finally {
//       setModalOpen(false);
//     }
//   };

//   const columns = [
//     { header: 'Source', accessor: 'source' },
//     { header: 'Content Preview', render: (l) => l.content ? l.content.substring(0, 50) + '...' : 'N/A' },
//     { header: 'Score', accessor: 'spamScore' },
//     { header: 'Status', render: (l) => <span className={`px-2 py-1 rounded text-xs ${l.isSpam ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{l.isSpam ? 'Spam' : 'Clean'}</span> },
//     { header: 'Detected At', render: (l) => new Date(l.detectedAt).toLocaleString() },
//     { header: 'Actions', render: (l) => (
//       <div className="flex space-x-2">
//         {l.isSpam ? (
//            <button onClick={() => { setSelectedId(l._id); setActionType('clear'); setModalOpen(true); }} className="text-green-600 hover:text-green-800 text-sm">Clear</button>
//         ) : (
//            <button onClick={() => { setSelectedId(l._id); setActionType('flag'); setModalOpen(true); }} className="text-orange-600 hover:text-orange-800 text-sm">Flag</button>
//         )}
//         <button onClick={() => { setSelectedId(l._id); setActionType('delete'); setModalOpen(true); }} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
//       </div>
//     )}
//   ];

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Spam Monitoring</h1>
//       <FilterBar 
//         onSearch={(val) => setFilters({...filters, source: val, page: 1})}
//         onFilterChange={(key, val) => setFilters({...filters, [key]: val, page: 1})}
//         filterOptions={[
//           { key: 'isSpam', label: 'All Status', options: [{ value: 'true', label: 'Spam' }, { value: 'false', label: 'Clean' }] }
//         ]}
//         placeholder="Filter by source..."
//       />
//       <DataTable 
//         columns={columns} 
//         data={logs} 
//         pagination={pagination} 
//         onPageChange={(p) => setFilters({...filters, page: p})}
//         isLoading={loading}
//       />
//       <ConfirmModal 
//         isOpen={modalOpen} 
//         onClose={() => setModalOpen(false)} 
//         onConfirm={handleAction}
//         title="Confirm Action"
//         message={`Are you sure you want to ${actionType} this log?`}
//         isDestructive={actionType === 'delete'}
//       />
//     </div>
//   );
// };

// export default SpamMonitoring;


import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

const SpamMonitoring = () => {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10, email: '', subject: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Get token from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = currentUser?.token;

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:5000/emailRecord/all?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setRecords(data.data);
        setPagination(data.data);
      } else {
        toast.error(data.message || "Failed to fetch records");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRecords();
  }, [filters, token]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/emailRecord/delete/${selectedId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Email record deleted");
        fetchRecords();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setModalOpen(false);
    }
  };

  const columns = [
    { header: 'User', render: (r) => r.user?.username || 'Anonymous' },
    { header: 'Email', accessor: 'email' },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Body', accessor: 'body' },
    { header: 'Type', accessor: 'EmailType' },
    { header: 'Created At', render: (r) => new Date(r.createdAt).toLocaleString() },
    { header: 'Actions', render: (r) => (
      <button 
        onClick={() => { setSelectedId(r._id); setModalOpen(true); }} 
        className="text-red-600 hover:text-red-800 text-sm"
      >
        Delete
      </button>
    )}
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Email Records Monitoring</h1>
      
      {/* <FilterBar 
        onSearch={(val) => setFilters({...filters, email: val, page: 1})}
        onFilterChange={(key, val) => setFilters({...filters, [key]: val, page: 1})}
        filterOptions={[
          { key: 'EmailType', label: 'Type', options: [{ value: 'incoming', label: 'Incoming' }, { value: 'outgoing', label: 'Outgoing' }] }
        ]}
        placeholder="Search by email..."
      /> */}

      <DataTable 
        columns={columns} 
        data={records || []} 
        pagination={pagination} 
        onPageChange={(p) => setFilters({...filters, page: p})}
        isLoading={loading}
      />

      <ConfirmModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={handleDelete}
        title="Delete Email Record"
        message="Are you sure you want to delete this email record?"
        isDestructive={true}
      />
    </div>
  );
};

export default SpamMonitoring;