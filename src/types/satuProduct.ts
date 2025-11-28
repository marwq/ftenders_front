export interface SatuProduct {
  product: {
    id: number;
    name: string;
    sku?: string;
    price: number | null;
    priceCurrencyLocalized: string;
    priceFrom?: boolean;
    priceOriginal?: number;
    discountedPrice?: number;
    hasDiscount?: boolean;
    discountDaysLabel?: string;
    measureUnit: string;
    wholesalePrices?: Array<{
      minimumOrderQuantity: number;
      price: number;
    }>;
    image400x400?: string;
    imageAlt?: string;
    urlText?: string;
    company: {
      id: number;
      name: string;
      slug: string;
      regionName: string;
      countryName: string;
      webSiteUrl?: string;
      phones?: Array<{ number: string }>;
      lastActivityTime?: string;
      isOperating?: boolean;
      isWorkingNow?: boolean;
      isChatVisible?: boolean;
      inTopSegment?: boolean;
      opinionStats?: {
        opinionTotal: number;
        opinionPositivePercent: number;
      };
      deliveryRegions?: DeliveryRegion[];
    };
    presence: {
      isAvailable?: boolean;
      isOrderable?: boolean;
      isWait?: boolean;
      isEnding?: boolean;
    };
    catalogPresence?: {
      title: string;
    };
    productOpinionCounters?: {
      rating: number;
      count: number;
    };
    sellingType?: {
      universal?: {
        title_filter_set: string;
      };
    };
    manufacturerInfo?: {
      name: string;
    };
  };
}

export interface DeliveryRegion {
  name: string;
  subRegions?: DeliveryRegion[];
}

export interface PaymentOption {
  id: number;
  name: string;
  raw_type: string;
}

export interface DeliveryOption {
  name: string;
  raw_type: string;
  comment?: string;
  available_payment_option_ids?: number[];
}

export interface SatuProductDetails {
  contacts: {
    data: {
      product: {
        id: number;
        company: {
          id: number;
          name: string;
          slug: string;
          webSiteUrl?: string;
          phones: Array<{ number: string }>;
          lastActivityTime: string;
          isOperating: boolean;
          isWorkingNow: boolean;
          isChatVisible?: boolean;
        };
      };
    };
  };
  delivery_payment: {
    data: {
      product: {
        company: {
          deliveryRegions: DeliveryRegion[];
        };
        paymentOptions: PaymentOption[];
        deliveryOptions: DeliveryOption[];
      };
    };
  };
}

export interface SatuSearchResponse {
  data: {
    listing: {
      searchTerm: string;
      __typename?: string;
      page: {
        correctedSearchTerm?: string | null;
        __typename?: string;
        products: SatuProduct[];
      };
    };
  };
}
