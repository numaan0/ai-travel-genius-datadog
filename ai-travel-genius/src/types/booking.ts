// Auto-generated types: booking
export interface Booking {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // TODO: Add booking properties
}

export type CreateBooking = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
