#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { cardsCommand } from "./commands/cards.js";
import { checkInstallments } from "./commands/check.js";
import { generateCommand } from "./commands/generate.js";
import { initCommand } from "./commands/init.js";
import { createTestPayment } from "./commands/payment.js";
import { whoamiCommand } from "./commands/whoami.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
	readFileSync(path.join(__dirname, "../package.json"), "utf-8"),
);

const program = new Command();

program
	.name("iyzi")
	.description("CLI tool for Iyzipay integration")
	.version(pkg.version);

program
	.command("init")
	.description("Initialize configuration and create .env file")
	.action(initCommand);

program
	.command("pay")
	.description("Create a quick test payment to verify configuration")
	.action(createTestPayment);

program
	.command("cards")
	.description("Select and copy test card numbers instantly")
	.action(cardsCommand);

program
	.command("check")
	.description("Check installment options for a price and bin number")
	.argument("<price>", "The amount to check (e.g. 100)")
	.requiredOption("-b, --bin <binNumber>", "First 6 digits of the credit card")
	.action(checkInstallments);

program
	.command("generate")
	.description("Scaffold payment forms and components")
	.action(generateCommand);

program
	.command("whoami")
	.description("Check current configuration and API connectivity")
	.action(whoamiCommand);

program.parse();
