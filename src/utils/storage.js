const STORAGE_KEY = 'busroute_reservations';

export const getReservations = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveReservation = (reservation) => {
  const reservations = getReservations();
  const newReservation = {
    ...reservation,
    id: Date.now(),
    bookingDate: new Date().toISOString(),
  };
  reservations.push(newReservation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  return newReservation;
};

export const updateReservation = (id, updates) => {
  const reservations = getReservations();
  const index = reservations.findIndex((r) => r.id === id);
  if (index !== -1) {
    reservations[index] = { ...reservations[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    return reservations[index];
  }
  return null;
};

export const deleteReservation = (id) => {
  const reservations = getReservations();
  const filtered = reservations.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getReservedSeats = () => {
  const reservations = getReservations();
  return reservations.map((r) => r.seatNumber);
};

export const isSeatReserved = (seatNumber) => {
  const reservedSeats = getReservedSeats();
  return reservedSeats.includes(seatNumber);
};
