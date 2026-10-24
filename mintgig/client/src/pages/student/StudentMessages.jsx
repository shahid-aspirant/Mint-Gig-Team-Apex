import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { MessageSquare, Send, User, Clock, AlertCircle } from 'lucide-react';

export const StudentMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations');
      if (res.success && res.data) {
        setConversations(res.data.conversations || []);
        if (!activeConv && res.data.conversations?.length > 0) {
          fetchConversationDetails(res.data.conversations[0]._id);
        }
      }
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (id) => {
    try {
      const res = await api.get(`/conversations/${id}`);
      if (res.success && res.data) {
        setActiveConv(res.data.conversation);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(() => {
      if (activeConv?._id) {
        fetchConversationDetails(activeConv._id);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeConv?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConv) return;

    setSending(true);
    try {
      const res = await api.post(`/conversations/${activeConv._id}/messages`, {
        content: messageText.trim(),
      });
      if (res.success && res.data) {
        setActiveConv(res.data.conversation);
        setMessageText('');
        fetchConversations();
      }
    } catch (err) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getRecipient = (conv) => {
    return conv?.participants?.find((p) => String(p._id) !== String(user?._id)) || { name: 'Client' };
  };

  return (
    <DashboardLayout title="Project Messages">
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden h-[calc(100vh-210px)] flex flex-col md:flex-row">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r border-brand-border flex flex-col h-full bg-brand-bg/50">
          <div className="p-4 border-b border-brand-border bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Conversations ({conversations.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-brand-border/60">
            {conversations.length === 0 ? (
              <p className="p-6 text-center text-xs text-brand-muted">
                No active conversations yet. Conversations begin when a client accepts your proposal.
              </p>
            ) : (
              conversations.map((c) => {
                const recipient = getRecipient(c);
                const isSelected = activeConv?._id === c._id;

                return (
                  <button
                    key={c._id}
                    onClick={() => fetchConversationDetails(c._id)}
                    className={`w-full text-left p-4 transition-colors flex items-start space-x-3 ${
                      isSelected ? 'bg-white border-l-4 border-l-brand' : 'hover:bg-white/70'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-brand-accentLight text-brand-dark font-bold text-xs flex items-center justify-center border border-brand/20 flex-shrink-0">
                      {recipient?.name?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-brand-dark truncate">
                          {recipient?.name}
                        </span>
                        <span className="text-[10px] text-brand-muted">
                          {new Date(c.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-brand truncate mb-0.5">
                        {c.project?.title}
                      </p>
                      <p className="text-[11px] text-brand-muted truncate">
                        {c.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message Thread View */}
        <div className="flex-1 flex flex-col h-full bg-white">
          {activeConv ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-brand-accentLight text-brand-dark font-bold text-xs flex items-center justify-center border border-brand/20">
                    {getRecipient(activeConv)?.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-dark">
                      {getRecipient(activeConv)?.name}
                    </h4>
                    <p className="text-[10px] text-brand-muted">
                      Project: {activeConv.project?.title}
                    </p>
                  </div>
                </div>
                <Badge variant="mint">Active Chat</Badge>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {activeConv.messages?.length === 0 ? (
                  <p className="text-center text-xs text-brand-muted py-10">
                    No messages yet. Send a message to start communicating!
                  </p>
                ) : (
                  activeConv.messages.map((msg, i) => {
                    const isMe = String(msg.sender?._id || msg.sender) === String(user?._id);

                    return (
                      <div
                        key={i}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-brand text-white rounded-br-xs'
                              : 'bg-brand-bg text-brand-text border border-brand-border rounded-bl-xs'
                          }`}
                        >
                          <p>{msg.content}</p>
                        </div>
                        <span className="text-[9px] text-brand-muted mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-brand-border flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-brand-bg border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
                <Button type="submit" variant="primary" size="sm" loading={sending}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Send</span>
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="w-10 h-10 text-brand-muted opacity-30 mb-2" />
              <p className="text-xs font-bold text-brand-dark">Select a conversation</p>
              <p className="text-[11px] text-brand-muted">
                Choose a conversation from the sidebar to view message history.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentMessages;
