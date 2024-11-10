export type DeviceStatus = 'available' | 'dispatched' | 'repair' | 'maintenance';

export type DeviceHistoryType = 'borrow' | 'return' | 'repair';

export type DeviceHistory = {
  type: DeviceHistoryType;
  date: string;
  user: string;
  notes: string;
  repairDetails?: {
    issue: string;
    solution: string;
    cost?: number;
    technician?: string;
  };
};

export type Device = {
  _id: string;
  name: string;
  serialNumber: string;
  status: DeviceStatus;
  assignedTo?: string;
  lastMaintenance?: string;
  notes?: string;
  history: DeviceHistory[];
};


