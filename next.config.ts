import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Old reckonwell.com URLs → new pages (permanent), to keep search rankings.
    const map: [string, string][] = [
      ["/quotation-calculator", "/instant-quote"],
      ["/final-accounts-ct600-calculator", "/annual-accounts-ct600#calculator"],
      ["/limited-company-accounting", "/annual-accounts-ct600"],
      ["/mtd-calculator", "/making-tax-digital#calculator"],
      ["/self-assessment-calculator", "/self-assessment#calculator"],
      ["/self-employed-accounting", "/self-assessment"],
      ["/rd-tax-relief-calculator", "/r-and-d-tax-relief#calculator"],
      ["/fractional-finance-department", "/outsourced-financial-operations"],
      ["/london-payroll-services", "/payroll-services"],
      ["/referrals", "/partners"],
      ["/book", "/contact"],
    ];
    return map.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
