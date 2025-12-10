import React, { useState, useEffect } from 'react';
import { Seat } from '../types';
import { Armchair, CheckCircle2 } from 'lucide-react';

interface SeatSelectorProps {
  onConfirm: (seats: Seat[]) => void;
  onBack: () => void;
  basePrice: number;
}

// Helper to generate a mock theater layout
const generateSeats = (basePrice: number): Seat[] => {
  const rows = 8;
  const cols = 10;
  const seats: Seat[] = [];
  const rowsLabel = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      let type: Seat['type'] = 'standard';
      let price = basePrice;
      
      // Back rows are VIP
      if (r >= 6) {
        type = 'vip';
        price += 5;
      }

      // Randomly mark some as occupied
      const status = Math.random() < 0.2 ? 'occupied' : 'available';

      seats.push({
        id: `${rowsLabel[r]}${c}`,
        row: rowsLabel[r],
        number: c,
        type,
        status,
        price
      });
    }
  }
  return seats;
};

const SeatSelector: React.FC<SeatSelectorProps> = ({ onConfirm, onBack, basePrice }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    setSeats(generateSeats(basePrice));
  }, [basePrice]);

  const toggleSeat = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.status === 'occupied') return;

    if (selectedSeats.find(s => s.id === seatId)) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
      setSeats(prev => prev.map(s => s.id === seatId ? { ...s, status: 'available' } : s));
    } else {
      setSelectedSeats(prev => [...prev, seat]);
      setSeats(prev => prev.map(s => s.id === seatId ? { ...s, status: 'selected' } : s));
    }
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        
        {/* Screen */}
        <div className="mb-12 mt-8 relative">
          <div className="h-16 bg-gradient-to-b from-brand-400/20 to-transparent w-3/4 mx-auto screen-curve transform perspective-1000 rotate-x-12"></div>
          <p className="text-center text-slate-500 text-sm mt-4">SCREEN</p>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-8 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-700"></div> Occupied
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-slate-600"></div> Standard
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-brand-accent/50 bg-brand-accent/10"></div> VIP
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-brand-500 text-white flex items-center justify-center">
                <CheckCircle2 size={12} />
            </div> Selected
          </div>
        </div>

        {/* Seat Grid */}
        <div className="grid gap-y-2 justify-center">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(rowLabel => (
            <div key={rowLabel} className="flex items-center gap-2 md:gap-4">
              <span className="w-4 text-xs text-slate-500 font-mono text-center">{rowLabel}</span>
              <div className="flex gap-1.5 md:gap-3">
                {seats.filter(s => s.row === rowLabel).map(seat => {
                  const isSelected = selectedSeats.find(s => s.id === seat.id);
                  const isOccupied = seat.status === 'occupied';
                  const isVip = seat.type === 'vip';

                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat.id)}
                      disabled={isOccupied}
                      className={`
                        w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-md flex items-center justify-center transition-all duration-200
                        ${isOccupied 
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                          : isSelected
                            ? 'bg-brand-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] transform scale-110'
                            : isVip
                              ? 'bg-slate-900 border border-brand-accent/40 text-brand-accent hover:bg-brand-accent/20'
                              : 'bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300'
                        }
                      `}
                    >
                      <Armchair size={isVip ? 20 : 18} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-brand-900/95 backdrop-blur-md border-t border-slate-800 p-4 md:p-6 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Price</p>
            <p className="text-2xl font-bold text-white">${totalPrice.toFixed(2)}</p>
            <p className="text-xs text-slate-500">{selectedSeats.length} seat(s) selected</p>
          </div>
          <div className="flex gap-4">
             <button 
              onClick={onBack}
              className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={() => onConfirm(selectedSeats)}
              disabled={selectedSeats.length === 0}
              className="px-8 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
