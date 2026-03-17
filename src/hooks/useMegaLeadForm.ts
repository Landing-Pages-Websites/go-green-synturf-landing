"use client";

import { useState, useCallback } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  needsType: string;
  message?: string;
}

export function useMegaLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Get attribution params from sessionStorage
      const attribution: Record<string, string> = {};
      if (typeof window !== "undefined") {
        const storedParams = sessionStorage.getItem("landing_params");
        if (storedParams) {
          const urlParams = new URLSearchParams(storedParams);
          for (const [key, value] of urlParams.entries()) {
            attribution[key] = value;
          }
        }
      }

      const payload = {
        site_id: "SITE_ID_PLACEHOLDER",
        customer_id: "CUSTOMER_ID_PLACEHOLDER",
        form_data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          needsType: formData.needsType,
          message: formData.message || ""
        },
        page_url: typeof window !== "undefined" ? window.location.href : "",
        attribution
      };

      const response = await fetch("https://analytics.gomega.ai/submission/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Submit failed: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Form submission error:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submit, isSubmitting };
}