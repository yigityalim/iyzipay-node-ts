import chalk from "chalk";
import dotenv from "dotenv";
import { iyzipay } from "iyzipay-node-ts";
import ora from "ora";

export async function whoamiCommand() {
	dotenv.config();

	console.log(chalk.bold.blue("\n🕵️  Iyzipay Configuration Status\n"));

	const apiKey = process.env.IYZIPAY_API_KEY;
	const baseUrl =
		process.env.IYZIPAY_BASE_URL || "https://sandbox-api.iyzipay.com";
	const isSandbox = baseUrl.includes("sandbox");

	if (!apiKey) {
		console.log(chalk.red("❌ API Key not found!"));
		console.log(`Run ${chalk.cyan("iyzi init")} to configure your project.`);
		return;
	}

	// 1. Maskelenmiş Bilgiler
	const maskedKey =
		apiKey.length > 8
			? `${apiKey.substring(0, 4)}••••••••${apiKey.substring(apiKey.length - 4)}`
			: "Invalid Key";

	console.log(
		`🌍 Environment:  ${isSandbox ? chalk.yellow("🚧 SANDBOX") : chalk.green("🚀 PRODUCTION")}`,
	);
	console.log(`🔑 API Key:      ${chalk.white(maskedKey)}`);
	console.log(`🔗 Base URL:     ${chalk.gray(baseUrl)}`);

	// 2. Bağlantı Testi (Ping)
	const spinner = ora("Testing connectivity to Iyzico API...").start();
	const startTime = Date.now();

	const client = iyzipay({
		apiKey: process.env.IYZIPAY_API_KEY!,
		secretKey: process.env.IYZIPAY_SECRET_KEY!,
		baseUrl: baseUrl,
	});

	try {
		// Hafif bir istek atıyoruz (Installment check en hafifi)
		// Var olmayan bir BIN ile bile sorgulasak 200 dönerse bağlantı var demektir.
		await client.installment.retrieve({
			binNumber: "552608",
			price: "1.0",
			locale: "tr",
		});

		const duration = Date.now() - startTime;
		spinner.succeed(`Connected! (Latency: ${chalk.green(duration + "ms")})`);
	} catch (error: any) {
		spinner.fail("Connection Failed!");
		console.log(
			chalk.red(`\nError: ${error.message || "Unknown network error"}`),
		);
		if (error.code === "ENOTFOUND") {
			console.log(chalk.yellow("Check your internet connection."));
		}
	}
}
