import { cva } from "class-variance-authority";
import { cn } from "fumadocs-ui/utils/cn";
import {
	BatteryChargingIcon,
	Code2Icon,
	FileTextIcon,
	GlobeIcon,
	LayoutTemplateIcon,
	ShieldCheckIcon,
	TerminalIcon,
	ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	AgnosticBackground,
	ContentAdoptionBackground,
	CreateAppAnimation,
	Hero,
	Writing,
} from "@/app/[lang]/(home)/page.client";
import { CodeBlock } from "@/components/code-block";
import { Marquee } from "./marquee";

const headingVariants = cva("font-medium tracking-tight", {
	variants: {
		variant: {
			h2: "text-3xl lg:text-4xl",
			h3: "text-xl lg:text-2xl",
		},
	},
});

const buttonVariants = cva(
	"inline-flex justify-center px-5 py-3 rounded-full font-medium tracking-tight transition-colors",
	{
		variants: {
			variant: {
				primary: "bg-brand text-brand-foreground hover:bg-brand-200",
				secondary:
					"border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent",
			},
		},
		defaultVariants: {
			variant: "primary",
		},
	},
);

const cardVariants = cva("rounded-2xl text-sm p-6 bg-origin-border shadow-lg", {
	variants: {
		variant: {
			secondary: "bg-brand-secondary text-brand-secondary-foreground",
			default: "border bg-fd-card",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export default function Page() {
	return (
		<main className="text-landing-foreground md:pt-4 pb-6 dark:text-landing-foreground-dark md:pb-12">
			<div className="relative flex min-h-[600px] h-[70vh] max-h-[900px] border md:rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-origin-border">
				<Hero />
				<div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
					<p className="mt-12 text-xs text-brand font-medium rounded-full p-2 border border-brand/50 w-fit">
						The Modern Node.js SDK for Iyzico
					</p>
					<h1 className="text-4xl my-8 leading-tighter font-medium xl:text-5xl xl:mb-12">
						Experience payments
						<br className="md:hidden" /> with confidence,
						<br />
						<span className="text-brand">Type-Safe</span> &{" "}
						<span className="text-brand">Edge Ready</span>.
					</h1>
					<div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
						<Link
							href="/docs/sdk"
							className={cn(buttonVariants(), "max-sm:text-sm")}
						>
							Get Started
						</Link>
						<a
							href="https://github.com/YigitYalim/iyzipay-node-ts"
							target="_blank"
							rel="noreferrer noopener"
							className={cn(
								buttonVariants({ variant: "secondary" }),
								"max-sm:text-sm",
							)}
						>
							View on GitHub
						</a>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2">
				<p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
					<span className="text-brand font-medium">iyzipay-node-ts</span> is
					reimagining the payment integration experience.{" "}
					<span className="text-brand font-medium">Fully Typed</span>,{" "}
					<span className="text-brand font-medium">Functional</span>, and{" "}
					designed for the{" "}
					<span className="text-brand font-medium">Modern Web</span>. Whether
					you are on a serverless edge or a traditional Node.js server, it just
					works.
				</p>
				<div className="p-8 bg-radial-[circle_at_top_center] from-25% to-brand-secondary/50 rounded-xl col-span-full">
					<h2 className="text-xl text-center text-brand font-mono font-bold uppercase mb-2">
						Install via NPM
					</h2>
					<CodeBlock
						code="npm install iyzipay-node-ts"
						lang="bash"
						wrapper={{
							className: "mx-auto w-full max-w-[800px]",
						}}
					/>
				</div>
				<Features />
				<SdkAdvantages />
				<IntegrationExamples />
				<EnvironmentSupport />
				<CommunitySection />
			</div>
		</main>
	);
}

function Features() {
	return (
		<>
			<div
				className={cn(
					cardVariants({
						variant: "secondary",
						className: "flex items-center justify-center p-0",
					}),
				)}
			>
				{/* Visual placeholder, maybe an illustration of types or speed later */}
				<div className="p-12 text-center text-brand-secondary-foreground/50 font-mono text-sm">
					Edge Compatible & Type Safe
				</div>
			</div>
			<div className={cn(cardVariants(), "flex flex-col")}>
				<h3
					className={cn(headingVariants({ variant: "h3", className: "mb-6" }))}
				>
					Strictly Typed with Zod.
				</h3>
				<p className="mb-4">
					Every request and response is validated. No more guessing what the API
					returns. We use Zod to ensure runtime safety and TypeScript for
					excellent DX.
				</p>
				<p className="mb-4">Catch errors before they happen in production.</p>
				<CodeBlock
					code={`const request = {
  price: "0.3", // Type error!
  currency: Currency.TRY
};`}
					lang="typescript"
				/>
			</div>
		</>
	);
}

function IntegrationExamples() {
	return (
		<Writing
			tabs={{
				functional: (
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
						<CodeBlock
							code={`import { createClient } from "iyzipay-node-ts";

const client = createClient({
  apiKey: process.env.API_KEY,
  secretKey: process.env.SECRET_KEY,
  baseUrl: "https://sandbox-api.iyzipay.com"
});

const result = await client.payment.retrieve({
  paymentId: "123456",
  locale: "tr"
});`}
							lang="typescript"
						/>
						<div className="max-lg:row-start-1">
							<h3
								className={cn(
									headingVariants({ variant: "h3", className: "my-4" }),
								)}
							>
								Functional API.
							</h3>
							<p>
								Modern, tree-shakeable, and functional approach. Perfect for
								granular usage.
							</p>
							<ul className="text-xs list-disc list-inside mt-8">
								<li>Lightweight client creation</li>
								<li>Tree-shakeable methods</li>
								<li>Easy to test and mock</li>
							</ul>
						</div>
					</div>
				),
				"class-based": (
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
						<CodeBlock
							code={`import { Iyzipay } from "iyzipay-node-ts";

const iyzipay = new Iyzipay({
  apiKey: process.env.API_KEY,
  secretKey: process.env.SECRET_KEY,
  baseUrl: "https://sandbox-api.iyzipay.com"
});

const result = await iyzipay.payment.create({
    // ... params
});`}
							lang="typescript"
						/>
						<div className="max-lg:row-start-1">
							<h3
								className={cn(
									headingVariants({ variant: "h3", className: "my-4" }),
								)}
							>
								Class-Based API.
							</h3>
							<p>
								Familiar OOP style for those coming from other SDKs or
								preferring class instances.
							</p>
							<ul className="text-xs list-disc list-inside mt-8">
								<li>Single instance management</li>
								<li>Grouped resources</li>
								<li>Familiar structure</li>
							</ul>
						</div>
					</div>
				),
				utilities: (
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
						<CodeBlock
							code={`import { 
  CartBuilder, 
  AddressBuilder,
  BasketItemBuilder
} from "iyzipay-node-ts/utils";

const address = new AddressBuilder()
  .contactName("John Doe")
  .city("Istanbul")
  .country("Turkey")
  .build();`}
							lang="typescript"
						/>
						<div className="max-lg:row-start-1">
							<h3
								className={cn(
									headingVariants({ variant: "h3", className: "my-4" }),
								)}
							>
								Powerful Utilities.
							</h3>
							<p>
								Built-in builders to help you construct complex request objects
								easily.
							</p>
							<ul className="text-xs list-disc list-inside mt-8">
								<li>Fluid Builder Pattern</li>
								<li>Type-safe construction</li>
								<li>Pre-validation helpers</li>
							</ul>
						</div>
					</div>
				),
			}}
		/>
	);
}

function SdkAdvantages() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 col-span-full">
			<div className={cn(cardVariants())}>
				<ShieldCheckIcon className="size-8 text-brand mb-4" />
				<h3 className="font-semibold text-lg mb-2">Type Safety First</h3>
				<p className="text-muted-foreground text-sm">
					Built with TypeScript and Zod from the ground up. No more `any`. Enjoy
					full autocomplete and compile-time checks.
				</p>
			</div>
			<div className={cn(cardVariants())}>
				<GlobeIcon className="size-8 text-brand mb-4" />
				<h3 className="font-semibold text-lg mb-2">Edge Compatible</h3>
				<p className="text-muted-foreground text-sm">
					Runs everywhere. Vercel Edge, Cloudflare Workers, Node.js, Bun. Zero
					validation dependencies that break edge runtimes.
				</p>
			</div>
			<div className={cn(cardVariants())}>
				<ZapIcon className="size-8 text-brand mb-4" />
				<h3 className="font-semibold text-lg mb-2">Performance</h3>
				<p className="text-muted-foreground text-sm">
					Minimal runtime overhead. Functional design allows for tree-shaking,
					keeping your bundle size small.
				</p>
			</div>
		</div>
	);
}

function EnvironmentSupport() {
	return (
		<>
			<h2
				className={cn(
					headingVariants({
						variant: "h2",
						className: "text-brand text-center mb-4 col-span-full mt-12",
					}),
				)}
			>
				Built for Modern Stack.
			</h2>

			<div
				className={cn(
					cardVariants(),
					"relative flex flex-col overflow-hidden z-2 min-h-[300px]",
				)}
			>
				<h3
					className={cn(
						headingVariants({
							variant: "h3",
							className: "mb-6",
						}),
					)}
				>
					Framework Agnostic
				</h3>
				<p className="mb-20">
					Whether you use Next.js, Remix, Nuxt, or plain Node.js express apps,
					iyzipay-node-ts integrates seamlessly.
				</p>
				<div className="flex flex-row gap-2 mt-auto bg-brand text-brand-foreground rounded-xl p-2 w-fit">
					<TerminalIcon className="size-6" />
					<span className="font-mono font-bold">Node.js</span>
				</div>

				<AgnosticBackground />
			</div>

			<div
				className={cn(
					cardVariants(),
					"flex flex-col p-0 overflow-hidden min-h-[300px]",
				)}
			>
				<div className="p-6 mb-2">
					<h3
						className={cn(
							headingVariants({ variant: "h3", className: "mb-6" }),
						)}
					>
						Comprehensive Documentation
					</h3>
					<p className="mb-6">
						Detailed guides, API references, and copy-paste examples for every
						single endpoint.
					</p>
					<Link
						href="/docs/api-reference"
						className={cn(buttonVariants({ className: "w-fit" }))}
					>
						Browse API Info
					</Link>
				</div>
				<div className="mt-auto border-t bg-fd-muted/50 p-4">
					<div className="flex gap-2 items-center text-sm font-mono text-muted-foreground">
						<FileTextIcon className="size-4" />
						<span>/docs/payments/create</span>
					</div>
					<div className="flex gap-2 items-center text-sm font-mono text-muted-foreground mt-2">
						<Code2Icon className="size-4" />
						<span>/docs/utilities/validators</span>
					</div>
				</div>
			</div>
		</>
	);
}

function CommunitySection() {
	return (
		<ul
			className={cn(
				cardVariants({
					className: "flex flex-col gap-6 col-span-full",
				}),
			)}
		>
			<li>
				<span className="flex flex-row items-center gap-2 font-medium">
					<BatteryChargingIcon className="size-5" />
					Active Maintenance
				</span>
				<span className="mt-2 text-sm text-fd-muted-foreground">
					Regular updates to support the latest Iyzico API features.
				</span>
			</li>
			<li>
				<span className="flex flex-row items-center gap-2 font-medium">
					<LayoutTemplateIcon className="size-5" />
					Open Source
				</span>
				<span className="mt-2 text-sm text-fd-muted-foreground">
					MIT Licensed. Fork, contribute, and use freely in your commercial
					projects.
				</span>
			</li>
			<li className="flex flex-row flex-wrap gap-2 mt-auto pt-4">
				<Link href="/docs/sdk" className={cn(buttonVariants())}>
					Read the Docs
				</Link>
				<a
					href="https://github.com/YigitYalim/iyzipay-node-ts"
					rel="noreferrer noopener"
					className={cn(
						buttonVariants({
							variant: "secondary",
						}),
					)}
				>
					Star on GitHub
				</a>
			</li>
		</ul>
	);
}
