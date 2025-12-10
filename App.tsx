import React, { useState, useEffect } from 'react';
import { MOVIES } from './constants';
import { Movie, BookingState, Seat, GeminiInsights } from './types';
import SeatSelector from './components/SeatSelector';
import { getMovieInsights } from './services/geminiService';
import { 
  Play, 
  Star, 
  Clock, 
  Calendar, 
  Info, 
  ChevronLeft, 
  MapPin, 
  Search,
  Sparkles,
  Ticket,
  BrainCircuit
} from 'lucide-react';

const App: React.FC = () => {
  const [bookingState, setBookingState] = useState<BookingState>({
    step: 'home',
    selectedMovie: null,
    selectedDate: null,
    selectedTime: null,
    selectedSeats: []
  });

  const [aiInsights, setAiInsights] = useState<GeminiInsights | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // --- Handlers ---

  const handleMovieSelect = (movie: Movie) => {
    setBookingState(prev => ({ ...prev, step: 'details', selectedMovie: movie }));
    // Reset AI insights when selecting a new movie
    setAiInsights(null);
  };

  const handleStartBooking = () => {
    setBookingState(prev => ({ ...prev, step: 'booking' }));
  };

  const handleBack = () => {
    if (bookingState.step === 'booking') {
      setBookingState(prev => ({ ...prev, step: 'details' }));
    } else if (bookingState.step === 'details') {
      setBookingState(prev => ({ ...prev, step: 'home', selectedMovie: null }));
    } else if (bookingState.step === 'confirmation') {
        setBookingState(prev => ({ ...prev, step: 'home', selectedMovie: null, selectedSeats: [] }));
    }
  };

  const handleConfirmSeats = (seats: Seat[]) => {
      setBookingState(prev => ({...prev, selectedSeats: seats, step: 'confirmation'}));
  };

  // Fetch AI insights when details page opens
  useEffect(() => {
    if (bookingState.step === 'details' && bookingState.selectedMovie && !aiInsights) {
      setLoadingAi(true);
      getMovieInsights(bookingState.selectedMovie.title)
        .then(insights => {
          setAiInsights(insights);
          setLoadingAi(false);
        });
    }
  }, [bookingState.step, bookingState.selectedMovie, aiInsights]);


  // --- Sub-Components (Inline for single file structural simplicity if not reused widely, but keeping robust) ---
  // In a real app, these would be separate files. I will render them conditionally here.

  const renderNavbar = () => (
    <nav className="fixed top-0 w-full z-50 bg-brand-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setBookingState({step: 'home', selectedMovie: null, selectedSeats: [], selectedDate: null, selectedTime: null})}>
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center transform rotate-3">
              <Play fill="white" size={16} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">CineSphere</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Movies</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Theaters</a>
            <a href="#" className="text-brand-accent hover:text-amber-300 transition-colors font-medium">Premiere</a>
          </div>
          <div className="flex items-center gap-4">
             <button className="p-2 text-slate-400 hover:text-white">
                <Search size={20} />
             </button>
             <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600"></div>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHome = () => (
    <div className="pt-16 pb-20 animate-fade-in">
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/50 to-transparent z-10"></div>
            <img 
                src="https://picsum.photos/seed/hero/1600/900" 
                alt="Featured" 
                className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full z-20 p-8 md:p-16">
                <span className="px-3 py-1 bg-brand-accent text-brand-900 text-xs font-bold rounded-full mb-4 inline-block">NOW TRENDING</span>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl">Galactic Odyssey: The Return</h1>
                <p className="text-slate-300 max-w-xl mb-6 text-lg">Experience the final chapter in the saga that defined a generation. Only in IMAX.</p>
                <div className="flex gap-4">
                    <button className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all">
                        <Ticket size={20} /> Book Now
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all">
                        <Play size={20} /> Watch Trailer
                    </button>
                </div>
            </div>
        </div>

        {/* Premiere Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="text-brand-accent" size={24} /> 
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-yellow-200">Premiere Collection</span>
                </h2>
                <button className="text-slate-400 text-sm hover:text-white">View All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOVIES.filter(m => m.isPremiere).map(movie => (
                    <div 
                        key={movie.id} 
                        onClick={() => handleMovieSelect(movie)}
                        className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[2/3] shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                    >
                        <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-2 right-2 bg-brand-accent/90 text-brand-900 text-xs font-bold px-2 py-1 rounded">VIP</div>
                        <div className="absolute bottom-0 p-4 w-full">
                            <h3 className="text-lg font-bold text-white mb-1 leading-tight">{movie.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <span className="flex items-center gap-1"><Star size={12} className="text-brand-accent fill-brand-accent" /> {movie.rating}</span>
                                <span>•</span>
                                <span>{movie.genre[0]}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Now Showing Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-8 text-white">Now Showing</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                 {MOVIES.filter(m => !m.isPremiere).map(movie => (
                    <div 
                        key={movie.id} 
                        onClick={() => handleMovieSelect(movie)}
                        className="group cursor-pointer"
                    >
                        <div className="rounded-xl overflow-hidden mb-3 shadow-md transition-all group-hover:shadow-brand-500/20 group-hover:shadow-lg">
                            <img src={movie.posterUrl} alt={movie.title} className="aspect-[2/3] object-cover w-full transition-transform group-hover:scale-105" />
                        </div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">{movie.title}</h3>
                        <p className="text-xs text-slate-500">{movie.genre.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderDetails = () => {
    if (!bookingState.selectedMovie) return null;
    const movie = bookingState.selectedMovie;

    return (
        <div className="min-h-screen bg-brand-900 pb-20 animate-fade-in">
            {/* Backdrop Hero */}
            <div className="relative h-[50vh] w-full">
                <button 
                    onClick={handleBack}
                    className="absolute top-20 left-4 z-30 bg-black/50 hover:bg-black/70 p-3 rounded-full backdrop-blur text-white transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/60 to-transparent z-10"></div>
                <img src={movie.backdropUrl} className="w-full h-full object-cover" alt="Backdrop" />
                
                <div className="absolute bottom-0 left-0 w-full z-20 px-4 md:px-8 pb-8 flex flex-col md:flex-row items-end gap-8">
                     <img src={movie.posterUrl} className="w-32 md:w-48 rounded-lg shadow-2xl border-2 border-slate-800 hidden md:block" alt="Poster" />
                     <div className="flex-1">
                        <div className="flex gap-2 mb-3">
                            {movie.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 text-[10px] uppercase tracking-wide rounded">{tag}</span>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
                            <span className="flex items-center gap-1 text-yellow-400"><Star size={16} fill="currentColor"/> {movie.rating}</span>
                            <span>{movie.duration}</span>
                            <span>{movie.genre.join(' / ')}</span>
                        </div>
                     </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Gemini AI Insights */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <BrainCircuit size={100} />
                        </div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-brand-400">
                            <Sparkles size={18} /> AI Analysis
                        </h3>
                        {loadingAi ? (
                             <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                             </div>
                        ) : aiInsights ? (
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">The Buzz</p>
                                    <p className="text-lg font-serif italic text-white leading-relaxed">"{aiInsights.buzz}"</p>
                                </div>
                                <div className="flex gap-2">
                                    {aiInsights.mood.split(',').map((m, i) => (
                                        <span key={i} className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs border border-brand-500/20">{m.trim()}</span>
                                    ))}
                                </div>
                                <div className="pt-2 border-t border-slate-700/50">
                                    <p className="text-sm text-slate-400"> <span className="font-semibold text-slate-300">Critics say:</span> {aiInsights.reviewSummary}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">AI Insights unavailable.</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-3 text-white">Synopsis</h3>
                        <p className="text-slate-300 leading-relaxed text-lg">{movie.description}</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-white">Cast & Crew</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="flex-shrink-0 w-24 text-center">
                                    <img src={`https://picsum.photos/seed/actor${i}${movie.id}/100/100`} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border border-slate-700" alt="Actor" />
                                    <p className="text-sm font-medium text-white truncate">Actor Name</p>
                                    <p className="text-xs text-slate-500 truncate">Character</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Booking Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-800 rounded-2xl p-6 sticky top-24 border border-slate-700">
                        <h3 className="text-lg font-bold mb-6">Select Showtime</h3>
                        
                        {/* Date Selector */}
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                             {['Today', 'Tomorrow', 'Sat 14'].map((day, idx) => (
                                 <button 
                                    key={day} 
                                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${idx === 0 ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-600 text-slate-400 hover:border-slate-500'}`}
                                 >
                                     {day}
                                 </button>
                             ))}
                        </div>

                        {/* Cinema Selector */}
                        <div className="mb-6">
                            <p className="text-xs text-slate-500 mb-2 uppercase font-semibold">CineSphere Downtown (IMAX)</p>
                            <div className="grid grid-cols-2 gap-3">
                                {['10:30 AM', '1:45 PM', '5:00 PM', '8:30 PM'].map(time => (
                                    <button 
                                        key={time}
                                        onClick={() => setBookingState(prev => ({...prev, selectedTime: time}))}
                                        className={`py-2 rounded border text-sm transition-all ${bookingState.selectedTime === time ? 'bg-white text-brand-900 border-white font-bold' : 'border-slate-600 text-slate-300 hover:border-slate-400'}`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleStartBooking}
                            disabled={!bookingState.selectedTime}
                            className="w-full bg-brand-accent hover:bg-yellow-400 text-brand-900 font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Select Seats
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderBooking = () => (
      <div className="min-h-screen pt-20 flex flex-col">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-brand-900 z-10">
              <div>
                  <h2 className="text-xl font-bold text-white">{bookingState.selectedMovie?.title}</h2>
                  <p className="text-slate-400 text-sm">
                      {bookingState.selectedDate || 'Today'} • {bookingState.selectedTime} • CineSphere Downtown
                  </p>
              </div>
          </div>
          <div className="flex-1 relative">
             <SeatSelector 
                basePrice={14.50} 
                onConfirm={handleConfirmSeats} 
                onBack={handleBack} 
             />
          </div>
      </div>
  );

  const renderConfirmation = () => (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
          <div className="bg-slate-800 p-8 rounded-2xl max-w-md w-full border border-slate-700 text-center animate-fade-in shadow-2xl">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-slate-400 mb-8">Your tickets have been sent to your email.</p>
              
              <div className="bg-slate-900 rounded-xl p-4 mb-8 text-left border border-slate-800 relative overflow-hidden">
                   {/* Ticket Punch Circles */}
                   <div className="absolute -left-3 top-1/2 w-6 h-6 bg-slate-800 rounded-full transform -translate-y-1/2"></div>
                   <div className="absolute -right-3 top-1/2 w-6 h-6 bg-slate-800 rounded-full transform -translate-y-1/2"></div>
                   
                   <div className="flex gap-4 border-b border-dashed border-slate-700 pb-4 mb-4">
                       <img src={bookingState.selectedMovie?.posterUrl} className="w-16 h-24 object-cover rounded" alt="Poster" />
                       <div>
                           <h3 className="font-bold text-white">{bookingState.selectedMovie?.title}</h3>
                           <p className="text-sm text-slate-400">{bookingState.selectedTime} • Hall 4</p>
                           <div className="mt-2 flex gap-1">
                               {bookingState.selectedSeats.map(s => (
                                   <span key={s.id} className="text-xs bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">{s.id}</span>
                               ))}
                           </div>
                       </div>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-500">Total Paid</span>
                       <span className="font-bold text-xl text-white">
                           ${bookingState.selectedSeats.reduce((acc, s) => acc + s.price, 0).toFixed(2)}
                       </span>
                   </div>
              </div>

              <button onClick={handleBack} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors">
                  Return Home
              </button>
          </div>
      </div>
  );

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-brand-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {renderNavbar()}
      
      {bookingState.step === 'home' && renderHome()}
      {bookingState.step === 'details' && renderDetails()}
      {bookingState.step === 'booking' && renderBooking()}
      {bookingState.step === 'confirmation' && renderConfirmation()}
    </div>
  );
};

// Simple Icon component for the confirmation page that wasn't imported
const CheckCircle2 = ({size, className}: {size: number, className?: string}) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
);

export default App;
