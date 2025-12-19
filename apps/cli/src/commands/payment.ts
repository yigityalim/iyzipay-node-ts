import chalk from "chalk";
import dotenv from "dotenv";
import {
	Currency,
	Inputs,
	iyzipay,
	PaymentGroup,
	TestCards,
} from "iyzipay-node-ts";
import ora from "ora";

export async function createTestPayment() {
	dotenv.config();

	if (!process.env.IYZIPAY_API_KEY) {
		console.log(chalk.red("❌ Missing Configuration."));
		console.log(`Please run ${chalk.cyan("npx iyzi init")} first.`);
		return;
	}

	const spinner = ora("Processing payment...").start();

	const client = iyzipay({
		apiKey: process.env.IYZIPAY_API_KEY,
		secretKey: process.env.IYZIPAY_SECRET_KEY!,
		baseUrl: process.env.IYZIPAY_BASE_URL || "https://sandbox-api.iyzipay.com",
	});

	const { data, error } = await client.payment.create({
		price: "100.00",
		currency: Currency.TRY,
		paymentGroup: PaymentGroup.PRODUCT,
		paymentCard: TestCards.Success.GarantiDebit,
		buyer: Inputs.buyer({
			id: "CLI-USER",
			name: "CLI",
			surname: "Tester",
			identityNumber: "11111111111",
			email: "cli@test.com",
		}),
		shippingAddress: Inputs.address("CLI Address", "Tester"),
		billingAddress: Inputs.address("CLI Address", "Tester"),
		basketItems: [Inputs.basketItem("CLI Test Item", "100.00")],
	});

	if (error) {
		spinner.fail("Payment Failed!");
		console.log(chalk.red("\nError Details:"));
		console.log(chalk.yellow(`Code: ${error.errorCode}`));
		console.log(chalk.yellow(`Message: ${error.errorMessage}`));
	} else {
		spinner.succeed("Payment Successful! 🎉");
		console.log(chalk.green("\nTransaction Details:"));
		console.log(`Payment ID: ${chalk.bold(data.paymentId)}`);
		console.log(`Price: ${data.price} ${data.currency}`);
		console.log(`Status: ${data.status}`);
	}
}
