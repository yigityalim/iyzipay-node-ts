import { PathUtils } from "fumadocs-core/source";
import Image from "next/image";
import Link from "next/link";
import { blog } from "@/lib/source";
import BannerImage from "./banner.png";

function getName(path: string) {
	return PathUtils.basename(path, PathUtils.extname(path));
}

export default async function Page(props: PageProps<"/[lang]/blog">) {
	const params = await props.params;

	console.log(blog.getPages());
	const posts = [...blog.getPages(params.lang)].sort(
		(a, b) =>
			new Date(b.data.date ?? getName(b.path)).getTime() -
			new Date(a.data.date ?? getName(a.path)).getTime(),
	);

	return (
		<main className="mx-auto w-full max-w-page md:px-4 pb-12 md:py-12">
			<div className="relative dark mb-4 md:aspect-[3.2] aspect-[1] p-8 z-2 md:p-12">
				<Image
					src={BannerImage}
					priority
					alt="banner"
					className="absolute inset-0 size-full -z-1 object-cover"
				/>
				<div className="absolute inset-0 flex flex-col items-center justify-center z-1">
					<h1 className="mb-4 text-3xl lg:text-4xl text-landing-foreground font-mono font-bold">
						İyzipay Blog
					</h1>
					<p className="text-sm lg:text-base font-mono text-landing-foreground-200">
						Latest announcements of İyzipay.
					</p>
				</div>
			</div>
			<div className="px-4 md:px-0 grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-4">
				{posts.map((post) => (
					<Link
						key={post.url}
						href={post.url}
						className="flex flex-col bg-fd-card rounded-2xl border shadow-sm overflow-hidden transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
					>
						{post.data.banner && (
							<div className="relative w-full aspect-video">
								<Image
									src={`/blog-images/${post.data.banner}`}
									fill
									alt={post.data.title}
									className="object-cover"
								/>
							</div>
						)}
						<div className="p-4 flex flex-col flex-1">
							<p className="font-medium">{post.data.title}</p>
							<p className="text-sm text-fd-muted-foreground">
								{post.data.description}
							</p>

							<p className="mt-auto pt-4 text-xs lg:text-sm text-brand">
								{new Date(post.data.date ?? getName(post.path)).toDateString()}
							</p>
						</div>
					</Link>
				))}
			</div>
		</main>
	);
}
