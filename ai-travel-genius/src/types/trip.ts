// Auto-generated types: trip
export interface Trip {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // TODO: Add trip properties
}

export type CreateTrip = Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>;
