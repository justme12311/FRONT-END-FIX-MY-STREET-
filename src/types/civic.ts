export type ReportStatus =
  | 'REPORTED'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'INVESTIGATING'
  | 'SCHEDULED'
  | 'RESOLVED';

export interface StatusHistoryItem {
  status: ReportStatus;
  timestamp: string;
  notes?: string;
  completed: boolean;
}

export interface NewReportInput {
  photo: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface CivicReport {
  report_id: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  department: string;
  status: ReportStatus;
  created_at: string;
  status_history: StatusHistoryItem[];

  // Required exact fields from document
  photo: string;
  latitude: number;
  longitude: number;
  description?: string;

  // Metadata for display, maps, and disability focus
  address: string;
  neighborhood: string;
  is_disability_hazard?: boolean;
  disability_detail?: string;
  qr_code_source?: string;
  upvotes?: number;
  has_upvoted?: boolean;
}
