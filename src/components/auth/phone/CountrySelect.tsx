"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Country } from "@/types/country";
import type { PhoneForm } from "@/components/auth/hooks/usePhoneForm";
import Image from "next/image";

export function CountrySelect(props: {
  control: Control<PhoneForm>;
  errors: FieldErrors<PhoneForm>;
  loadingCountries: boolean;
  uniqueCountries: Country[];
  selectedCountry: string;
  setSelectedCountry: (v: string) => void;
  getCountryCode: (c: Country) => string;
}) {
  const { control, errors, loadingCountries, uniqueCountries, selectedCountry, setSelectedCountry, getCountryCode } = props;

  return (
    <div className="space-y-2">
      <Label htmlFor="country">Country Code</Label>
      {loadingCountries ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || selectedCountry}
              onValueChange={(val) => {
                field.onChange(val);
                setSelectedCountry(val);
              }}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCountries.map((country) => (
                  <SelectItem key={country.cca2} value={getCountryCode(country)}>
                    <div className="flex items-center gap-2">
                      <div className="relative w-5 h-4 overflow-hidden rounded-[2px]">
                        <Image
                          src={country.flags.svg}
                          alt={`${country.name.common} flag`}
                          fill
                          sizes="20px"
                          className="object-cover"
                        />
                      </div>
                      <span>{country.name.common}</span>
                      <span className="text-muted-foreground ml-auto">{getCountryCode(country)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      )}
      {errors.country && (
        <p className="text-xs text-destructive">{String(errors.country.message)}</p>
      )}
    </div>
  );
}
