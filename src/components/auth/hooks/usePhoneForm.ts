"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Country } from "@/types/country";

const PhoneSchema = z.object({
  country: z.string().min(1, "Select a country code"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(15, "Phone number is too long")
    .regex(/^\d+$/, "Digits only"),
});

export type PhoneForm = z.infer<typeof PhoneSchema>;

export function usePhoneForm(params: {
  selectedCountry: string;
  phoneNumber: string;
  countries: Country[];
  getCountryCode: (c: Country) => string;
  loadingCountries: boolean;
}) {
  const { selectedCountry, phoneNumber, countries, getCountryCode, loadingCountries } = params;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneForm>({
    resolver: zodResolver(PhoneSchema),
    mode: "onChange",
    defaultValues: {
      country: selectedCountry,
      phone: phoneNumber,
    },
  });

  const uniqueCountries = useMemo(() => {
    const seen = new Set<string>();
    const out: Country[] = [];
    for (const c of countries) {
      const code = getCountryCode(c);
      if (!code) continue;
      if (seen.has(code)) continue;
      seen.add(code);
      out.push(c);
    }
    return out;
  }, [countries, getCountryCode]);

  const phoneInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loadingCountries) {
      requestAnimationFrame(() => phoneInputRef.current?.focus());
    }
  }, [loadingCountries]);

  return { control, errors, handleSubmit, uniqueCountries, phoneInputRef };
}
