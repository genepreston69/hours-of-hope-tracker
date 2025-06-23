
// Location constants with correct UUIDs from the database
export const LOCATION_OPTIONS = ['Bluefield', 'Charleston', 'Huntington', 'Parkersburg'] as const;

export type LocationOption = typeof LOCATION_OPTIONS[number];

// Mapping of location names to their UUIDs in the database
const LOCATION_ID_MAP: Record<string, string> = {
  'Bluefield': 'ee721c56-9178-4544-9d5c-7465f5ae9a69',
  'Charleston': 'd98cb6b7-eac2-4f9e-a97d-4d67fe9afcad', 
  'Huntington': '72e5c533-28a6-423e-902b-0eebd60ef355',
  'Parkersburg': 'a92e56f0-2184-4c7d-a5a8-afe81a4d64bc'
};

export const getLocationIdByName = (locationName: string): string | null => {
  return LOCATION_ID_MAP[locationName] || null;
};

export const getLocationNameById = (locationId: string): string | null => {
  const entry = Object.entries(LOCATION_ID_MAP).find(([, id]) => id === locationId);
  return entry ? entry[0] : null;
};
