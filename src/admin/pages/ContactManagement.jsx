// import React, { useState, useEffect } from 'react';
// import DataTable from '../components/DataTable';
// import FilterBar from '../components/FilterBar';
// import ConfirmModal from '../components/ConfirmModal';
// import { getContacts, updateContactStatus, deleteContact, replyContact } from '../services/adminApi';
// import toast from 'react-hot-toast';

// const ContactManagement = () => {
//   const [contacts, setContacts] = useState([]);
//   const [pagination, setPagination] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', status: '' });
//   const [modalOpen, setModalOpen] = useState(false);
//   const [replyModalOpen, setReplyModalOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [replyText, setReplyText] = useState('');

//   const fetchContacts = async () => {
//     setLoading(true);
//     try {
//       const res = await getContacts(filters);
//       setContacts(res.data.data.items);
//       setPagination(res.data.data.pagination);
//     } catch (error) {
//       toast.error('Failed to load contacts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, [filters]);

//   const handleDelete = async () => {
//     try {
//       await deleteContact(selectedId);
//       toast.success('Contact deleted');
//       fetchContacts();
//     } catch (error) {
//       toast.error('Delete failed');
//     } finally {
//       setModalOpen(false);
//     }
//   };

//   const handleReply = async () => {
//     try {
//       await replyContact(selectedId, replyText);
//       toast.success('Reply sent');
//       fetchContacts();
//     } catch (error) {
//       toast.error('Reply failed');
//     } finally {
//       setReplyModalOpen(false);
//       setReplyText('');
//     }
//   };

//   const handleStatusChange = async (id, status) => {
//       try {
//           await updateContactStatus(id, status);
//           toast.success('Status updated');
//           fetchContacts();
//       } catch (error) {
//           toast.error('Update failed');
//       }
//   };

//   const columns = [
//     { header: 'Name', accessor: 'name' },
//     { header: 'Subject', accessor: 'subject' },
//     { header: 'Status', render: (c) => (
//         <select 
//             value={c.status} 
//             onChange={(e) => handleStatusChange(c._id, e.target.value)}
//             className={`px-2 py-1 rounded text-xs border-none focus:ring-0 ${c.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
//         >
//             <option value="new">New</option>
//             <option value="in_progress">In Progress</option>
//             <option value="resolved">Resolved</option>
//             <option value="closed">Closed</option>
//         </select>
//     )},
//     { header: 'Date', render: (c) => new Date(c.createdAt).toLocaleDateString() },
//     { header: 'Actions', render: (c) => (
//       <div className="flex space-x-2">
//         <button onClick={() => { setSelectedId(c._id); setReplyModalOpen(true); }} className="text-blue-600 hover:text-blue-800 text-sm">Reply</button>
//         <button onClick={() => { setSelectedId(c._id); setModalOpen(true); }} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
//       </div>
//     )}
//   ];

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Contact Management</h1>
//       <FilterBar 
//         onSearch={(val) => setFilters({...filters, search: val, page: 1})}
//         onFilterChange={(key, val) => setFilters({...filters, [key]: val, page: 1})}
//         filterOptions={[
//           { key: 'status', label: 'All Status', options: [{ value: 'new', label: 'New' }, { value: 'resolved', label: 'Resolved' }] }
//         ]}
//       />
//       <DataTable 
//         columns={columns} 
//         data={contacts} 
//         pagination={pagination} 
//         onPageChange={(p) => setFilters({...filters, page: p})}
//         isLoading={loading}
//       />
      
//       <ConfirmModal 
//         isOpen={modalOpen} 
//         onClose={() => setModalOpen(false)} 
//         onConfirm={handleDelete}
//         title="Delete Contact"
//         message="Are you sure you want to delete this message?"
//         isDestructive={true}
//       />

//       {replyModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-xl">
//                 <h3 className="text-lg font-bold mb-4">Reply to Message</h3>
//                 <textarea 
//                     className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:text-white"
//                     rows="4"
//                     placeholder="Type your reply..."
//                     value={replyText}
//                     onChange={(e) => setReplyText(e.target.value)}
//                 ></textarea>
//                 <div className="flex justify-end space-x-2">
//                     <button onClick={() => setReplyModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
//                     <button onClick={handleReply} className="px-4 py-2 bg-blue-600 text-white rounded">Send Reply</button>
//                 </div>
//             </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContactManagement;




import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [searchText, setSearchText] = useState('');

  // Fetch contacts from backend
  const fetchContacts = useCallback(async (search = '') => {
    setLoading(true);
    try {
      const query = search ? `?search=${search}` : '';
      const res = await fetch(`http://localhost:5000/contact/getAllContact${query}`);
      const data = await res.json();
      if (data.success) {
        setContacts(data.data); // backend returns array
      } else {
        toast.error("Failed to load contacts");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while fetching contacts");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Search handler
  const handleSearch = (val) => {
    setSearchText(val);
    fetchContacts(val);
  };

  // Delete contact
  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:5000/contact/${selectedId}`, { method: "DELETE" });
      toast.success('Contact deleted');
      fetchContacts(searchText);
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setModalOpen(false);
      setSelectedId(null);
    }
  };

  // Reply to contact
  const handleReply = async () => {
    try {
      const res = await fetch(`http://localhost:5000/contact/reply/${selectedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Reply sent');
        fetchContacts(searchText);
      } else {
        toast.error('Reply failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Reply failed');
    } finally {
      setReplyModalOpen(false);
      setReplyText('');
      setSelectedId(null);
    }
  };

  const columns = [
    { header: 'Email', accessor: 'email' },
    { header: 'Message', accessor: 'message' },
    { header: 'Date', render: (c) => new Date(c.createdAt).toLocaleString() },
    {
      header: 'Actions',
      render: (c) => (
        <div className="flex space-x-2">
          <button
            onClick={() => { setSelectedId(c._id); setReplyModalOpen(true); }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Reply
          </button>
          <button
            onClick={() => { setSelectedId(c._id); setModalOpen(true); }}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Contact Management</h1>

      <FilterBar onSearch={handleSearch} value={searchText} />

      <DataTable
        columns={columns}
        data={contacts}
        isLoading={loading}
      />

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Contact"
        message="Are you sure you want to delete this message?"
        isDestructive={true}
      />

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-bold mb-4">Reply to Message</h3>
            <textarea
              className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:text-white"
              rows="4"
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setReplyModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleReply} className="px-4 py-2 bg-blue-600 text-white rounded">Send Reply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;