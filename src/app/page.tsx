import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CountryGate from '@/components/jurisdiction/CountryGate';
import { getCountries } from '@/services/jurisdiction.service';

export default async function Home() {
  const cookieStore = await cookies();
  const countryCookie = cookieStore.get('ax_country');
  
  // Rule 2 - Country Required: If no country context exists, show country selector
  if (!countryCookie?.value) {
    const countries = await getCountries();
    return (
      <main className="min-h-screen bg-gray-50">
        <CountryGate countries={countries} />
      </main>
    );
  }

  // If a country is selected, redirect to the default localized jurisdiction route (Rule 5)
  // For now, default to Spanish '/es' as requested
  redirect(`/es/${countryCookie.value}`);
}
