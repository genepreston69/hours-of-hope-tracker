
import { Customer, ServiceEntry, ServiceStats, LocationStats } from "../models/types";

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface AppStateType {
  customers: Customer[];
  serviceEntries: ServiceEntry[];
  stats: ServiceStats;
  locationStats: LocationStats[];
  isLoading: boolean;
  pagination: PaginationState;
}
