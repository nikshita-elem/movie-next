"use client";

import { deleteCookie } from "cookies-next";
import Link from "next/link";
import React, { useCallback } from "react";
import Languages from "./Languages";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation"; 

const Header: React.FC = () => {
  const t = useTranslations("Movie");
  const router = useRouter();

  // Logout handler using useCallback to prevent unnecessary re-creations
  const handleLogout = useCallback(() => {
    try {
      deleteCookie("token");
      router.push("/sign-in"); // Client-side navigation without full reload
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl py-20 ps-3 pe-3">
        <div className="flex justify-between items-center">
          {/* Left Section: Title and Add Button */}
          <div className="flex items-center space-x-4">
            <h2 className="heading-two">{t("My Movies")}</h2>
            <Link href="/add" className="flex items-center">
              <Image
                src="/plus.svg"
                width={32}
                height={32}
                alt={t("Add a new movie")}
              />
            </Link>
          </div>

          {/* Right Section: Languages and Logout */}
          <div className="flex">
            <Languages />
            <button
              onClick={handleLogout}
              className="flex items-center cursor-pointer space-x-2"
              aria-label={t("logout")}
            >
              <span className="body-regular hidden md:inline">
                {t("logout")}
              </span>
              <Image
                src="/logout.svg"
                width={32}
                height={32}
                alt={t("logout")}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
