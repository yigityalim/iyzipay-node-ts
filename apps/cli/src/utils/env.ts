import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

export function createEnvFile(
	apiKey: string,
	secretKey: string,
	baseUrl: string,
) {
	const envPath = path.join(process.cwd(), ".env");

	const content = `
# Iyzipay Configuration
IYZIPAY_API_KEY=${apiKey}
IYZIPAY_SECRET_KEY=${secretKey}
IYZIPAY_BASE_URL=${baseUrl}
`.trim();

	if (fs.existsSync(envPath)) {
		console.log(
			chalk.yellow("⚠️  .env file already exists. Appending config..."),
		);
		fs.appendFileSync(envPath, "\n" + content);
	} else {
		fs.writeFileSync(envPath, content);
		console.log(chalk.green("✅ .env file created successfully."));
	}
}
