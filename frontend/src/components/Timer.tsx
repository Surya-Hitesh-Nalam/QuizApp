import React, { useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isPaused?: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);
  
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);
  
  useEffect(() => {
    if (isPaused) return;
    
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 10 && !isWarning) {
          setIsWarning(true);
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, isPaused, isWarning]);
  
  // Calculate the width percentage for the progress bar
  const progressWidth = (timeLeft / duration) * 100;
  
  const getProgressColor = () => {
    if (timeLeft <= 10) return 'bg-error-500';
    if (timeLeft <= 30) return 'bg-warning-500';
    return 'bg-success-500';
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <Clock className={`h-5 w-5 mr-2 ${isWarning ? 'text-error-500 animate-pulse' : 'text-gray-600'}`} />
        <span className={`font-bold ${isWarning ? 'text-error-500' : 'text-gray-800'}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full quiz-timer-animation ${getProgressColor()}`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;