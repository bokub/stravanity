export type Segment = {
  id: number;
  points: string;
  name: string;
  start_latlng: [number, number];
  end_latlng: [number, number];
  local_legend_enabled: boolean;
  starred: boolean;
  elevation_profile: string;
  details?: SegmentDetails;
  computed?: Computed;
};

export type SegmentDetails = {
  distance: number;
  local_legend: Lcl;
  xoms: Xoms;
};

export type Lcl = {
  athlete_id: number;
  effort_count: number;
  effort_counts: {
    female: string;
    overall: string;
  };
};

export type Xoms = {
  kom: string;
  qom: string;
};

export enum RecordType {
  LocalLegend = 'LocalLegend',
  CourseRecord = 'CourseRecord',
}

export type Computed = {
  distance?: string;
  distanceToLocalLegend?: number;
  effortCount?: number;
  speedRecord?: number;
  bestTimeString?: string;
};

export type Bounds = [number, number, number, number];
