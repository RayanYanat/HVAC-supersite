/**
 * Data shape for a single prospect/client row in Supabase `leads` table.
 * All sections that were previously reading from lib/constants.ts now
 * receive a CompanyData prop injected by the [slug]/page.tsx Server Component.
 */
export interface CompanyData {
  slug:     string;
  name:     string;
  zone:     string;
  phone:    string;
  email:    string | null;
  license:  string | null;
}
