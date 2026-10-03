export interface ISauna {
  id: string
  name: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  latitude?: number;
  longitude?: number;
  openingHours: IOpeningHour[];
  phone: string;
  webPage: string;
  info: string;
  kiosk: boolean;
  restaurant: boolean;
  isNew: boolean;
}

export interface IOpeningHour {
  weekday: string;
  openingTime: string;
  closingTime: string;
  prices: IPrice[];
}

export interface IPrice {
  price: number;
  priceType: string;
}
