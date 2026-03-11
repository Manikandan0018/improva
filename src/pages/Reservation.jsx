import { useState, useEffect } from 'react';
import { Bus, User, Mail, CheckCircle, X, ChevronRight, Info } from 'lucide-react';
import Seat from '../components/Seat';
import { getReservedSeats, saveReservation, isSeatReserved } from '../utils/storage';

const TOTAL_SEATS = 40;

export default function Reservation() {
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setReservedSeats(getReservedSeats());
  }, []);

  const handleSeatClick = (number) => {
    setSelectedSeat(number);
    setForm({ firstName: '', lastName: '', email: '' });
    setErrors({});
    setSuccess(false);
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (isSeatReserved(selectedSeat)) {
      setErrors({ seat: 'This seat was just booked. Please choose another.' });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      saveReservation({ ...form, seatNumber: selectedSeat });
      setReservedSeats(getReservedSeats());
      setSuccess(true);
      setSubmitting(false);
      setTimeout(() => {
        setSelectedSeat(null);
        setSuccess(false);
      }, 2500);
    }, 600);
  };

  const available = TOTAL_SEATS - reservedSeats.length;

  // Build rows: 2 seats | aisle | 2 seats per row, 10 rows
  const rows = [];
  for (let r = 0; r < 10; r++) {
    const base = r * 4;
    rows.push([base + 1, base + 2, null, base + 3, base + 4]);
  }

  return (
    <div className="min-h-screen bg-bus-dark pt-16 font-body">
      {/* Header */}
      <div className="border-b border-bus-border bg-bus-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-bus-accent tracking-widest uppercase">BRT-001</span>
                <span className="w-1 h-1 rounded-full bg-bus-muted" />
                <span className="text-xs font-mono text-bus-muted">Express Line</span>
              </div>
              <h1 className="font-display text-2xl font-700 text-bus-text">Seat Reservation</h1>
              <p className="text-bus-muted text-sm mt-0.5">Select a seat and fill in your details</p>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2 rounded-xl bg-green-950/40 border border-green-500/30 text-center">
                <div className="text-xl font-display font-700 text-green-400">{available}</div>
                <div className="text-[10px] text-green-400/70 font-mono uppercase tracking-wider">Available</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-center">
                <div className="text-xl font-display font-700 text-red-400">{reservedSeats.length}</div>
                <div className="text-[10px] text-red-400/70 font-mono uppercase tracking-wider">Reserved</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-bus-panel border border-bus-border text-center">
                <div className="text-xl font-display font-700 text-bus-text">{TOTAL_SEATS}</div>
                <div className="text-[10px] text-bus-muted font-mono uppercase tracking-wider">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Bus Layout */}
          <div className="lg:col-span-2">
            <div className="bg-bus-panel border border-bus-border rounded-2xl overflow-hidden shadow-panel">
              {/* Bus front */}
              <div className="bg-gradient-to-b from-bus-border/50 to-transparent px-6 py-4 border-b border-bus-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bus size={18} className="text-bus-accent" />
                  <span className="font-display font-600 text-bus-text text-sm">Bus BRT-001</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-green-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-green-950 border border-green-500/50" />
                    Available
                  </span>
                  <span className="flex items-center gap-1.5 text-red-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-red-950 border border-red-500/50" />
                    Reserved
                  </span>
                  <span className="flex items-center gap-1.5 text-white">
                    <span className="w-2.5 h-2.5 rounded-sm bg-bus-accent" />
                    Selected
                  </span>
                </div>
              </div>

              {/* Windshield / Driver area */}
              <div className="mx-6 mt-5 mb-2 h-10 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-center justify-center">
                <span className="text-xs font-mono text-blue-400/60 tracking-widest uppercase">Driver's Area</span>
              </div>

              {/* Seats Grid */}
              <div className="px-6 pb-6">
                <div className="flex gap-2 justify-center mb-3">
                  <span className="text-xs font-mono text-bus-muted">A</span>
                  <span className="text-xs font-mono text-bus-muted ml-10">B</span>
                  <span className="w-6" />
                  <span className="text-xs font-mono text-bus-muted ml-8">C</span>
                  <span className="text-xs font-mono text-bus-muted ml-9">D</span>
                </div>

                <div className="space-y-2">
                  {rows.map((row, ri) => (
                    <div key={ri} className="flex items-center gap-2 justify-center">
                      <span className="text-[10px] font-mono text-bus-muted w-4 text-right">{ri + 1}</span>
                      {row.map((seat, si) =>
                        seat === null ? (
                          <div key="aisle" className="w-6 flex items-center justify-center">
                            <div className="w-0.5 h-8 bg-bus-border rounded-full" />
                          </div>
                        ) : (
                          <Seat
                            key={seat}
                            number={seat}
                            reserved={reservedSeats.includes(seat)}
                            selected={selectedSeat === seat}
                            onClick={handleSeatClick}
                          />
                        )
                      )}
                    </div>
                  ))}
                </div>

                {/* Back of bus */}
                <div className="mt-5 h-6 rounded-b-xl bg-bus-border/30 border border-bus-border/50 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-bus-muted tracking-widest uppercase">Rear Exit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Form Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {!selectedSeat ? (
                <div className="bg-bus-panel border border-bus-border rounded-2xl p-8 text-center shadow-panel">
                  <div className="w-16 h-16 rounded-2xl bg-bus-border/50 flex items-center justify-center mx-auto mb-4">
                    <Info size={24} className="text-bus-muted" />
                  </div>
                  <h3 className="font-display font-600 text-bus-text mb-2">Select a Seat</h3>
                  <p className="text-bus-muted text-sm leading-relaxed">
                    Click on any <span className="text-green-400 font-medium">green seat</span> on the bus layout to begin your reservation.
                  </p>
                  <div className="mt-6 pt-6 border-t border-bus-border grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-lg font-display font-700 text-bus-text">40</div>
                      <div className="text-xs text-bus-muted">Total Seats</div>
                    </div>
                    <div>
                      <div className="text-lg font-display font-700 text-bus-accent">₹299</div>
                      <div className="text-xs text-bus-muted">Per Ticket</div>
                    </div>
                  </div>
                </div>
              ) : success ? (
                <div className="bg-bus-panel border border-green-500/40 rounded-2xl p-8 text-center shadow-panel animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-green-950/60 border border-green-500/40 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-green-400" />
                  </div>
                  <h3 className="font-display font-700 text-xl text-green-400 mb-2">Booked!</h3>
                  <p className="text-bus-muted text-sm">
                    Seat <span className="text-bus-text font-mono font-600">#{selectedSeat}</span> has been reserved successfully.
                  </p>
                </div>
              ) : (
                <div className="bg-bus-panel border border-bus-border rounded-2xl overflow-hidden shadow-panel animate-fade-in">
                  <div className="px-6 py-4 border-b border-bus-border flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-bus-accent tracking-wider uppercase">Seat Selected</p>
                      <h3 className="font-display font-700 text-bus-text text-lg">
                        Seat <span className="text-bus-accent">#{selectedSeat}</span>
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedSeat(null)}
                      className="p-1.5 rounded-lg hover:bg-bus-border text-bus-muted hover:text-bus-text transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errors.seat && (
                      <div className="px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-sm">
                        {errors.seat}
                      </div>
                    )}

                    {/* First Name */}
                    <div>
                      <label className="block text-xs font-mono text-bus-muted mb-1.5 uppercase tracking-wider">
                        First Name
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bus-muted" />
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          placeholder="Enter first name"
                          className={`w-full bg-bus-dark border rounded-xl pl-9 pr-4 py-2.5 text-sm text-bus-text placeholder-bus-muted/50 outline-none transition-all focus:border-bus-accent focus:ring-1 focus:ring-bus-accent/30 ${
                            errors.firstName ? 'border-red-500/50' : 'border-bus-border'
                          }`}
                        />
                      </div>
                      {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs font-mono text-bus-muted mb-1.5 uppercase tracking-wider">
                        Last Name
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bus-muted" />
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          placeholder="Enter last name"
                          className={`w-full bg-bus-dark border rounded-xl pl-9 pr-4 py-2.5 text-sm text-bus-text placeholder-bus-muted/50 outline-none transition-all focus:border-bus-accent focus:ring-1 focus:ring-bus-accent/30 ${
                            errors.lastName ? 'border-red-500/50' : 'border-bus-border'
                          }`}
                        />
                      </div>
                      {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-mono text-bus-muted mb-1.5 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bus-muted" />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@example.com"
                          className={`w-full bg-bus-dark border rounded-xl pl-9 pr-4 py-2.5 text-sm text-bus-text placeholder-bus-muted/50 outline-none transition-all focus:border-bus-accent focus:ring-1 focus:ring-bus-accent/30 ${
                            errors.email ? 'border-red-500/50' : 'border-bus-border'
                          }`}
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-bus-accent hover:bg-bus-accent2 disabled:opacity-60 disabled:cursor-not-allowed text-white font-display font-600 text-sm rounded-xl transition-all duration-200 shadow-accent hover:shadow-none mt-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          Confirm Reservation
                          <ChevronRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
