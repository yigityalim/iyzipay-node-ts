"use client";

import { buttonVariants } from "fumadocs-ui/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "fumadocs-ui/components/ui/popover";
import { Check, Copy, Share, Sparkles } from "lucide-react";
import * as React from "react";

type Props = {
	url: string;
	lang: string;
	title?: string;
};

export function ShareButton({ url, lang, title }: Props) {
	const [copied, setCopied] = React.useState(false);
	const [open, setOpen] = React.useState(false);

	const fullUrl =
		typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

	const markdown = `[${title ?? "Blog Post"}](${fullUrl})`;

	async function copyMarkdown() {
		try {
			await navigator.clipboard.writeText(markdown);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		} finally {
			setOpen(false);
		}
	}

	async function copyUrl() {
		try {
			await navigator.clipboard.writeText(fullUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		} finally {
			setOpen(false);
		}
	}

	function askAI(type: "chatgpt" | "claude" | "gemini") {
		const prompt = encodeURIComponent(
			lang === "tr"
				? `Bu yazıyı incele ve özetle:\n${fullUrl}`
				: `Analyze and summarize this article:\n${fullUrl}`,
		);

		const urls = {
			chatgpt: `https://chat.openai.com/?q=${prompt}`,
			claude: `https://claude.ai/new?q=${prompt}`,
			gemini: `https://gemini.google.com/app?q=${prompt}`,
		};

		window.open(urls[type], "_blank");
		setOpen(false);
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={buttonVariants({ variant: "primary", size: "sm" })}
				>
					{copied ? <Check className="size-4" /> : <Share className="size-4" />}
					{copied
						? lang === "tr"
							? "Kopyalandı"
							: "Copied"
						: lang === "tr"
							? "Paylaş"
							: "Share"}
				</button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-56 p-1">
				<div className="flex flex-col gap-0.5">
					<button
						type="button"
						onClick={copyUrl}
						className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors text-left"
					>
						<Copy className="size-4" />
						{lang === "tr" ? "URL Kopyala" : "Copy URL"}
					</button>
					<button
						type="button"
						onClick={copyMarkdown}
						className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors text-left"
					>
						<Copy className="size-4" />
						{lang === "tr" ? "Markdown Kopyala" : "Copy as Markdown"}
					</button>
					<button
						type="button"
						onClick={() => askAI("chatgpt")}
						className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors text-left"
					>
						<Sparkles className="size-4" />
						{lang === "tr" ? "ChatGPT'ye Sor" : "Ask ChatGPT"}
					</button>
					<button
						type="button"
						onClick={() => askAI("claude")}
						className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors text-left"
					>
						<Sparkles className="size-4" />
						{lang === "tr" ? "Claude'a Sor" : "Ask Claude"}
					</button>
					<button
						type="button"
						onClick={() => askAI("gemini")}
						className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors text-left"
					>
						<Sparkles className="size-4" />
						{lang === "tr" ? "Gemini'ye Sor" : "Ask Gemini"}
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
