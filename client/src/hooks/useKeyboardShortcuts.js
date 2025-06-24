import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent shortcuts when typing in inputs/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      // Modifier keys check (Ctrl/Cmd + Key)
      const ctrlOrCmdPressed = e.ctrlKey || e.metaKey;
      const altPressed = e.altKey;

      // Admin Dashboard
      if (ctrlOrCmdPressed && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'm': navigate('/member-managemnet'); break;                   
          case 'a': navigate('/agenda-management'); break;   
          case 'e': navigate('/event-management'); break;
          case 'u': navigate('/application-user'); break;
          case 'b': navigate('/member-managemnet/create'); break;
          case 'i': navigate('/Inventory/create'); break;
          case 'l': navigate('/transactions/log-activity'); break;
          case 'd': navigate('/documentation'); break;
  
        }
      }

      if (altPressed) {
        switch (e.key) {
          case '1': navigate('/'); break;
          case '2': navigate('/invoice-billing'); break;
          case '3': navigate('/party-management'); break;
          case '4': navigate('/all-transaction'); break;
          case '5': navigate('/Inventory'); break;
          case '6': navigate('/setting'); break;
          case '0': navigate(-1); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
};

export default useKeyboardShortcuts;