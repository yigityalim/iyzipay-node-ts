import chalk from "chalk";
import Table from "cli-table3";
import dotenv from "dotenv";
import { iyzipay } from "iyzipay-node-ts";
import ora from "ora";

export async function checkInstallments(
	price: string,
	options: { bin: string },
) {
	dotenv.config();

	if (!process.env.IYZIPAY_API_KEY) {
		console.log(chalk.red("❌ Missing Configuration. Run `iyzi init` first."));
		return;
	}

	const spinner = ora("Fetching installment options...").start();

	const client = iyzipay({
		apiKey: process.env.IYZIPAY_API_KEY,
		secretKey: process.env.IYZIPAY_SECRET_KEY!,
		baseUrl: process.env.IYZIPAY_BASE_URL || "https://sandbox-api.iyzipay.com",
	});

	const { data, error } = await client.installment.retrieve({
		binNumber: options.bin,
		price: price,
		locale: "tr",
	});

	if (error) {
		spinner.fail("Failed to fetch installments.");
		console.error(chalk.red(error.message));
		return;
	}

	spinner.stop();

	if (!data?.installmentDetails || data.installmentDetails.length === 0) {
		console.log(chalk.yellow("No installment options found for this card."));
		return;
	}

	const detail = data.installmentDetails[0];

	console.log(
		chalk.bold(`\n💳 Card: ${detail.cardFamilyName} (${detail.bankName})`),
	);
	console.log(
		chalk.gray(
			`   Type: ${detail.cardType} | Association: ${detail.cardAssociation}`,
		),
	);
	console.log("\nInstallment Options:");

	// Tablo Oluşturma
	const table = new Table({
		head: [
			chalk.cyan("Installment"),
			chalk.cyan("Total Price"),
			chalk.cyan("Per Month"),
		],
		style: { head: [], border: [] },
	});

	detail.installmentPrices.forEach((inst) => {
		table.push([
			inst.installmentNumber === 1
				? "Single Shot"
				: `${inst.installmentNumber} Months`,
			`${inst.totalPrice} TRY`,
			`${inst.installmentPrice} TRY`,
		]);
	});

	console.log(table.toString());
}
