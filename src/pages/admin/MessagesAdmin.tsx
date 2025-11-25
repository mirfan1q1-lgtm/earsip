import { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Message } from '../../types/database';

export function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setMessages(data);
    }
  };

  const handleMarkAsRead = async (message: Message) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', message.id);

      if (error) throw error;

      setSelectedMessage({ ...message, is_read: true });
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
      alert('Failed to update message');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }

      fetchMessages();
      setSuccess('Message deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      handleMarkAsRead(message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        {unreadCount > 0 && (
          <div className="badge badge-primary badge-lg">
            {unreadCount} unread
          </div>
        )}
      </div>

      {success && (
        <div className="alert alert-success mb-6">
          <span>{success}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="overflow-auto max-h-[70vh]">
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-base-content/50">
                    No messages yet.
                  </div>
                ) : (
                  <ul className="menu">
                    {messages.map((message) => (
                      <li key={message.id}>
                        <button
                          onClick={() => handleSelectMessage(message)}
                          className={`flex items-start gap-3 p-4 ${
                            selectedMessage?.id === message.id ? 'active' : ''
                          } ${!message.is_read ? 'font-bold' : ''}`}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {message.is_read ? (
                              <MailOpen size={20} className="text-base-content/50" />
                            ) : (
                              <Mail size={20} className="text-primary" />
                            )}
                          </div>
                          <div className="flex-1 text-left overflow-hidden">
                            <div className="font-semibold truncate">{message.name}</div>
                            <div className="text-sm text-base-content/70 truncate">
                              {message.subject}
                            </div>
                            <div className="text-xs text-base-content/50 mt-1">
                              {formatDate(message.created_at)}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="card-title text-2xl mb-2">{selectedMessage.subject}</h2>
                    <div className="text-sm text-base-content/70">
                      From: <span className="font-semibold">{selectedMessage.name}</span>
                    </div>
                    <div className="text-sm text-base-content/70">
                      Email:{' '}
                      <a href={`mailto:${selectedMessage.email}`} className="link">
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div className="text-xs text-base-content/50 mt-2">
                      {formatDate(selectedMessage.created_at)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="btn btn-sm btn-error btn-outline gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>

                <div className="divider"></div>

                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="divider"></div>

                <div className="flex gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="btn btn-primary"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body flex items-center justify-center h-96">
                <Mail size={64} className="text-base-content/20 mb-4" />
                <p className="text-base-content/50">Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
