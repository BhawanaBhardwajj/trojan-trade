import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface MessageDialogProps {
  sellerId: string;
  sellerName: string;
  listingId: string;
  listingTitle: string;
  triggerButton?: React.ReactNode;
}

export const MessageDialog = ({ 
  sellerId, 
  sellerName, 
  listingId, 
  listingTitle,
  triggerButton 
}: MessageDialogProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to send messages');
      return;
    }

    setSending(true);
    try {
      // Check if conversation already exists
      let query = supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId);

      if (listingId) {
        query = query.eq('listing_id', listingId);
      } else {
        query = query.is('listing_id', null);
      }

      const { data: existingConvo } = await query.single();

      let conversationId = existingConvo?.id;

      // Create new conversation if none exists
      if (!conversationId) {
        const { data: newConvo, error: convoError } = await supabase
          .from('conversations')
          .insert({
            buyer_id: user.id,
            seller_id: sellerId,
            listing_id: listingId || null
          })
          .select()
          .single();

        if (convoError) throw convoError;
        conversationId = newConvo.id;
      }

      // Send the message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: message.trim()
        });

      if (messageError) throw messageError;

      toast.success('Message sent successfully!');
      setMessage('');
      setOpen(false);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. ' + (error.message || ''));
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button size="sm" className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message Seller
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Message {sellerName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {listingId && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">About listing:</p>
              <p className="text-sm text-muted-foreground">{listingTitle}</p>
            </div>
          )}
          <div>
            <label htmlFor="message" className="text-sm font-medium mb-2 block">
              Your Message
            </label>
            <Textarea
              id="message"
              placeholder="Hi, I'm interested in this item..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {message.length}/1000 characters
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSend} 
              disabled={sending || !message.trim()} 
              className="flex-1"
            >
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
