"use client";

import { useRouter } from "next/navigation";
import React, { ChangeEvent, useTransition, useCallback } from "react";
import { useLocale } from "use-intl";

interface LanguageOption {
  value: string;
  label: string;
}

const languageOptions: LanguageOption[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
];

const Languages: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentLocale = useLocale();

  /**
   * Handles the change event for the language selector.
   * Uses useCallback to memoize the function and prevent unnecessary re-creations.
   */
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextLocale = event.target.value;
      startTransition(() => {
        // Navigate to the new locale's root, replacing the current path
        router.replace(`/${nextLocale}`);
      });
    },
    [router]
  );

  return (
    <div>
      <label htmlFor="language-select" className="sr-only">
        Select Language
      </label>
      <select
        className="flex justify-center appearance-none bg body-small px-3 py-1 rounded-md mr-3 border border-white"
        id="language-select"
        value={currentLocale}
        onChange={handleChange}
        disabled={isPending}
        aria-label="Language selector"
      >
        {languageOptions.map(({ value, label }) => (
          <option key={value} value={value} className="body-small">
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Wrap the component with React.memo to prevent unnecessary re-renders
export default React.memo(Languages);
