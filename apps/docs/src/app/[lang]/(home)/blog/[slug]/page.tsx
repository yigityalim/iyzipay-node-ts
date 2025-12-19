import path from "node:path";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { cn } from "fumadocs-ui/utils/cn";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blog } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { ShareButton } from "./page.client";

export default async function Page(props: PageProps<"/[lang]/blog/[slug]">) {
	const params = await props.params;

	const page = blog.getPage([params.slug], params.lang);

	if (!page) notFound();
	const { body: Mdx, toc } = await page.data.load();

	return (
		<article className="flex flex-col mx-auto w-full max-w-xl lg:max-w-3xl xl:max-w-5xl px-4 py-8">
			<div className="flex flex-row gap-4 text-sm mb-8 relative">
				<div>
					<p className="mb-1 text-fd-muted-foreground">Written by</p>
					<p className="font-medium">{page.data.author}</p>
				</div>
				<div>
					<p className="mb-1 text-sm text-fd-muted-foreground">At</p>
					<p className="font-medium">
						{new Date(
							page.data.date ??
								path.basename(page.path, path.extname(page.path)),
						).toDateString()}
					</p>
				</div>
			</div>

			<h1 className="text-3xl font-semibold mb-4">{page.data.title}</h1>
			<p className="text-fd-muted-foreground mb-8">{page.data.description}</p>

			<div className="prose min-w-0 flex-1">
				<div className="flex flex-row gap-2 mb-8 not-prose">
					<ShareButton
						url={page.url}
						lang={params.lang}
						title={page.data.title}
					/>
					<Link
						href="/blog"
						className={cn(
							buttonVariants({
								size: "sm",
								variant: "secondary",
							}),
						)}
					>
						{params.lang === "tr" ? "Geri" : "Back"}
					</Link>
				</div>

				<InlineTOC items={toc} className="mb-4">
					{params.lang === "tr" ? "İçindekiler" : "Table of Contents"}
				</InlineTOC>
				<Mdx components={getMDXComponents()} />
			</div>
		</article>
	);
}

export async function generateMetadata(
	props: PageProps<"/[lang]/blog/[slug]">,
): Promise<Metadata> {
	const params = await props.params;
	const page = blog.getPage([params.slug]);

	if (!page) notFound();

	return {
		title: page.data.title,
		description:
			page.data.description ?? "The library for building documentation sites",
	};
}

export function generateStaticParams(): { slug: string }[] {
	return blog.getPages().map((page) => ({
		slug: page.slugs[0],
	}));
}
