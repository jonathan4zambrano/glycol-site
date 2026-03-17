export interface GlycolReading {
  concentration_pct: number;
  timestamp: string;
  receivedAt: string;
}

export interface NrfCloudMessageItem {
  topic: string;
  deviceId: string;
  receivedAt: string;
  message: {
    appId: string;
    messageType: string;
    ts?: number;
    data: {
      concentration_pct: number;
    };
  };
}

export interface NrfCloudMessagesResponse {
  items: NrfCloudMessageItem[];
  pageNextToken?: string;
  total?: number;
}

export interface GlycolApiResponse {
  latest: GlycolReading | null;
  history: GlycolReading[];
  deviceOnline: boolean;
  error?: string;
}
