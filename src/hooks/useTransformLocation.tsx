import { useMemo } from 'react';
import cities from '@/utils/majorcities.json';
import countries from '@/utils/countrycodes.json';

const locationValues = {
  cities,
  countries,
};

export const useLocation = () => {
  const innerCountries = locationValues.countries;
  const innerCities = (
    locationValues.cities as {
      country: string;
      name: string;
      lat: string;
      lng: string;
    }[]
  ).map(x => ({
    ...x,
    fullCountry:
      innerCountries.find(i => i.code === x.country)?.name || x.country,
  }));

  return useMemo(
    () => ({
      countries: innerCountries,
      cities: innerCities,
    }),
    [innerCities, innerCountries],
  );
};
