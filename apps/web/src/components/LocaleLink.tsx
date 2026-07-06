"use client";

import Link from "next/link";
import { useIntl } from "@/i18n/provider";
import { href as localizedHref } from "@/i18n/config";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & { href: string };

/** A Next <Link> that automatically prefixes the active locale. */
export function LocaleLink({ href, ...rest }: Props) {
  const { locale } = useIntl();
  return <Link href={localizedHref(locale, href)} {...rest} />;
}
