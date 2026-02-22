import React, { useEffect, useState } from 'react';
import { getDashboardStats, getDashboardCharts } from '../services/adminApi';
import StatCard from '../components/StatCard';
import ChartWrapper from '../components/ChartWrapper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          getDashboardStats(),
          getDashboardCharts()
        ]);
        setStats(statsRes.data.data);
        setCharts(chartsRes.data.data);
      } catch (error) {
        console.error("Dashboard error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.totalUsers} icon="👥" color="blue" loading={loading} />
        <StatCard title="Total Mails" value={stats?.totalMails} icon="✉️" color="green" loading={loading} />
        <StatCard title="Spam Detected" value={stats?.totalSpam} icon="🚫" color="red" loading={loading} />
        <StatCard title="Support Messages" value={stats?.totalContacts} icon="📞" color="yellow" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="User Growth (Last 7 Days)">
           {charts?.userGrowth ? (
             <LineChart data={charts.userGrowth}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="_id" />
               <YAxis />
               <Tooltip />
               <Legend />
               <Line type="monotone" dataKey="count" stroke="#8884d8" />
             </LineChart>
           ) : <p>Loading chart...</p>}
        </ChartWrapper>
        
        {/* Spam Activity Chart */}
        <ChartWrapper title="System Activity (Spam Logs Last 7 Days)">
           {charts?.spamActivity ? (
             <BarChart data={charts.spamActivity}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="_id" />
               <YAxis />
               <Tooltip />
               <Legend />
               <Bar dataKey="count" fill="#82ca9d" name="Spam Logs" />
             </BarChart>
           ) : <p>Loading activity chart...</p>}
        </ChartWrapper>
      </div>
    </div>
  );
};

export default Dashboard;
