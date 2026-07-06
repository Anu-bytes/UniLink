"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./config";
import { getMessages, type Messages } from "./messages";

type IntlValue = { locale: Locale; m: Messages; dir: "ltr" | "rtl" };

const IntlContext = createContext<IntlValue | null>(null);

export function IntlProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value: IntlValue = {
    locale,
    m: getMessages(locale),
    dir: locale === "ar" ? "rtl" : "ltr",
  };
  return <IntlContext.Provider value={value}>{children}</IntlContext.Provider>;
}

export function useIntl(): IntlValue {
  const ctx = useContext(IntlContext);
  if (!ctx) throw new Error("useIntl must be used within an IntlProvider");
  return ctx;
}
