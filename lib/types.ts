export type ProductType = "PHYSICAL" | "DIGITAL_BOOK";

export type OrderStatus =
  | "PENDING"
  | "CONTACTED"
  | "INVOICED"
  | "FULFILLED"
  | "CANCELLED";

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon_name: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  type: ProductType;
  description: string;
  price: number;
  specifications: Record<string, string>;
  images: string[];
  selar_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  product_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string | null;
  additional_notes: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  products?: Pick<Product, "title" | "slug" | "price" | "type"> | null;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: AdminUser;
        Insert: Partial<AdminUser> & { id: string; email: string };
        Update: Partial<AdminUser>;
      };
      services: {
        Row: Service;
        Insert: Omit<Service, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Omit<Service, "id">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Omit<Product, "id">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<
          Order,
          "id" | "created_at" | "updated_at" | "products"
        > & { id?: string };
        Update: Partial<Omit<Order, "id" | "products">>;
      };
    };
  };
}
