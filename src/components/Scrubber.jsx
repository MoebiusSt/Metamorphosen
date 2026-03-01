import { useRef, useCallback } from 'react';

export default function Scrubber({ currentTime, duration, onSeek }) {
  const barRef = useRef(null);
  const dragging = useRef(false);

  const getTimeFromEvent = useCallback((e) => {
    const bar = barRef.current;
    if (!bar || !duration) return 0;
    const rect = bar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (x / rect.width) * duration;
  }, [duration]);

  const handlePointerDown = useCallback((e) => {
    dragging.current = true;
    onSeek(getTimeFromEvent(e));

    const handlePointerMove = (moveE) => {
      if (dragging.current) {
        onSeek(getTimeFromEvent(moveE));
      }
    };

    const handlePointerUp = () => {
      dragging.current = false;
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('touchend', handlePointerUp);
    };

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchmove', handlePointerMove, { passive: false });
    document.addEventListener('touchend', handlePointerUp);
  }, [getTimeFromEvent, onSeek]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="scrubber"
      ref={barRef}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={duration || 0}
      aria-valuenow={currentTime || 0}
      tabIndex={0}
    >
      <div className="scrubber__track">
        <div className="scrubber__fill" style={{ width: `${progress}%` }} />
        <div className="scrubber__thumb" style={{ left: `${progress}%` }} />
      </div>
    </div>
  );
}
