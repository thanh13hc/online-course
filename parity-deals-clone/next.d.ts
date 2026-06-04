declare module "next/server" {
  interface NextRequest {
    geo?: {
      country: string;
      // You can also add other geo-related properties here if needed
    };
  }
}
