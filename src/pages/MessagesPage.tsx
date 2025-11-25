import { useState, useEffect } from 'react';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const MessagesPage = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchConversations = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data: convos, error } = await supabase
          .from('conversations')
          .select('*')
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });
        if (error) throw error;
        setConversations(convos || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketplaceHeader />
      <main className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <h1 className="text-4xl font-bold text-primary mb-6">Messages</h1>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : conversations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
              <p className="text-muted-foreground mb-4">Start messaging sellers to see your conversations here</p>
              <Button onClick={() => navigate('/')}>Browse Listings</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Messages feature will be available soon</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;