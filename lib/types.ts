import { Id } from "../convex/_generated/dataModel";

export type DeviceStatus = 
  | 'available' 
  | 'dispatched'
  | 'repair'
  | 'retired'
  | 'missing';

export type RetiredReason = 'donated' | 'sold';

export type DeviceHistoryType = 
  | 'borrow'
  | 'return'
  | 'repair'
  | 'maintenance'
  | 'retire'
  | 'missing';

export interface RepairDetails {
  issue: string;
  solution: string;
  cost: number;
  technician: string;
}

export interface RetireDetails {
  reason: RetiredReason;
  value?: number;
  recipient?: string;
}

export interface DeviceHistory {
  type: DeviceHistoryType;
  date: string;
  user: string;
  notes?: string;
  repairDetails?: RepairDetails;
  retireDetails?: RetireDetails;
  receivedBy?: string;
}

export interface Device {
  _id: Id<"devices">;
  _creationTime: number;
  name: string;
  serialNumber: string;
  status: DeviceStatus;
  assignedTo: string;
  lastMaintenance?: string;
  history: DeviceHistory[];
}


