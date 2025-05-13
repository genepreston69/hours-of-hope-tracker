
import { LocationOption } from "@/models/types";

// Define location options with their UUIDs from the database
export interface LocationWithId {
  id: string;
  name: LocationOption;
}

// Define location options as a constant for reuse
export const LOCATION_OPTIONS: LocationOption[] = ["Bluefield", "Charleston", "Huntington", "Parkersburg"];

// Map location names to their UUIDs
export const LOCATIONS_WITH_IDS: LocationWithId[] = [
  { id: "ee721c56-9178-4544-9d5c-7465f5ae9a69", name: "Bluefield" },
  { id: "d98cb6b7-eac2-4f9e-a97d-4d67fe9afcad", name: "Charleston" },
  { id: "72e5c533-28a6-423e-902b-0eebd60ef355", name: "Huntington" },
  { id: "a92e56f0-2184-4c7d-a5a8-afe81a4d64bc", name: "Parkersburg" }
];

// Helper function to find location ID by name
export function getLocationIdByName(name: string): string | undefined {
  // Case-insensitive lookup and handle trimmed whitespace
  const location = LOCATIONS_WITH_IDS.find(
    loc => loc.name.toLowerCase() === name.trim().toLowerCase()
  );
  return location?.id;
}

// Helper function to find location name by ID
export function getLocationNameById(id: string): string | undefined {
  const location = LOCATIONS_WITH_IDS.find(loc => loc.id === id);
  return location?.name;
}
