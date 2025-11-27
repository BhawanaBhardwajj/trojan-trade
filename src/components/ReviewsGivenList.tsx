import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewed_user_id: string;
  reviewed_user: {
    full_name: string;
    avatar_url: string | null;
    usc_verified: boolean;
  };
}

interface ReviewsGivenListProps {
  reviewerId: string;
}

export const ReviewsGivenList = ({ reviewerId }: ReviewsGivenListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            reviewed_user_id,
            reviewed_user:reviewed_user_id (
              full_name,
              avatar_url,
              usc_verified
            )
          `)
          .eq('reviewer_id', reviewerId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match our Review interface
        const transformedReviews = data?.map((review: any) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          reviewed_user_id: review.reviewed_user_id,
          reviewed_user: Array.isArray(review.reviewed_user) ? review.reviewed_user[0] : review.reviewed_user,
        })) || [];

        setReviews(transformedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [reviewerId]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">You haven't written any reviews yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-muted-foreground">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar 
                  className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => navigate(`/u/${review.reviewed_user_id}`)}
                >
                  <AvatarImage src={review.reviewed_user.avatar_url || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {review.reviewed_user.full_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-xs text-muted-foreground mr-2">Review for</span>
                      <button
                        onClick={() => navigate(`/u/${review.reviewed_user_id}`)}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {review.reviewed_user.full_name}
                      </button>
                      {review.reviewed_user.usc_verified && (
                        <span className="text-xs text-primary ml-2">✓ Verified</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(review.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
