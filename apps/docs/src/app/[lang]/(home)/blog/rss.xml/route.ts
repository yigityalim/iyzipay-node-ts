import { Feed } from "feed";
import { NextResponse } from "next/server";
import { blog } from "@/lib/source";

export const revalidate = false;

const baseUrl = "https://iyzipay-node.mehmetyigityalim.com";

export function GET() {
	const feed = new Feed({
		title: "Iyzipay Node",
		id: `${baseUrl}/blog`,
		link: `${baseUrl}/blog`,
		language: "en",

		image: `${baseUrl}/banner.png`,
		favicon: `${baseUrl}/icon.png`,
		copyright: "All rights reserved 2025, Mehmet Yigityalim",
	});

	for (const page of blog.getPages().sort((a, b) => {
		return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
	})) {
		feed.addItem({
			id: page.url,
			title: page.data.title,
			description: page.data.description,
			link: `${baseUrl}${page.url}`,
			date: new Date(page.data.date),

			author: [
				{
					name: page.data.author,
				},
			],
		});
	}

	return new NextResponse(feed.rss2());
}
