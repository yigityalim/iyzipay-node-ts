import { CreateInstallmentInfoRequest, CreateInstallmentInfoSchema } from "../../schemas/installment";
import { IyzipayResult } from "../../types";
import { InstallmentInfoResponse } from "../../types/installment";
import { BaseResource } from "../base-resource";


export class InstallmentResource extends BaseResource {
	/**
	 * Retrieves installment options for a given BIN number and price.
	 * Useful for showing pricing tables before payment.
	 */
	async retrieve(
		request: CreateInstallmentInfoRequest,
	): Promise<IyzipayResult<InstallmentInfoResponse>> {
		try {
			const validated = CreateInstallmentInfoSchema.parse(request);
			return this.client.post<InstallmentInfoResponse>(
				"/payment/iyzipos/installment",
				validated,
			);
		} catch (error) {
			return { data: null, error: error as any };
		}
	}
}
