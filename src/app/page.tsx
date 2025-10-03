"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import Header from "@/components/auth/Header";
import PhoneStep from "@/components/auth/PhoneStep";
import OTPStep from "@/components/auth/OTPStep";
import type { Country } from "@/types/country";
import { validatePhone } from "@/lib/phone-validation";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import type { RootState } from "@/store";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthed = useAppSelector((s: RootState) => s.auth.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCountriesLoading(true);
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,cca2,flags")
      .then((res) => res.json())
      .then((data: Country[]) => {
        const sorted = data
          .filter((c) => c.idd?.root)
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sorted);
      })
      .catch(() => toast.error("Failed to load countries"))
      .finally(() => setCountriesLoading(false));
  }, []);
  
  useEffect(() => {
    if (isAuthed) {
      router.replace("/dashboard");
    }
  }, [isAuthed, router]);

  if (mounted && isAuthed) {
    return <div className="min-h-screen" />;
  }

  const handleSendOTP = () => {
    setError("");
    const validation = validatePhone(selectedCountry, phoneNumber);
    if (!validation.valid) {
      setError(validation.message || "Please enter a valid phone number");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    }, 1500);
  };

  const handleVerifyOTP = () => {
    setError("");
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Login successful!");
      dispatch(
        login({ id: "user_1", phone: `${selectedCountry}${phoneNumber}` }),
      );
      router.push("/dashboard");
    }, 1500);
  };

  const getCountryCode = (country: Country) => {
    const root = country.idd.root;
    const suffix = country.idd.suffixes?.[0] || "";
    return `${root}${suffix}`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Header />

        <div className="bg-card border rounded-2xl p-8 shadow-lg">
          <AnimatePresence mode="wait">
            {!otpSent ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <PhoneStep
                  countries={countries}
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  error={error}
                  onSend={handleSendOTP}
                  isLoading={isLoading || countriesLoading}
                  loadingCountries={countriesLoading}
                  getCountryCode={getCountryCode}
                />
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <OTPStep
                  otp={otp}
                  setOtp={setOtp}
                  error={error}
                  isLoading={isLoading}
                  onVerify={handleVerifyOTP}
                  onBack={() => {
                    setOtpSent(false);
                    setOtp("");
                    setError("");
                  }}
                  label={`Enter OTP (Sent to ${selectedCountry} ${phoneNumber})`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
