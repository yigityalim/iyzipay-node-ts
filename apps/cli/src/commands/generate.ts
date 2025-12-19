import fs from "node:fs";
import path from "node:path";
import { select } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import { SHADCN_TEMPLATE, TAILWIND_TEMPLATE } from "../templates/checkout.js";

export async function generateCommand() {
	console.log(chalk.bold.cyan("\n🏗️  Iyzipay Component Generator\n"));

	const componentType = await select({
		message: "What do you want to generate?",
		choices: [
			{ name: "💳 Checkout Form (React Hook Form + Zod)", value: "checkout" },
		],
	});

	const style = await select({
		message: "Select Styling Framework:",
		choices: [
			{ name: "Shadcn UI (Requires @/components/ui)", value: "shadcn" },
			{ name: "Pure Tailwind CSS", value: "tailwind" },
		],
	});

	const spinner = ora("Scaffolding component...").start();

	// 1. Klasör Kontrolü
	const targetDir = path.join(process.cwd(), "components");
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}

	// 2. Dosya Adı ve İçerik
	const fileName = "payment-form.tsx";
	const filePath = path.join(targetDir, fileName);
	const content = style === "shadcn" ? SHADCN_TEMPLATE : TAILWIND_TEMPLATE;

	// 3. Yaz
	try {
		fs.writeFileSync(filePath, content.trim());
		spinner.succeed(
			`Generated: ${chalk.bold("components/iyzipay-ui/payment-form.tsx")}`,
		);

		console.log(chalk.green("\n✅ Success! Next steps:"));
		console.log(chalk.gray("1. Install dependencies:"));
		console.log(
			chalk.white("   pnpm add react-hook-form @hookform/resolvers zod"),
		);
		console.log(chalk.gray("2. Import and use:"));
		console.log(
			chalk.white(
				`   import { PaymentForm } from '@/components/iyzipay-ui/payment-form';`,
			),
		);
	} catch (error) {
		spinner.fail("Failed to generate component.");
		console.error(error);
	}
}
