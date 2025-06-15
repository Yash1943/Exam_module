import { useEffect, useCallback } from 'react';

export const useExamSecurity = (isExamActive, onViolation) => {
  const handleVisibilityChange = useCallback(() => {
    if (isExamActive && document.hidden) {
      onViolation('Tab switching detected! Exam will be submitted automatically.');
    }
  }, [isExamActive, onViolation]);

  const handleBeforeUnload = useCallback((e) => {
    if (isExamActive) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  }, [isExamActive]);

  const handleContextMenu = useCallback((e) => {
    if (isExamActive) {
      e.preventDefault();
    }
  }, [isExamActive]);

  const handleKeyDown = useCallback((e) => {
    if (isExamActive) {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+C, Ctrl+V, Ctrl+A
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'c') ||
        (e.ctrlKey && e.key === 'v') ||
        (e.ctrlKey && e.key === 'a')
      ) {
        e.preventDefault();
      }
    }
  }, [isExamActive]);

  const handleBlur = useCallback(() => {
    if (isExamActive) {
      onViolation('Window focus lost! Please stay focused on the exam.');
    }
  }, [isExamActive, onViolation]);

  useEffect(() => {
    if (isExamActive) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('blur', handleBlur);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('blur', handleBlur);
      };
    }
  }, [isExamActive, handleVisibilityChange, handleBeforeUnload, handleContextMenu, handleKeyDown, handleBlur]);
};