// components/NetworkToast.jsx
import { useEffect } from 'react';
import { toast } from 'react-toastify';
const apiBaseUrl = import.meta.env.VITE_API_URL;

const NetworkToast = () => {
  useEffect(() => {
    const handleOnline = () => {
      toast.success('✅ You are back online');
    };

    const handleOffline = () => {
      toast.error('⚠️ You are offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show status on load
    if (!navigator.onLine) {
      toast.warn('⚠️ You are currently offline');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
};

export default NetworkToast;
