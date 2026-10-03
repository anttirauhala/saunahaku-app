export interface IWaterTemperature {
  temperatureC: number;
  measuredAt: string;
  station: IWaterStation;
  fetchedAt: string;
  stale: boolean;
  source: IWaterSource;
}

export interface IWaterStation {
  id: number;
  name: string;
  lake: string;
  municipality: string;
  latitude: number;
  longitude: number;
}

export interface IWaterSource {
  system: string;
  name: string;
  url: string;
  license: string;
}
