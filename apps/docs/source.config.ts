import {
	defineCollections,
	defineConfig,
	defineDocs,
	frontmatterSchema,
	metaSchema,
} from "fumadocs-mdx/config";
import jsonSchema from "fumadocs-mdx/plugins/json-schema";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";

export const docs = defineDocs({
	docs: {
		schema: frontmatterSchema.extend({
			preview: z.string().optional(),
			index: z.boolean().default(false),
			/**
			 * API routes only
			 */
			method: z.string().optional(),
		}),
		postprocess: {
			includeProcessedMarkdown: true,
			extractLinkReferences: true,
		},
		async: true,
	},
	meta: {
		schema: metaSchema.extend({
			description: z.string().optional(),
		}),
	},
});

export const blog = defineCollections({
	type: "doc",
	dir: "content/blog",
	schema: frontmatterSchema.extend({
		author: z.string(),
		date: z.string().date().or(z.date()),
		banner: z.string().optional(),
	}),
	async: true,
});

export default defineConfig({
	plugins: [
		jsonSchema({
			insert: true,
		}),
		lastModified(),
	],
});
