import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/next";
import "../global.css";
import { cn } from "fumadocs-ui/utils/cn";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { i18n } from "@/lib/i18n";
import { Body } from "../layout.client";

const { provider } = defineI18nUI(i18n, {
	translations: {
		en: {
			displayName: "English",
		},
		tr: {
			displayName: "Türkçe",
			search: "Ara",
		},
	},
});

const geist = Geist({
	variable: "--font-sans",
	subsets: ["latin"],
});

const mono = Geist_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
});

export const viewport = {
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 1,
	userScalable: false,
} satisfies Viewport;

export default async function Layout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const lang = (await params).lang;

	return (
		<html
			lang={lang}
			className={cn(geist.className, mono.className)}
			suppressHydrationWarning
		>
			<Body>
				<RootProvider i18n={provider(lang)}>{children}</RootProvider>
			</Body>
		</html>
	);
}
