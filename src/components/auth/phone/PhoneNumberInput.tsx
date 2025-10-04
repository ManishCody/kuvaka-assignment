"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { PhoneForm } from "@/components/auth/hooks/usePhoneForm";
import { useCallback } from "react";

export function PhoneNumberInput(props: {
  control: Control<PhoneForm>;
  errors: FieldErrors<PhoneForm>;
  loadingCountries: boolean;
  selectedCountry: string;
  setPhoneNumber: (v: string) => void;
  onEnter: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { control, errors, loadingCountries, selectedCountry, setPhoneNumber, onEnter, inputRef } = props;

  const handleDigits = useCallback((val: string) => val.replace(/\D/g, ""), []);

  return (
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
                  const digits = handleDigits(e.target.value);
                  field.onChange(digits);
                  setPhoneNumber(digits);
                }}
                onKeyDown={(e) => e.key === "Enter" && onEnter()}
                className="flex-1"
                ref={(el) => {
                  inputRef.current = el;
                  (field.ref as (instance: HTMLInputElement | null) => void)(el);
                }}
                autoFocus
              />
            )}
          />
        )}
      </div>
      {errors.phone && (
        <p className="text-xs text-destructive">{String(errors.phone.message)}</p>
      )}
    </div>
  );
}

