"use client";

import { cva } from "class-variance-authority";
import { cn } from "fumadocs-ui/utils/cn";
import { ArrowRight, TerminalIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
	type ComponentProps,
	Fragment,
	type HTMLAttributes,
	type ReactElement,
	type ReactNode,
	type RefObject,
	useEffect,
	useRef,
	useState,
} from "react";

const GrainGradient = dynamic(
	() => import("@paper-design/shaders-react").then((mod) => mod.GrainGradient),
	{
		ssr: false,
	},
);

const Dithering = dynamic(
	() => import("@paper-design/shaders-react").then((mod) => mod.Dithering),
	{
		ssr: false,
	},
);

export function Hero() {
	const { resolvedTheme } = useTheme();
	const [showShaders, setShowShaders] = useState(false);

	useEffect(() => {
		// apply some delay, otherwise on slower devices, it errors with uniform images not being fully loaded.
		setTimeout(() => {
			setShowShaders(true);
		}, 400);
	}, []);

	return (
		<>
			{showShaders && (
				<GrainGradient
					className="absolute inset-0 animate-fd-fade-in duration-800"
					colors={
						resolvedTheme === "dark"
							? ["#39BE1C", "#9c2f05", "#7A2A0000"]
							: ["#fcfc51", "#ffa057", "#7A2A0020"]
					}
					colorBack="#00000000"
					softness={1}
					intensity={0.9}
					noise={0.5}
					speed={1}
					shape="corners"
					minPixelRatio={1}
					maxPixelCount={1920 * 1080}
				/>
			)}
			{showShaders && false && (
				<Dithering
					width={720}
					height={720}
					colorBack="#00000000"
					colorFront={resolvedTheme === "dark" ? "#DF3F00" : "#fa8023"}
					shape="sphere"
					type="4x4"
					scale={0.5}
					size={3}
					speed={0}
					frame={5000 * 120}
					className="absolute animate-fd-fade-in duration-400 max-lg:bottom-[-50%] max-lg:left-[-200px] lg:top-[-5%] lg:right-0"
					minPixelRatio={1}
				/>
			)}
		</>
	);
}

export function CreateAppAnimation() {
	// Kept as a placeholder or for potential reuse if we add an NPM install animation
	return null;
}

const WritingTabs = [
	{
		name: "Functional",
		value: "functional",
	},
	{
		name: "Class Based",
		value: "class-based",
	},
	{
		name: "Utilities",
		value: "utilities",
	},
] as const;

export function Writing({
	tabs: tabContents,
}: {
	tabs: Record<(typeof WritingTabs)[number]["value"], ReactNode>;
}) {
	const [tab, setTab] =
		useState<(typeof WritingTabs)[number]["value"]>("functional");

	return (
		<div className="col-span-full my-20">
			<h2 className="text-4xl text-brand mb-8 text-center font-medium tracking-tight">
				Flexible Integration.
			</h2>
			<p className="text-center mb-8 mx-auto w-full max-w-[800px]">
				Choose the style that fits your project. Functional for tree-shaking,
				Class-based for object-oriented patterns, or mix and match with
				utilities.
			</p>
			<div className="flex justify-center items-center gap-4 text-fd-muted-foreground mb-6">
				{WritingTabs.map((item) => (
					<Fragment key={item.value}>
						<ArrowRight className="size-4 first:hidden" />
						<button
							className={cn(
								"text-lg font-medium transition-colors",
								item.value === tab && "text-brand",
							)}
							onClick={() => setTab(item.value)}
						>
							{item.name}
						</button>
					</Fragment>
				))}
			</div>
			{Object.entries(tabContents).map(([key, value]) => (
				<div
					key={key}
					aria-hidden={key !== tab}
					className={cn("animate-fd-fade-in", key !== tab && "hidden")}
				>
					{value}
				</div>
			))}
		</div>
	);
}

export function AgnosticBackground() {
	const { resolvedTheme } = useTheme();
	const ref = useRef<HTMLDivElement>(null);
	const visible = useIsVisible(ref);

	return (
		<div
			ref={ref}
			className="absolute inset-0 -z-1 mask-[linear-gradient(to_top,white_30%,transparent_calc(100%-120px))]"
		>
			<Dithering
				colorBack="#00000000"
				colorFront={resolvedTheme === "dark" ? "#fc7744" : "#c6bb58"}
				shape="warp"
				type="4x4"
				speed={visible ? 0.4 : 0}
				className="size-full"
				minPixelRatio={1}
			/>
		</div>
	);
}

export function ContentAdoptionBackground(
	props: ComponentProps<typeof GrainGradient>,
) {
	const { resolvedTheme } = useTheme();

	return (
		<GrainGradient
			colors={
				resolvedTheme === "dark"
					? ["#39BE1C", "#9c2f05", "#7A2A0000"]
					: ["#DF3F00", "#fcfc51", "#ffa057", "#7A2A0020"]
			}
			speed={0}
			colorBack="#1D1004"
			shape="sphere"
			{...props}
		/>
	);
}

let observer: IntersectionObserver;
const observerTargets = new WeakMap<
	Element,
	(entry: IntersectionObserverEntry) => void
>();

function useIsVisible(ref: RefObject<HTMLElement | null>) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		observer ??= new IntersectionObserver((entries) => {
			for (const entry of entries) {
				observerTargets.get(entry.target)?.(entry);
			}
		});

		const element = ref.current;
		if (!element) return;
		observerTargets.set(element, (entry) => {
			setVisible(entry.isIntersecting);
		});
		observer.observe(element);

		return () => {
			observer.unobserve(element);
			observerTargets.delete(element);
		};
	}, [ref]);

	return visible;
}
