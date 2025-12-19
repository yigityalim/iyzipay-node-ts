import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default async function Layout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const lang = (await params).lang;
	const base = baseOptions(lang);

	return (
		<DocsLayout
			{...base}
			tree={source.getPageTree(lang as any)}
			links={linkItems.filter((item) => item.type === "icon")}
			sidebar={{
				tabs: {
					transform(option, node) {
						const meta = source.getNodeMeta(node);
						if (!meta || !node.icon) return option;

						const color = `var(--${meta.path.split("/")[0]}-color, var(--color-fd-foreground))`;
						return {
							...option,
							icon: (
								<div
									className="[&_svg]:size-full rounded-lg size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
									style={
										{
											"--tab-color": color,
										} as object
									}
								>
									{node.icon}
								</div>
							),
						};
					},
				},
			}}
		>
			{children}
		</DocsLayout>
	);
}
