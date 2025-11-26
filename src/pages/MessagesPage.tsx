import { useState, useEffect, useRef } from 'react';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  listing?: {
    title: string;
    price: number;
    photos: string[];
  };
  otherUser?: {
    full_name: string;
    avatar_url: string | null;
    usc_verified: boolean;
  };
  lastMessage?: string;
  lastMessageTime?: string;
  messages: Message[];
}

const MessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConvo?.messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch all conversations for the user
        const { data: convos, error } = await supabase
          .from('conversations')
          .select('*')
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        // Fetch listing and user details for each conversation
        const enrichedConvos = await Promise.all(
          (convos || []).map(async (convo) => {
            // Get listing details
            const { data: listing } = await supabase
              .from('listings')
              .select('title, price, photos')
              .eq('id', convo.listing_id)
              .single();

            // Get other user details
            const otherUserId = convo.buyer_id === user.id ? convo.seller_id : convo.buyer_id;
            const { data: otherUser } = await supabase
              .from('users')
              .select('full_name, avatar_url, usc_verified')
              .eq('id', otherUserId)
              .single();

            // Get messages for this conversation
            const { data: msgs } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', convo.id)
              .order('created_at', { ascending: true });

            const messages = (msgs || []).map(m => ({
              id: m.id,
              text: m.content,
              senderId: m.sender_id,
              timestamp: new Date(m.created_at || '').toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            }));

            const lastMsg = messages[messages.length - 1];

            return {
              ...convo,
              listing,
              otherUser,
              messages,
              lastMessage: lastMsg?.text || 'No messages yet',
              lastMessageTime: lastMsg?.timestamp || 'Just now'
            };
          })
        );

        setConversations(enrichedConvos);
        if (enrichedConvos.length > 0) {
          setSelectedConvo(enrichedConvos[0]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (!user || !selectedConvo) return;

    // Set up real-time subscription for messages
    const channel = supabase
      .channel(`conversation-${selectedConvo.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConvo.id}`
        },
        (payload: any) => {
          const newMsg = {
            id: payload.new.id,
            text: payload.new.content,
            senderId: payload.new.sender_id,
            timestamp: new Date(payload.new.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          };

          setSelectedConvo(prev => {
            if (!prev) return null;

            // Remove any temp message with same text from same sender (optimistic update)
            const withoutTemp = prev.messages.filter(m =>
              !(m.id.toString().startsWith('temp-') && m.senderId === newMsg.senderId && m.text === newMsg.text)
            );

            // Check if real message already exists
            if (withoutTemp.some(m => m.id === newMsg.id)) return prev;

            return {
              ...prev,
              messages: [...withoutTemp, newMsg],
              lastMessage: newMsg.text,
              lastMessageTime: newMsg.timestamp
            };
          });

          setConversations(prev => prev.map(c => {
            if (c.id !== selectedConvo.id) return c;

            // Remove any temp message with same text from same sender
            const withoutTemp = c.messages.filter(m =>
              !(m.id.toString().startsWith('temp-') && m.senderId === newMsg.senderId && m.text === newMsg.text)
            );

            // Check if real message already exists
            if (withoutTemp.some(m => m.id === newMsg.id)) return c;

            return {
              ...c,
              lastMessage: newMsg.text,
              lastMessageTime: newMsg.timestamp,
              messages: [...withoutTemp, newMsg]
            };
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConvo?.id, user]);

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConvo || !user) return;

    const text = messageText.trim();
    const tempId = `temp-${Date.now()}`;

    // Optimistic UI update
    const optimisticMessage = {
      id: tempId,
      text: text,
      senderId: user.id,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    // Update selected conversation
    setSelectedConvo(prev => prev ? {
      ...prev,
      messages: [...prev.messages, optimisticMessage],
      lastMessage: text,
      lastMessageTime: optimisticMessage.timestamp
    } : null);

    // Update conversations list
    setConversations(prev => prev.map(c =>
      c.id === selectedConvo.id ? {
        ...c,
        messages: [...c.messages, optimisticMessage],
        lastMessage: text,
        lastMessageTime: optimisticMessage.timestamp
      } : c
    ));

    setMessageText('');
    setSending(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConvo.id,
          sender_id: user.id,
          content: text
        });

      if (error) throw error;

      // Message will be updated by real-time subscription with actual ID
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setSelectedConvo(prev => prev ? {
        ...prev,
        messages: prev.messages.filter(m => m.id !== tempId)
      } : null);
      setConversations(prev => prev.map(c =>
        c.id === selectedConvo.id ? {
          ...c,
          messages: c.messages.filter(m => m.id !== tempId)
        } : c
      ));
      setMessageText(text); // Restore message text
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSelectConvo = (convo: Conversation) => {
    setSelectedConvo(convo);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--usc-beige))] flex flex-col">
      <MarketplaceHeader />

      <main className="container mx-auto px-4 py-6 flex-1 flex flex-col overflow-hidden">
        <h1 className="text-4xl font-heading font-bold text-[hsl(var(--usc-cardinal))] mb-6">
          Messages
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--usc-cardinal))]" />
          </div>
        ) : conversations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
              <p className="text-muted-foreground mb-4">Start messaging sellers to see your conversations here</p>
              <Button onClick={() => navigate('/')} className="bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90">
                Browse Listings
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0 bg-white rounded-lg overflow-hidden shadow-lg border border-border">
            {/* Left Pane - Inbox List */}
            <div className="border-r border-border flex flex-col h-full max-h-[calc(100vh-280px)]">
              <div className="p-4 bg-muted/50 font-semibold border-b flex-shrink-0">
                Conversations
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((convo) => (
                  <div
                    key={convo.id}
                    className={`p-4 border-b border-border hover:bg-muted/50 transition-colors ${
                      selectedConvo?.id === convo.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={convo.listing?.photos[0] || '/placeholder.svg'}
                        alt={convo.listing?.title}
                        className="w-12 h-12 object-cover rounded flex-shrink-0 cursor-pointer"
                        onClick={() => handleSelectConvo(convo)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <button
                            onClick={() => {
                              const otherUserId = convo.buyer_id === user?.id
                                ? convo.seller_id
                                : convo.buyer_id;
                              navigate(`/u/${otherUserId}`);
                            }}
                            className="font-semibold text-sm flex items-center gap-1 hover:text-[hsl(var(--usc-cardinal))] transition-colors"
                          >
                            {convo.otherUser?.full_name}
                            {convo.otherUser?.usc_verified && (
                              <Check className="h-3 w-3 text-green-600 bg-green-100 rounded-full p-0.5 flex-shrink-0" />
                            )}
                          </button>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {convo.lastMessageTime}
                          </span>
                        </div>
                        <p
                          className="text-sm text-muted-foreground truncate mb-1 cursor-pointer"
                          onClick={() => handleSelectConvo(convo)}
                        >
                          {convo.listing?.title}
                        </p>
                        <p
                          className="text-sm truncate cursor-pointer"
                          onClick={() => handleSelectConvo(convo)}
                        >
                          {convo.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Pane - Thread View */}
            <div className="col-span-2 flex flex-col h-full max-h-[calc(100vh-280px)]">
              {selectedConvo ? (
                <>
                  {/* Thread Header - Fixed */}
                  <div className="p-4 border-b border-border bg-muted/50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const otherUserId = selectedConvo.buyer_id === user?.id
                            ? selectedConvo.seller_id
                            : selectedConvo.buyer_id;
                          navigate(`/u/${otherUserId}`);
                        }}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage
                            src={selectedConvo.otherUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConvo.otherUser?.full_name}`}
                          />
                          <AvatarFallback>
                            {selectedConvo.otherUser?.full_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold truncate">
                              {selectedConvo.otherUser?.full_name}
                            </span>
                            {selectedConvo.otherUser?.usc_verified && (
                              <Check className="h-4 w-4 text-green-600 bg-green-100 rounded-full p-0.5 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {selectedConvo.listing?.title} •{' '}
                            <span className="font-semibold text-[hsl(var(--usc-cardinal))]">
                              ${selectedConvo.listing?.price}
                            </span>
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Messages - Scrollable */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[hsl(var(--usc-beige))]/30">
                    {selectedConvo.messages.length === 0 ? (
                      <div className="flex justify-center items-center h-full text-muted-foreground">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      <>
                        {selectedConvo.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.senderId === user?.id
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                msg.senderId === user?.id
                                  ? 'bg-[hsl(var(--usc-cardinal))] text-white'
                                  : 'bg-white border border-border'
                              }`}
                            >
                              <p className="text-sm break-words">{msg.text}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.senderId === user?.id
                                    ? 'text-white/70'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {msg.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Input - Fixed at bottom */}
                  <div className="p-4 border-t-2 border-border bg-white flex-shrink-0">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && !sending && handleSendMessage()
                        }
                        disabled={sending}
                        className="border-2 flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={sending || !messageText.trim()}
                        className="bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90 px-6"
                      >
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p>Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;