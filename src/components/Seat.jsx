export default function Seat({ number, reserved, selected, onClick }) {
  const base =
    'relative flex flex-col items-center justify-center w-12 h-14 rounded-t-2xl rounded-b-sm cursor-pointer select-none transition-all duration-200 text-xs font-mono font-500 border';

  const states = reserved
    ? `bg-red-950/60 border-red-500/40 text-red-400 cursor-not-allowed shadow-seat-red`
    : selected
    ? `bg-bus-accent border-bus-accent text-white scale-105 shadow-accent`
    : `bg-green-950/60 border-green-500/40 text-green-400 hover:bg-green-900/60 hover:border-green-400 hover:scale-105 hover:shadow-seat`;

  return (
    <button
      className={`${base} ${states}`}
      onClick={() => !reserved && onClick(number)}
      disabled={reserved}
      title={reserved ? `Seat ${number} — Reserved` : `Seat ${number} — Available`}
    >
      {/* Seat back */}
      <div
        className={`absolute top-0 left-1 right-1 h-3 rounded-t-xl border-b ${
          reserved
            ? 'bg-red-900/40 border-red-500/30'
            : selected
            ? 'bg-orange-400 border-orange-300'
            : 'bg-green-900/40 border-green-500/30'
        }`}
      />
      <span className="mt-3 font-mono font-medium text-[11px] z-10">{number}</span>
      {/* Seat bottom indicator */}
      <div
        className={`absolute bottom-0 left-2 right-2 h-1 rounded-full ${
          reserved ? 'bg-red-500/40' : selected ? 'bg-white/60' : 'bg-green-500/40'
        }`}
      />
    </button>
  );
}
