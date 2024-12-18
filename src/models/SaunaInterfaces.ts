export interface ISauna {
  id: string
  name: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  openingHours: IOpeningHour[];
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
