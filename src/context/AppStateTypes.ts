
import { Customer, ServiceEntry, ServiceStats, LocationStats } from "../models/types";

export interface AppStateType {
  customers: Customer[];
  serviceEntries: ServiceEntry[];
  stats: ServiceStats;
  locationStats: LocationStats[];
  isLoading: boolean;
}
