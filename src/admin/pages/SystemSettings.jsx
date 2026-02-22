import React, { useState, useEffect } from 'react';
import { getSettings, updateSetting, resetSettings } from '../services/adminApi';
import toast from 'react-hot-toast';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = ['general', 'mail', 'spam', 'security', 'notifications'];

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await getSettings(activeTab);
      setSettings(res.data.data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [activeTab]);

  const handleSave = async (key, value) => {
    try {
      await updateSetting({ key, value, category: activeTab });
      toast.success('Setting saved');
      fetchSettings();
    } catch (error) {
      toast.error('Save failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">System Settings</h1>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`py-2 px-4 whitespace-nowrap border-b-2 font-medium text-sm transition-colors ${
              activeTab === cat
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
        {loading ? (
          <p className="text-gray-500">Loading settings...</p>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 italic">
               Settings for {activeTab} category. (Example keys shown below if empty)
            </p>
            
            {/* Example Setting Inputs - In a real app, these would be dynamic based on defined schema or config */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Mode</label>
                    <select 
                        className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        onChange={(e) => handleSave('maintenance_mode', e.target.value)}
                        defaultValue={settings.find(s => s.key === 'maintenance_mode')?.value || 'false'}
                    >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                </div>
                 <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">System Email</label>
                    <input 
                        type="email" 
                        className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="admin@example.com"
                        onBlur={(e) => handleSave('system_email', e.target.value)}
                        defaultValue={settings.find(s => s.key === 'system_email')?.value || ''}
                    />
                </div>
            </div>

            {settings.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                    No custom settings found for this category. Defaults are active.
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;
