"use client";

import type { Country } from "@/types/country";
import { usePhoneForm } from "@/components/auth/hooks/usePhoneForm";
import { CountrySelect } from "@/components/auth/phone/CountrySelect";
import { PhoneNumberInput } from "@/components/auth/phone/PhoneNumberInput";
import { SendOtpButton } from "@/components/auth/phone/SendOtpButton";

interface PhoneStepProps {
  countries: Country[];
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  error?: string;
  onSend: () => void;
  isLoading?: boolean;
  getCountryCode: (c: Country) => string;
  loadingCountries?: boolean;
}

export default function PhoneStep({
  countries,
  selectedCountry,
  setSelectedCountry,
  phoneNumber,
  setPhoneNumber,
  error,
  onSend,
  isLoading,
  getCountryCode,
  loadingCountries = false,
}: PhoneStepProps) {
  const { control, errors, handleSubmit, uniqueCountries, phoneInputRef } = usePhoneForm({
    selectedCountry,
    phoneNumber,
    countries,
    getCountryCode,
    loadingCountries,
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSend)}>
      <CountrySelect
        control={control}
        errors={errors}
        loadingCountries={loadingCountries}
        uniqueCountries={uniqueCountries}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        getCountryCode={getCountryCode}
      />

      <PhoneNumberInput
        control={control}
        errors={errors}
        loadingCountries={loadingCountries}
        selectedCountry={selectedCountry}
        setPhoneNumber={setPhoneNumber}
        onEnter={() => handleSubmit(onSend)()}
        inputRef={phoneInputRef}
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <SendOtpButton isLoading={isLoading} loadingCountries={loadingCountries} />
    </form>
  );
}

