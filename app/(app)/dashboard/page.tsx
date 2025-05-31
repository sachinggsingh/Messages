'use client'
import {Message} from '@/app/models/User';
import { AcceptMessageSchema } from '@/app/schemas/acceptMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner'
import MessageCard from '@/components/Message';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import { ApiResponse } from '@/types/apiResponse';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: true
    }
  });

  const { watch, setValue } = form;
  const acceptMessage = watch('acceptMessages');

  const handleDeleteMessage = (messageID: string) => {
    setMessages(messages.filter((message) => message._id !== messageID));
  };

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>('/api/get-messages');
      if (response.data.success && response.data.messages) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      toast.error('Failed to fetch messages');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAcceptMessages = async (checked: boolean) => {
    try {
      setIsSwitchLoading(true);
      const response = await axios.post<ApiResponse>('/api/accept-message', {
        acceptMessage: checked
      });
      if (response.data.success) {
        setValue('acceptMessages', checked);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update message acceptance status');
      console.log(error)
    } finally {
      setIsSwitchLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
    }
  }, [session?.user, fetchMessages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg mt-22">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome {session?.user.username}</h1>
              <p className="text-gray-400">Manage your messages and preferences here</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg">
              <Switch
                checked={acceptMessage}
                onCheckedChange={handleAcceptMessages}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-blue-600"
              />
              <span className="text-white font-medium">
                {acceptMessage ? 'Accepting Messages' : 'Not Accepting Messages'}
              </span>
              {isSwitchLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-6">Your Messages</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-white">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 bg-gray-700 rounded-lg">
              <p className="text-gray-400 text-lg">No messages yet</p>
              <p className="text-gray-500 mt-2">Share your profile link to start receiving messages!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
