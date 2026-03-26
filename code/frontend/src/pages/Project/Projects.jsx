import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  FolderKanban,
  Users,
  Calendar,
  MoreVertical,
  Trash2,
  Edit,
  Sparkles,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Input, Modal, Textarea, Badge, Avatar } from '../../components/ui';
import api from '../../app/api';
import toast from 'react-hot-toast';

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      const response = await api.delete(`/projects/${selectedProject.id}`);
      if (response.data.success) {
        setProjects(projects.filter((p) => p.id !== selectedProject.id));
        toast.success('Project deleted successfully');
        setShowDeleteModal(false);
        setSelectedProject(null);
      }
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <FolderKanban className="w-8 h-8 text-cyan-400" />
            Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 mt-2 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Manage your projects and track progress
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            icon={Plus} 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary shadow-lg shadow-indigo-500/30"
          >
            New Project
          </Button>
        </motion.div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-md"
      >
        <Input
          placeholder="Search projects..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-enhanced"
        />
      </motion.div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card
                  hover
                  className="card-enhanced h-full cursor-pointer relative overflow-hidden"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30"
                      >
                        <FolderKanban className="w-6 h-6 text-indigo-400" />
                      </motion.div>
                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-slate-500" />
                        {project.ticketCounts?.Todo || 0} To Do
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        {project.ticketCounts?.InProgress || 0} In Progress
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        {project.ticketCounts?.Done || 0} Done
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>
                          {project.ticketCounts?.total > 0
                            ? Math.round((project.ticketCounts?.Done || 0) / project.ticketCounts.total * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${project.ticketCounts?.total > 0
                              ? (project.ticketCounts?.Done || 0) / project.ticketCounts.total * 100
                              : 0}%` 
                          }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.teamMembers?.slice(0, 4).map((member, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 + idx * 0.1 }}
                          >
                            <Avatar
                              name={member.user?.name}
                              size="sm"
                              className="border-2 border-slate-800 avatar-enhanced"
                            />
                          </motion.div>
                        ))}
                        {project.teamMembers?.length > 4 && (
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 border-2 border-slate-800">
                            +{project.teamMembers.length - 4}
                          </div>
                        )}
                      </div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-1 text-indigo-400 text-sm font-medium"
                      >
                        <span>View</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <FolderKanban className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">
            {searchQuery ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-slate-500 mb-6">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Create your first project to get started'}
          </p>
          {!searchQuery && (
            <Button 
              icon={Plus} 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Project
            </Button>
          )}
        </motion.div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newProject) => {
          setProjects([newProject, ...projects]);
          setShowCreateModal(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProject(null);
        }}
        title="Delete Project"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to delete "{selectedProject?.title}"? This action
            cannot be undone and will delete all associated tickets.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedProject(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteProject}>
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Create Project Modal Component
const CreateProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/projects', formData);
      if (response.data.success) {
        toast.success('Project created successfully');
        onSuccess(response.data.project);
        setFormData({ title: '', description: '' });
      }
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Title"
          placeholder="Enter project title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="input-enhanced"
        />

        <Textarea
          label="Description"
          placeholder="Describe your project..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="input-enhanced"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="btn-primary">
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Projects;