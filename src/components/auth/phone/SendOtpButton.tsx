"use client";

import { Button } from "@/components/ui/button";
import { Loader as Loader2 } from "lucide-react";

export function SendOtpButton(props: { isLoading?: boolean; loadingCountries?: boolean }) {
  const { isLoading, loadingCountries } = props;
  return (
    <Button type="submit" disabled={!!isLoading || !!loadingCountries} className="w-full" size="lg">
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Sending...
        </>
      ) : (
        "Send OTP"
      )}
    </Button>
  );
}
