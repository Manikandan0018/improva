import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Ticket, Armchair, Search, Pencil, Trash2, X,
  Check, ChevronUp, ChevronDown, ArrowRight, Calendar
} from 'lucide-react';
import { getReservations, updateReservation, deleteReservation } from '../utils/storage';

export default function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('bookingDate');
  const [sortDir, setSortDir] = useState('desc');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setReservations(getReservations());
  }, []);

  const refresh = () => setReservations(getReservations());

  const handleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const filtered = reservations
    .filter((r) => {
      const q = search.toLowerCase();
      return (
        r.firstName.toLowerCase().includes(q) ||
        r.lastName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        String(r.seatNumber).includes(q)
      );
    })
    .sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (sortField === 'seatNumber') { av = Number(av); bv = Number(bv); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const startEdit = (r) => {
    setEditId(r.id);
    setEditForm({ firstName: r.firstName, lastName: r.lastName, email: r.email });
    setEditErrors({});
  };

  const validateEdit = () => {
    const e = {};
    if (!editForm.firstName.trim()) e.firstName = 'Required';
    if (!editForm.lastName.trim()) e.lastName = 'Required';
    if (!editForm.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) e.email = 'Invalid email';
    return e;
  };

  const handleSave = (id) => {
    const errs = validateEdit();
    if (Object.keys(errs).length) { setEditErrors(errs); return; }
    updateReservation(id, editForm);
    refresh();
    setEditId(null);
  };

  const handleDelete = (id) => {
    deleteReservation(id);
    refresh();
    setDeleteId(null);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={12} className="text-bus-border" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-bus-accent" />
      : <ChevronDown size={12} className="text-bus-accent" />;
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const stats = [
    { label: 'Total Reservations', value: reservations.length, icon: Ticket, color: 'text-bus-accent', bg: 'bg-orange-950/40 border-orange-500/30' },
    { label: 'Seats Occupied', value: reservations.length, icon: Armchair, color: 'text-red-400', bg: 'bg-red-950/40 border-red-500/30' },
    { label: 'Seats Available', value: 40 - reservations.length, icon: Users, color: 'text-green-400', bg: 'bg-green-950/40 border-green-500/30' },
  ];

  return (
    <div className="min-h-screen bg-bus-dark pt-16 font-body">
      {/* Header */}
      <div className="border-b border-bus-border bg-bus-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-bus-accent tracking-widest uppercase">Admin View</span>
              </div>
              <h1 className="font-display text-2xl font-700 text-bus-text">Passenger Dashboard</h1>
              <p className="text-bus-muted text-sm mt-0.5">Manage all seat reservations</p>
            </div>
            <Link
              to="/reserve"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-bus-accent hover:bg-bus-accent2 text-white font-display font-600 text-sm rounded-xl transition-all duration-200 shadow-accent hover:shadow-none self-start sm:self-auto"
            >
              New Reservation <ArrowRight size={15} />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bg}`}>
                <Icon size={18} className={color} />
                <div>
                  <div className={`text-lg font-display font-700 ${color}`}>{value}</div>
                  <div className="text-[10px] text-bus-muted font-mono uppercase tracking-wider hidden sm:block">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-bus-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or seat number..."
            className="w-full max-w-md bg-bus-panel border border-bus-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-bus-text placeholder-bus-muted/50 outline-none focus:border-bus-accent focus:ring-1 focus:ring-bus-accent/30 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute left-80 top-1/2 -translate-y-1/2 text-bus-muted hover:text-bus-text">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-bus-panel border border-bus-border rounded-2xl overflow-hidden shadow-panel">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-bus-border/50 flex items-center justify-center mx-auto mb-4">
                <Ticket size={22} className="text-bus-muted" />
              </div>
              <p className="font-display font-600 text-bus-text mb-1">
                {search ? 'No results found' : 'No reservations yet'}
              </p>
              <p className="text-bus-muted text-sm">
                {search ? 'Try a different search term' : 'Head to the reservation page to book seats'}
              </p>
              {!search && (
                <Link
                  to="/reserve"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-bus-accent text-white text-sm font-display font-600 rounded-xl hover:bg-bus-accent2 transition-colors"
                >
                  Book Now <ArrowRight size={14} />
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-bus-border bg-bus-darker/50">
                    {[
                      { label: 'Passenger', field: 'firstName' },
                      { label: 'Email', field: 'email' },
                      { label: 'Seat', field: 'seatNumber' },
                      { label: 'Date', field: 'bookingDate' },
                      { label: 'Actions', field: null },
                    ].map(({ label, field }) => (
                      <th
                        key={label}
                        onClick={() => field && handleSort(field)}
                        className={`px-5 py-3.5 text-left text-xs font-mono text-bus-muted uppercase tracking-wider ${
                          field ? 'cursor-pointer hover:text-bus-text select-none' : ''
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {label}
                          {field && <SortIcon field={field} />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-bus-border/50">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-bus-darker/30 transition-colors group">
                      {editId === r.id ? (
                        <>
                          <td className="px-5 py-3">
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <input
                                  value={editForm.firstName}
                                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                  className={`w-full bg-bus-dark border rounded-lg px-3 py-1.5 text-sm text-bus-text outline-none focus:border-bus-accent ${editErrors.firstName ? 'border-red-500/50' : 'border-bus-border'}`}
                                  placeholder="First"
                                />
                              </div>
                              <div className="flex-1">
                                <input
                                  value={editForm.lastName}
                                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                  className={`w-full bg-bus-dark border rounded-lg px-3 py-1.5 text-sm text-bus-text outline-none focus:border-bus-accent ${editErrors.lastName ? 'border-red-500/50' : 'border-bus-border'}`}
                                  placeholder="Last"
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <input
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className={`w-full bg-bus-dark border rounded-lg px-3 py-1.5 text-sm text-bus-text outline-none focus:border-bus-accent ${editErrors.email ? 'border-red-500/50' : 'border-bus-border'}`}
                              placeholder="email@example.com"
                            />
                          </td>
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-bus-border/50 font-mono text-sm text-bus-text">
                              #{r.seatNumber}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-bus-muted text-sm font-mono">
                            {formatDate(r.bookingDate)}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSave(r.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-950/60 border border-green-500/30 text-green-400 hover:bg-green-900/60 text-xs font-medium transition-colors"
                              >
                                <Check size={13} /> Save
                              </button>
                              <button
                                onClick={() => setEditId(null)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bus-dark border border-bus-border text-bus-muted hover:text-bus-text text-xs font-medium transition-colors"
                              >
                                <X size={13} /> Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-bus-accent/20 border border-bus-accent/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-bus-accent text-xs font-display font-700">
                                  {r.firstName[0]}{r.lastName[0]}
                                </span>
                              </div>
                              <span className="font-medium text-bus-text text-sm">
                                {r.firstName} {r.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-bus-muted text-sm">{r.email}</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-bus-accent/10 border border-bus-accent/20 font-mono text-sm text-bus-accent font-600">
                              #{r.seatNumber}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-bus-muted text-sm font-mono">
                              <Calendar size={12} />
                              {formatDate(r.bookingDate)}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEdit(r)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 hover:bg-blue-900/60 text-xs font-medium transition-colors"
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              <button
                                onClick={() => setDeleteId(r.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 hover:bg-red-900/60 text-xs font-medium transition-colors"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-bus-border flex items-center justify-between text-xs text-bus-muted font-mono">
              <span>Showing {filtered.length} of {reservations.length} reservations</span>
              <span>{40 - reservations.length} seats remaining</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-bus-panel border border-bus-border rounded-2xl p-6 w-full max-w-sm shadow-panel animate-slide-in">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center mb-4">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h3 className="font-display font-700 text-bus-text mb-2">Delete Reservation?</h3>
            <p className="text-bus-muted text-sm mb-6">
              This will permanently remove the reservation and free up the seat.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-display font-600 text-sm rounded-xl transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-bus-dark border border-bus-border hover:border-bus-muted text-bus-text font-display font-600 text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
