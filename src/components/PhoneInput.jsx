import {
  Button,
  Input,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";

// Country list with country codes
const COUNTRIES = [
  { name: "United States", code: "US", dialCode: "+1" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", dialCode: "+44" },
  { name: "Australia", code: "AU", dialCode: "+61" },
  { name: "Germany", code: "DE", dialCode: "+49" },
  { name: "France", code: "FR", dialCode: "+33" },
  { name: "India", code: "IN", dialCode: "+91" },
  { name: "Japan", code: "JP", dialCode: "+81" },
  { name: "China", code: "CN", dialCode: "+86" },
  { name: "Mexico", code: "MX", dialCode: "+52" },
  { name: "Brazil", code: "BR", dialCode: "+55" },
  { name: "Spain", code: "ES", dialCode: "+34" },
  { name: "Italy", code: "IT", dialCode: "+39" },
  { name: "Netherlands", code: "NL", dialCode: "+31" },
  { name: "Sweden", code: "SE", dialCode: "+46" },
  { name: "Switzerland", code: "CH", dialCode: "+41" },
  { name: "South Korea", code: "KR", dialCode: "+82" },
  { name: "Singapore", code: "SG", dialCode: "+65" },
  { name: "New Zealand", code: "NZ", dialCode: "+64" },
  { name: "Ireland", code: "IE", dialCode: "+353" },
].sort((a, b) => a.name.localeCompare(b.name));

// Helper function to convert country code to flag emoji
const getCountryFlag = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

// Phone number formatter based on country
const formatPhoneNumber = (value, countryCode) => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");

  // Define formatting patterns for different countries
  const patterns = {
    US: (d) => {
      // Format: (XXX) XXX-XXXX
      if (d.length <= 3) return d;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    },
    CA: (d) => {
      // Same as US: (XXX) XXX-XXXX
      if (d.length <= 3) return d;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    },
    GB: (d) => {
      // Format: XXXX XXX XXXX
      if (d.length <= 4) return d;
      if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
      return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 11)}`;
    },
    AU: (d) => {
      // Format: XXXX XXX XXX
      if (d.length <= 4) return d;
      if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
      return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 10)}`;
    },
    IN: (d) => {
      // Format: XXXXX XXXXX
      if (d.length <= 5) return d;
      return `${d.slice(0, 5)} ${d.slice(5, 10)}`;
    },
  };

  // Use country-specific pattern or generic format
  const formatter = patterns[countryCode];
  if (formatter) {
    return formatter(digits.slice(0, 15)); // Limit to 15 digits
  }

  // Generic format: add space every 3-4 digits
  let formatted = "";
  for (let i = 0; i < digits.length && i < 15; i++) {
    if (i > 0 && i % 4 === 0) formatted += " ";
    formatted += digits[i];
  }
  return formatted;
};

function PhoneInput({
  selectedCountry,
  setSelectedCountry,
  setPhone,
  phone,
  countryIsDisabled = false,
}) {
  return (
    <div className="flex gap-2 items-stretch">
      <Popover placement="bottom-start">
        <PopoverTrigger className="flex">
          <Button
            variant="bordered"
            className="min-w-fit flex h-auto"
            isDisabled={countryIsDisabled}
          >
            {getCountryFlag(selectedCountry.code)} {selectedCountry.dialCode}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-h-64 overflow-y-auto">
          <Listbox
            aria-label="Country selection"
            className="pt-8"
            onAction={(key) => {
              const country = COUNTRIES.find((c) => c.code === key);
              if (country) {
                setSelectedCountry(country);
              }
            }}
          >
            {COUNTRIES.map((country) => (
              <ListboxItem key={country.code}>
                {getCountryFlag(country.code)} {country.name} (
                {country.dialCode})
              </ListboxItem>
            ))}
          </Listbox>
        </PopoverContent>
      </Popover>
      <Input
        type="tel"
        isRequired
        label="Phone Number"
        placeholder="Phone number"
        value={formatPhoneNumber(phone, selectedCountry.code)}
        onChange={(e) => {
          const formatted = formatPhoneNumber(
            e.target.value,
            selectedCountry.code,
          );
          setPhone(formatted);
        }}
        className="flex-1"
        minLength={10}
      />
    </div>
  );
}

export { COUNTRIES, PhoneInput, formatPhoneNumber, getCountryFlag };
