export interface Property {
  id: number;
  title: string;
  address: string;
  price: number;
  imageUrl: string | null;
  createdAt: string;
}

export interface VerifyHashResponse {
  success: true;
  propertyHash: string;
  propertyId: number;
  address: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}
