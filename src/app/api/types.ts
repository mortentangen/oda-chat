type ProductAttribute = {
    id: number | string;
    full_name: string;
    brand?: string;
    name_extra?: string;
    gross_price?: string | number;
    gross_unit_price?: string | number;
    unit_price_quantity_name?: string;
    currency?: string;
    availability?: {
      is_available?: boolean;
      description?: string;
    };
    front_url?: string;
    client_classifiers?: { name?: string; is_important?: boolean }[];
  };

  export type Product = { attributes: ProductAttribute };

  type SimpleProduct = {
    id: number | string;
    name: string;
    name_extra?: string;
    brand?: string;
    gross_price: string;
    images?: { thumbnail?: { url?: string } }[];
    front_url?: string;
    unit_price_quantity_name?: string;
    gross_unit_price: string;
    full_name: string;
};

export type SimpleItem = {
    product: SimpleProduct;
    quantity: number;
    display_price_total: string;
  };

  export type SimpleGroup = {
    items?: SimpleItem[];
  };