
// Export location options as an array of strings
export const LOCATION_OPTIONS = ['Bluefield', 'Charleston', 'Huntington', 'Parkersburg'];

// Map of location names to their IDs
const LOCATION_ID_MAP: Record<string, string> = {
  'Bluefield': '1b4da965-3045-42c3-99ec-8ff6c21d3d5a',
  'Charleston': 'd98cb6b7-eac2-4f9e-a97d-4d67fe9afcad',
  'Huntington': '72e5c533-28a6-423e-902b-0eebd60ef355',
  'Parkersburg': 'a92e56f0-2184-4c7d-a5a8-afe81a4d64bc'
};

/**
 * Get the UUID for a location name
 * @param locationName The name of the location
 * @returns The UUID for the location or undefined if not found
 */
export const getLocationIdByName = (locationName: string): string | undefined => {
  return LOCATION_ID_MAP[locationName];
};

/**
 * Get the name for a location ID
 * @param locationId The UUID of the location
 * @returns The name for the location or undefined if not found
 */
export const getLocationNameById = (locationId: string): string | undefined => {
  const entry = Object.entries(LOCATION_ID_MAP).find(([_, id]) => id === locationId);
  return entry ? entry[0] : undefined;
};
