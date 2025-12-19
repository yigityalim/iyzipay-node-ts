import { select } from "@inquirer/prompts";
import chalk from "chalk";
import clipboardy from "clipboardy";
import { TestCards } from "iyzipay-node-ts";

export async function cardsCommand() {
	console.log(chalk.bold.magenta("\n🃏 Iyzico Test Cards Wizard\n"));

	const category = await select({
		message: "What kind of card do you need?",
		choices: [
			{ name: "✅ Success Scenarios", value: "success" },
			{ name: "❌ Error Scenarios", value: "error" },
		],
	});

	let selectedCardValue: string = "";

	if (category === "success") {
		selectedCardValue = await select({
			message: "Choose a bank/card type:",
			choices: [
				{
					name: "Garanti Debit (MasterCard)",
					value: TestCards.Success.GarantiDebit.cardNumber,
				},
				{
					name: "Akbank Credit (MasterCard)",
					value: TestCards.Success.AkbankCredit.cardNumber,
				},
				{
					name: "IsBankasi Credit (Visa)",
					value: TestCards.Success.IsBankasiCredit.cardNumber,
				},
				{
					name: "Foreign Credit Card",
					value: TestCards.Foreign.Credit.cardNumber,
				},
			],
		});
	} else {
		selectedCardValue = await select({
			message: "Choose an error scenario:",
			choices: [
				{
					name: "💸 Insufficient Funds (10051)",
					value: TestCards.Errors.InsufficientFunds.cardNumber,
				},
				{
					name: "🚨 Stolen Card (10043)",
					value: TestCards.Errors.StolenCard.cardNumber,
				},
				{
					name: "📅 Expired Card (10054)",
					value: TestCards.Errors.ExpiredCard.cardNumber,
				},
				{
					name: "🛑 Do Not Honour (10005)",
					value: TestCards.Errors.DoNotHonour.cardNumber,
				},
			],
		});
	}

	// Panoya Kopyala
	await clipboardy.write(selectedCardValue);

	console.log(
		chalk.green(`\n✨ Copied to clipboard: ${chalk.bold(selectedCardValue)}`),
	);
	console.log(chalk.gray("Ready to paste (Ctrl+V / Cmd+V)"));
}
