// Common timezones - you can expand this list as needed
export const commonTimezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
  { value: 'Europe/Brussels', label: 'Brussels (CET/CEST)' },
  { value: 'Europe/Vienna', label: 'Vienna (CET/CEST)' },
  { value: 'Europe/Zurich', label: 'Zurich (CET/CEST)' },
  { value: 'Europe/Prague', label: 'Prague (CET/CEST)' },
  { value: 'Europe/Budapest', label: 'Budapest (CET/CEST)' },
  { value: 'Europe/Warsaw', label: 'Warsaw (CET/CEST)' },
  { value: 'Europe/Stockholm', label: 'Stockholm (CET/CEST)' },
  { value: 'Europe/Oslo', label: 'Oslo (CET/CEST)' },
  { value: 'Europe/Copenhagen', label: 'Copenhagen (CET/CEST)' },
  { value: 'Europe/Helsinki', label: 'Helsinki (EET/EEST)' },
  { value: 'Europe/Riga', label: 'Riga (EET/EEST)' },
  { value: 'Europe/Tallinn', label: 'Tallinn (EET/EEST)' },
  { value: 'Europe/Vilnius', label: 'Vilnius (EET/EEST)' },
  { value: 'Europe/Sofia', label: 'Sofia (EET/EEST)' },
  { value: 'Europe/Bucharest', label: 'Bucharest (EET/EEST)' },
  { value: 'Europe/Athens', label: 'Athens (EET/EEST)' },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Europe/Kiev', label: 'Kiev (EET/EEST)' },
  { value: 'Europe/Minsk', label: 'Minsk (MSK)' },
  { value: 'Europe/Belgrade', label: 'Belgrade (CET/CEST)' },
  { value: 'Europe/Zagreb', label: 'Zagreb (CET/CEST)' },
  { value: 'Europe/Ljubljana', label: 'Ljubljana (CET/CEST)' },
  { value: 'Europe/Bratislava', label: 'Bratislava (CET/CEST)' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
  { value: 'Asia/Jakarta', label: 'Jakarta (WIB)' },
  { value: 'Asia/Manila', label: 'Manila (PHT)' },
  { value: 'Asia/Kolkata', label: 'Kolkata (IST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Tehran', label: 'Tehran (IRST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEDT/AEST)' },
  { value: 'Australia/Perth', label: 'Perth (AWST)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZDT/NZST)' },
  { value: 'Pacific/Fiji', label: 'Fiji (FJT)' },
];

// Units options
export const unitsOptions = [
  { value: 'metric', label: 'Metric (kg, km, °C)' },
  { value: 'imperial', label: 'Imperial (lb, mi, °F)' },
];

// Detect browser timezone
export const detectBrowserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
};

// Get timezone label by value
export const getTimezoneLabel = (value: string): string => {
  const timezone = commonTimezones.find(tz => tz.value === value);
  return timezone ? timezone.label : value;
};

// Get units label by value
export const getUnitsLabel = (value: string): string => {
  const units = unitsOptions.find(u => u.value === value);
  return units ? units.label : value;
};
