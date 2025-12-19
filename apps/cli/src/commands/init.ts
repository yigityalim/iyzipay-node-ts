import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import { createEnvFile } from "../utils/env.js";

export async function initCommand() {
	console.log(chalk.bold.blue("\n🚀 Iyzipay CLI Setup\n"));

	const apiKey = await input({ message: "Enter your API Key:" });
	const secretKey = await input({ message: "Enter your Secret Key:" });

	const baseUrl = await select({
		message: "Select Environment:",
		choices: [
			{ name: "Sandbox (Test)", value: "https://sandbox-api.iyzipay.com" },
			{ name: "Production (Live)", value: "https://api.iyzipay.com" },
		],
	});

	const spinner = ora("Configuring project...").start();

	await new Promise((r) => setTimeout(r, 1000));

	try {
		createEnvFile(apiKey, secretKey, baseUrl);
		spinner.succeed("Project configured! You are ready to go.");
		console.log(chalk.gray(`\nTry running: ${chalk.white("npx iyzi pay")}\n`));
	} catch (error) {
		spinner.fail("Failed to create configuration.");
		console.error(error);
	}
}
