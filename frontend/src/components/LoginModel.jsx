import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { X } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSuccess = async (credentialResponse) => {
    try {
      await login(credentialResponse.credential);
      toast.success('Welcome to Janki Jewellery!');
      onClose();
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const handleError = () => {
    toast.error('Login failed. Please try again.');
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      data-testid="login-modal"
    >
      <div 
        className="bg-white p-8 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
            Sign In
          </h2>
          <button 
            onClick={onClose} 
            className="text-stone-400 hover:text-stone-900 transition-colors"
            data-testid="btn-close-modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-stone-600 mb-8">
          Sign in with your Google account to like products and leave feedback.
        </p>
        <div className="flex justify-center" data-testid="google-login-container">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signin_with"
          />
        </div>
      </div>
    </div>
  );
}
