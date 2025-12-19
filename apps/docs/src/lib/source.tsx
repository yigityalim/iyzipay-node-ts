import { blog as blogPosts, docs } from "fumadocs-mdx:collections/server";
import {
	type InferPageType,
	type LoaderPlugin,
	loader,
	multiple,
} from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { openapiPlugin, openapiSource } from "fumadocs-openapi/server";
import { i18n } from "@/lib/i18n";
import { openapi } from "@/lib/openapi";

export const source = loader({
		i18n,
		source: docs.toFumadocsSource(),
		baseUrl: "/docs",
		plugins: [pageTreeCodeTitles(), lucideIconsPlugin(), openapiPlugin()],
	});




function pageTreeCodeTitles(): LoaderPlugin {
	return {
		transformPageTree: {
			file(node) {
				if (
					typeof node.name === "string" &&
					(node.name.endsWith("()") || node.name.match(/^<\w+ \/>$/))
				) {
					return {
						...node,
						name: <code className="text-[0.8125rem]">{node.name}</code>,
					};
				}
				return node;
			},
		},
	};
}

export const blog = loader({
	i18n,
	baseUrl: '/blog',
	source: toFumadocsSource(blogPosts, []),
});