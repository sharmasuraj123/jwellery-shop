import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

const BACKEND_URL = import.meta.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function FeedbackSection() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`${API}/feedback`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to leave feedback');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/feedback`, { message });
      await axios.post(`${API}/track/click`, { event_type: 'feedback' });
      toast.success('Thank you for your feedback!');
      setMessage('');
      fetchFeedback();
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-spacing bg-stone-50" data-testid="feedback-section">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 slide-up">
            <span className="uppercase tracking-widest text-xs text-stone-500 font-medium mb-4 block">
              Share Your Experience
            </span>
            <h2 className="text-4xl sm:text-5xl font-semibold text-stone-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Customer Feedback
            </h2>
          </div>

          <div className="bg-white p-8 rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={user ? "Share your thoughts about our collection..." : "Please sign in to leave feedback"}
                  className="w-full px-0 py-4 input-minimal resize-none h-32"
                  disabled={!user || loading}
                  data-testid="feedback-textarea"
                />
              </div>
              <button
                type="submit"
                disabled={!user || loading}
                className="btn-primary bg-stone-900"
                data-testid="btn-submit-feedback"
              >
                <Send className="w-4 h-4 mr-2 inline" />
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-stone-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              What Our Customers Say
            </h3>
            {feedbacks.length === 0 ? (
              <p className="text-stone-500 text-center py-8" data-testid="no-feedback-message">No feedback yet. Be the first to share your experience!</p>
            ) : (
              <div className="space-y-4">
                {feedbacks.map((feedback) => (
                  <div 
                    key={feedback._id} 
                    className="bg-white p-6 border-l-4 border-[#D4AF37] shadow-sm"
                    data-testid={`feedback-${feedback._id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-stone-900">{feedback.user_name}</p>
                      <span className="text-xs text-stone-400">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{feedback.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
