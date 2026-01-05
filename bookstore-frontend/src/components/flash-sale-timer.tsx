'use client';

import { useState, useEffect } from 'react';

interface FlashSaleTimerProps {
  discount: number;
}

export function FlashSaleTimer({ discount }: FlashSaleTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 38,
    seconds: 48,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 0;
              minutes = 0;
              seconds = 0;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="bg-secondary text-secondary-foreground rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg">FLASH SALE</span>
        <div className="flex gap-2">
          <div className="bg-black text-white px-3 py-1 rounded font-mono font-bold text-sm">
            {pad(timeLeft.hours)}
          </div>
          <div className="bg-black text-white px-3 py-1 rounded font-mono font-bold text-sm">
            {pad(timeLeft.minutes)}
          </div>
          <div className="bg-black text-white px-3 py-1 rounded font-mono font-bold text-sm">
            {pad(timeLeft.seconds)}
          </div>
        </div>
      </div>
      <div className="flex-1 mx-4 h-2 bg-white/30 rounded-full overflow-hidden">
        <div className="h-full bg-white w-3/4 rounded-full"></div>
      </div>
      <span className="text-sm font-semibold">Còn lại 9</span>
    </div>
  );
}
