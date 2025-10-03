"use client";

import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Country } from "@/types/country";
import { Loader as Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

const PhoneSchema = z.object({
  country: z.string().min(1, "Select a country code"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(15, "Phone number is too long")
    .regex(/^\d+$/, "Digits only"),
});

type PhoneForm = z.infer<typeof PhoneSchema>;

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

  const onSubmit = () => {
    onSend();
  };

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

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                value={field.value}
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
                    <SelectItem
                      key={country.cca2}
                      value={getCountryCode(country)}
                    >
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
                        <span className="text-muted-foreground ml-auto">
                          {getCountryCode(country)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        {errors.country && (
          <p className="text-xs text-destructive">{errors.country.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <div className="flex items-center px-3 py-2 border rounded-md bg-muted/50 text-sm">
            {selectedCountry}
          </div>
          {loadingCountries ? (
            <Skeleton className="h-10 flex-1" />
          ) : (
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  id="phone"
                  type="tel"
                  placeholder="1234567890"
                  value={field.value}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    field.onChange(digits);
                    setPhoneNumber(digits);
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSubmit(onSubmit)()
                  }
                  className="flex-1"
                />
              )}
            />
          )}
        </div>
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button
        type="submit"
        disabled={!!isLoading || loadingCountries}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Send OTP"
        )}
      </Button>
    </form>
  );
}
