export interface Ship {
  id: number;
  name: string;
  medias: Medias;
  manufacturer: Manufacturer;
  focus: string;
  type: string;
  flyableStatus: string;
  owned: boolean;
  msrp: number;
  link: string;
  skus: Sku[];
}

export interface Medias {
  productThumbMediumAndSmall: string;
  slideShow: string;
}

export interface Manufacturer {
  id: number;
  name: string;
}

export interface Sku {
  id: number;
  title: string;
  available: boolean;
  price: number;
  body: string | null;
  unlimitedStock: boolean;
  availableStock: number;
}
