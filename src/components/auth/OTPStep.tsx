"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader as Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface OTPStepProps {
  otp: string;
  setOtp: (value: string) => void;
  error?: string;
  isLoading?: boolean;
  onVerify: () => void;
  onBack: () => void;
  label?: string;
}

const OtpSchema = z.object({
  code: z
    .string()
    .min(6, "Enter 6 digits")
    .max(6, "Enter 6 digits")
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export default function OTPStep({
  otp,
  setOtp,
  error,
  isLoading,
  onVerify,
  onBack,
  label = "Enter OTP",
}: OTPStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ code: string }>({
    resolver: zodResolver(OtpSchema),
    mode: "onChange",
    defaultValues: { code: otp },
  });

  const onSubmit = () => {
    onVerify();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center mb-2">
        <h2 className="text-xl font-semibold">{label}</h2>
      </div>

      <div className="flex justify-center">
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              autoFocus
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                setOtp(val);
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />
      </div>

      {errors.code && (
        <p className="text-sm text-destructive text-center">
          {errors.code.message}
        </p>
      )}
      {error ? (
        <p className="text-sm text-destructive text-center">{error}</p>
      ) : null}

      <Button type="submit" disabled={!!isLoading} className="w-full" size="lg">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </Button>

      <Button variant="ghost" onClick={onBack} className="w-full">
        Change phone number
      </Button>
    </form>
  );
}
