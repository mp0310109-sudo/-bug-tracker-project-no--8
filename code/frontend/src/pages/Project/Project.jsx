import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  MessageSquare,
  Paperclip,
  ArrowLeft,
  Settings,
  Users,
  Sparkles,
  Zap,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Badge, Avatar, Modal, Input, Select, Textarea } from '../../components/ui';
import api from '../../app/api';
import toast from 'react-hot-toast';

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState({ Todo: [], InProgress: [], Done: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchTickets();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      if (response.data.success) {
        setProject(response.data.project);
      }
    } catch (error) {
      toast.error('Failed to fetch project');
      navigate('/projects');
    }
  };

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterPriority) params.append('priority', filterPriority);
      if (filterAssignee) params.append('assignee', filterAssignee);

      const response = await api.get(`/tickets/project/${id}?${params}`);
      if (response.data.success) {
        const grouped = {
          Todo: [],
          InProgress: [],
          Done: [],
        };
        response.data.tickets.forEach((ticket) => {
          if (grouped[ticket.status]) {
            grouped[ticket.status].push(ticket);
          }
        });
        setTickets(grouped);
      }
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchTickets();
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, filterPriority, filterAssignee]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;

    // Optimistic update
    const newTickets = { ...tickets };
    const [movedTicket] = newTickets[source.droppableId].splice(source.index, 1);
    movedTicket.status = newStatus;
    newTickets[newStatus].splice(destination.index, 0, movedTicket);
    setTickets(newTickets);

    try {
      await api.put(`/tickets/${draggableId}/status`, {
        status: newStatus,
        order: destination.index,
      });
    } catch (error) {
      // Revert on error
      fetchTickets();
      toast.error('Failed to update ticket status');
    }
  };

  const columns = [
    { id: 'Todo', title: 'To Do', color: 'from-slate-500 to-slate-600', icon: '📋' },
    { id: 'InProgress', title: 'In Progress', color: 'from-blue-500 to-indigo-500', icon: '⚡' },
    { id: 'Done', title: 'Done', color: 'from-emerald-500 to-green-500', icon: '✅' },
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
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate('/projects')}
              className="hover:text-indigo-400"
            />
          </motion.div>
          <div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gradient flex items-center gap-3"
            >
              <Sparkles className="w-6 h-6 text-indigo-400" />
              {project?.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 text-sm mt-1"
            >
              {project?.description}
            </motion.p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2"
        >
          <Button variant="outline" size="sm" icon={Users} className="btn-secondary">
            Team
          </Button>
          <Button variant="outline" size="sm" icon={Settings} className="btn-secondary">
            Settings
          </Button>
          <Button 
            icon={Plus} 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary shadow-lg shadow-indigo-500/30"
          >
            New Ticket
          </Button>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center gap-4"
      >
        <div className="flex-1 min-w-[200px] max-w-md">
          <Input
            placeholder="Search tickets..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-enhanced"
          />
        </div>
        <Select
          placeholder="Priority"
          options={[
            { value: '', label: 'All Priorities' },
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
            { value: 'Critical', label: 'Critical' },
          ]}
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="w-40 input-enhanced"
        />
      </motion.div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
          {columns.map((column, columnIndex) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + columnIndex * 0.1 }}
              className="flex flex-col"
            >
              {/* Column Header */}
              <div className={`flex items-center gap-3 mb-4 pb-3 border-b-2 border-gradient-to-r ${column.color}`}>
                <span className="text-2xl">{column.icon}</span>
                <h2 className="font-semibold text-slate-200 flex-1">{column.title}</h2>
                <Badge variant="todo" size="sm" className="badge-enhanced">
                  {tickets[column.id]?.length || 0}
                </Badge>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[300px] p-3 rounded-xl transition-all duration-300 kanban-column ${
                      snapshot.isDraggingOver
                        ? 'drag-over bg-indigo-500/10 border-2 border-dashed border-indigo-500/50'
                        : 'bg-slate-800/30 border-2 border-transparent'
                    }`}
                  >
                    <AnimatePresence>
                      {tickets[column.id]?.map((ticket, index) => (
                        <Draggable
                          key={ticket.id}
                          draggableId={ticket.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -2, scale: 1.02 }}
                                className={`mb-3 ${
                                  snapshot.isDragging ? 'rotate-2 scale-105' : ''
                                }`}
                              >
                                <Card
                                  hover
                                  className={`ticket-card p-4 cursor-pointer relative overflow-hidden ${
                                    snapshot.isDragging ? 'dragging shadow-2xl' : ''
                                  }`}
                                  onClick={() => {
                                    setSelectedTicket(ticket);
                                    setShowTicketModal(true);
                                  }}
                                >
                                  {/* Priority Indicator */}
                                  <div className={`absolute top-0 left-0 w-1 h-full priority-${ticket.priority?.toLowerCase()}`} />
                                  
                                  <div className="pl-3">
                                    <div className="flex items-start justify-between mb-2">
                                      <Badge
                                        variant={priorityColors[ticket.priority]}
                                        size="sm"
                                        className="badge-enhanced"
                                      >
                                        {ticket.priority}
                                      </Badge>
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-slate-400 hover:text-slate-200 transition-colors"
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </motion.button>
                                    </div>

                                    <h3 className="text-slate-100 font-medium mb-2 line-clamp-2">
                                      {ticket.title}
                                    </h3>

                                    {ticket.description && (
                                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                                        {ticket.description}
                                      </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                                        {ticket.commentCount > 0 && (
                                          <span className="flex items-center gap-1">
                                            <MessageSquare className="w-4 h-4" />
                                            {ticket.commentCount}
                                          </span>
                                        )}
                                        {ticket.attachments?.length > 0 && (
                                          <span className="flex items-center gap-1">
                                            <Paperclip className="w-4 h-4" />
                                            {ticket.attachments.length}
                                          </span>
                                        )}
                                      </div>
                                      {ticket.assignee && (
                                        <Avatar
                                          name={ticket.assignee.name}
                                          size="sm"
                                          className="avatar-enhanced"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              </motion.div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                    
                    {/* Empty State */}
                    {(!tickets[column.id] || tickets[column.id].length === 0) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-8 text-center"
                      >
                        <div className="text-4xl mb-2">{column.icon}</div>
                        <p className="text-slate-500 text-sm">No tickets yet</p>
                      </motion.div>
                    )}
                  </div>
                )}
              </Droppable>
            </motion.div>
          ))}
        </div>
      </DragDropContext>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        projectId={id}
        onSuccess={() => {
          fetchTickets();
          setShowCreateModal(false);
        }}
      />

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          isOpen={showTicketModal}
          onClose={() => {
            setShowTicketModal(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
          project={project}
          onUpdate={() => {
            fetchTickets();
            setSelectedTicket(null);
          }}
        />
      )}
    </div>
  );
};

// Create Ticket Modal Component
const CreateTicketModal = ({ isOpen, onClose, projectId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignee: '',
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      // Ignore error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/tickets', {
        ...formData,
        projectId,
      });

      if (response.data.success) {
        toast.success('Ticket created successfully');
        onSuccess();
        setFormData({ title: '', description: '', priority: 'Medium', assignee: '' });
      }
    } catch (error) {
      toast.error('Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Ticket">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="Enter ticket title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="input-enhanced"
        />

        <Textarea
          label="Description"
          placeholder="Describe the ticket..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="input-enhanced"
        />

        <Select
          label="Priority"
          options={[
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
            { value: 'Critical', label: 'Critical' },
          ]}
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          className="input-enhanced"
        />

        <Select
          label="Assignee"
          placeholder="Select assignee (optional)"
          options={[
            { value: '', label: 'Unassigned' },
            ...users.map((u) => ({ value: u.id, label: u.name })),
          ]}
          value={formData.assignee}
          onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
          className="input-enhanced"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="btn-primary">
            Create Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Ticket Detail Modal Component
const TicketDetailModal = ({ isOpen, onClose, ticket, project, onUpdate }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && ticket) {
      fetchComments();
    }
  }, [isOpen, ticket]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/ticket/${ticket.id}`);
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      // Ignore error
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/comments', {
        ticketId: ticket.id,
        text: newComment,
      });

      if (response.data.success) {
        setComments([response.data.comment, ...comments]);
        setNewComment('');
        toast.success('Comment added');
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    Low: 'low',
    Medium: 'medium',
    High: 'high',
    Critical: 'critical',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={ticket?.title} size="lg">
      <div className="space-y-6">
        {/* Ticket Info */}
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant={priorityColors[ticket?.priority]} className="badge-enhanced">
            {ticket?.priority}
          </Badge>
          <Badge
            variant={
              ticket?.status === 'Done'
                ? 'done'
                : ticket?.status === 'InProgress'
                ? 'inprogress'
                : 'todo'
            }
            className="badge-enhanced"
          >
            {ticket?.status}
          </Badge>
          {ticket?.assignee && (
            <div className="flex items-center gap-2">
              <Avatar name={ticket.assignee.name} size="sm" className="avatar-enhanced" />
              <span className="text-sm text-slate-300">{ticket.assignee.name}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {ticket?.description && (
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">Description</h3>
            <p className="text-slate-200 bg-slate-800/50 rounded-lg p-3">{ticket.description}</p>
          </div>
        )}

        {/* Comments */}
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-4">
            Comments ({comments.length})
          </h3>

          {/* Add Comment */}
          <div className="flex gap-3 mb-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
              className="flex-1 input-enhanced"
            />
            <Button
              onClick={handleAddComment}
              loading={loading}
              disabled={!newComment.trim()}
              className="self-end btn-primary"
            >
              Post
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3"
              >
                <Avatar name={comment.userId?.name} size="sm" className="avatar-enhanced" />
                <div className="flex-1 bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-200">
                      {comment.userId?.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{comment.text}</p>
                </div>
              </motion.div>
            ))}

            {comments.length === 0 && (
              <p className="text-center text-slate-500 py-4">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Project;