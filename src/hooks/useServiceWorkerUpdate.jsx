// src/hooks/useServiceWorkerUpdate.js
import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

const useServiceWorkerUpdate = () => {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');

      wb.addEventListener('waiting', () => {
        setWaitingWorker(wb);
        setIsUpdateAvailable(true);
      });

      wb.register();
    }
  }, []);

  const updateServiceWorker = () => {
    waitingWorker?.messageSkipWaiting();
    setIsUpdateAvailable(false);
    window.location.reload();
  };

  return { isUpdateAvailable, updateServiceWorker };
};

export default useServiceWorkerUpdate;
