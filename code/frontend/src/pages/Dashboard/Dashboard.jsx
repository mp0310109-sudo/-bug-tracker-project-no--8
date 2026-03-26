import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Ticket,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  Activity,
  Users,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Badge, Avatar } from '../../components/ui';
import api from '../../app/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/tickets/stats/dashboard');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: FolderKanban,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/20',
      textColor: 'text-indigo-400',
      shadowColor: 'shadow-indigo-500/30',
    },
    {
      title: 'Total Tickets',
      value: stats?.totalTickets || 0,
      icon: Ticket,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      shadowColor: 'shadow-blue-500/30',
    },
    {
      title: 'In Progress',
      value: stats?.ticketsByStatus?.InProgress || 0,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/20',
      textColor: 'text-amber-400',
      shadowColor: 'shadow-amber-500/30',
    },
    {
      title: 'Completed',
      value: stats?.ticketsByStatus?.Done || 0,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/20',
      textColor: 'text-emerald-400',
      shadowColor: 'shadow-emerald-500/30',
    },
  ];

  const priorityColors = {
    Low: 'low',
    Medium: 'medium',
    High: 'high',
    Critical: 'critical',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gradient flex items-center gap-3"
          >
            <Sparkles className="w-8 h-8 text-indigo-400" />
            Welcome back, {user?.name}!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 mt-2 flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Here's what's happening with your projects
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/projects">
            <Button icon={Plus} className="btn-primary shadow-lg shadow-indigo-500/30">
              New Project
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group"
          >
            <Card className={`card-enhanced p-6 relative overflow-hidden ${stat.shadowColor} hover:shadow-2xl transition-all duration-300`}>
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-slate-500 group-hover:text-slate-400 transition-colors"
                  >
                    <TrendingUp className="w-5 h-5" />
                  </motion.div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                    className={`text-3xl font-bold ${stat.textColor}`}
                  >
                    {stat.value}
                  </motion.p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tickets by Status */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="card-enhanced">
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                Tickets by Status
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { status: 'Todo', count: stats?.ticketsByStatus?.Todo || 0, color: 'from-slate-500 to-slate-600', icon: AlertCircle },
                { status: 'In Progress', count: stats?.ticketsByStatus?.InProgress || 0, color: 'from-blue-500 to-indigo-500', icon: Clock },
                { status: 'Done', count: stats?.ticketsByStatus?.Done || 0, color: 'from-emerald-500 to-green-500', icon: CheckCircle2 },
              ].map((item, index) => (
                <motion.div
                  key={item.status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="flex-1 text-slate-300">{item.status}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((item.count / (stats?.totalTickets || 1)) * 100, 100)}%` }}
                        transition={{ delay: 0.9 + index * 0.1, duration: 0.8 }}
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                      />
                    </div>
                    <span className={`text-lg font-bold text-gradient`}>
                      {item.count}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Tickets by Priority */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="card-enhanced">
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                Tickets by Priority
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {['Low', 'Medium', 'High', 'Critical'].map((priority, index) => (
                <motion.div
                  key={priority}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <Badge variant={priorityColors[priority]} size="sm" className="badge-enhanced">
                    {priority}
                  </Badge>
                  <span className="flex-1 text-slate-300">{priority}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((stats?.ticketsByPriority?.[priority] || 0) / (stats?.totalTickets || 1) * 100, 100)}%` }}
                        transition={{ delay: 0.9 + index * 0.1, duration: 0.8 }}
                        className={`h-full priority-${priority.toLowerCase()} rounded-full`}
                      />
                    </div>
                    <span className="text-lg font-bold text-gradient">
                      {stats?.ticketsByPriority?.[priority] || 0}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Tickets */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="card-enhanced">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-cyan-400" />
              Recently Updated Tickets
            </h2>
            <Link to="/projects">
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" className="hover:text-indigo-400">
                View All
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-slate-700/50">
            {stats?.recentTickets?.length > 0 ? (
              stats.recentTickets.map((ticket, index) => (
                <motion.div
                key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                  className="px-6 py-4 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant={priorityColors[ticket.priority]} size="sm" className="badge-enhanced">
                        {ticket.priority}
                      </Badge>
                      <div>
                        <p className="text-slate-100 font-medium hover:text-indigo-400 transition-colors">
                          {ticket.title}
                        </p>
                        <p className="text-sm text-slate-400 flex items-center gap-2">
                          <FolderKanban className="w-3 h-3" />
                          {ticket.projectId?.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {ticket.assignee && (
                        <Avatar
                          name={ticket.assignee.name}
                          size="sm"
                          className="avatar-enhanced"
                        />
                      )}
                      <Badge
                        variant={
                          ticket.status === 'Done'
                            ? 'done'
                            : ticket.status === 'InProgress'
                            ? 'inprogress'
                            : 'todo'
                        }
                        size="sm"
                        className="badge-enhanced"
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 py-12 text-center"
              >
                <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No recent tickets</p>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;