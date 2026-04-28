export interface ListingAttribute {
  name: string;
  value: string;
}

export interface ListingImage {
  id: string;
  url: string;
  order: number;
}

export interface Listing {
  id: string;
  listingTitle: string;
  sellingPrice: number;
  itemBrand: string | null;
  itemAge: number | null;
  itemWeight: number | null;
  itemLength: number | null;
  itemWidth: number | null;
  itemHeight: number | null;
  address: { state: string } | null;
  category: { name: string } | null;
  ListingAttribute: ListingAttribute[];
  listingImages: ListingImage[];
}
