export type StationClassificationLevel = 'low' | 'ideal' | 'high' | 'flood' | 'unknown';
export interface Station {
  siteId: string;
  name: string;
  lat: number;
  lon: number;
}

export interface RealtimeReading {
  dischargeCfs?: number;
  gageHeightFt?: number;
  timestamp?: string;
  classification: {
    label: string;
    level: StationClassificationLevel;
  };
  trend: 'rising' | 'falling' | 'steady';
}

export interface ForecastSummary {
  periods: Array<{ time: string; tempF: number; description: string; precipIn?: number }>;
  totals: { hours24: number; hours48: number; hours72: number };
}

export interface ApiClientOptions {
  baseUrl: string;
  token?: string;
}

export class ApiClient {
  constructor(private opts: ApiClientOptions) {}

  private headers() {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.opts.token) headers['Authorization'] = `Bearer ${this.opts.token}`;
    return headers;
  }

  async getStations(): Promise<Station[]> {
    const res = await fetch(`${this.opts.baseUrl}/api/stations`, { headers: this.headers() });
    return res.json();
  }

  async getRealtime(siteId: string): Promise<RealtimeReading> {
    const res = await fetch(`${this.opts.baseUrl}/api/stations/${siteId}/realtime`, { headers: this.headers() });
    return res.json();
  }
}
