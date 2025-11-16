import type { ActionFunction } from "react-router";
import { json } from "~/server/json";
import { connectDB } from "~/db/connect";
import { User } from "~/db/models";
import { trackEvent } from "~/utils/strudel-utils";

interface ApplyPromoCodeRequest {
	userId: string;
	promoCode: string;
}

const VALID_PROMO_CODES = {
	keeponvibing: {
		unlimitedMessages: true,
		description: "Keep on vibing with unlimited messages!",
	},
};

export const action: ActionFunction = async ({ request }) => {
	if (request.method !== "POST") {
		return json({ error: "Method not allowed" }, { status: 405 });
	}

	try {
		await connectDB();

		const { userId, promoCode } =
			(await request.json()) as ApplyPromoCodeRequest;

		if (!userId || !promoCode?.trim()) {
			return json({ error: "Missing required fields" }, { status: 400 });
		}

		const normalizedPromoCode = promoCode.trim().toLowerCase();

		const promoConfig =
			VALID_PROMO_CODES[normalizedPromoCode as keyof typeof VALID_PROMO_CODES];

		if (!promoConfig) {
			trackEvent("promo_code_invalid", {
				userId,
				promoCode: normalizedPromoCode,
			});
			return json(
				{ error: "Invalid promo code. Please check and try again." },
				{ status: 400 }
			);
		}

		let user = await User.findOne({ userId });

		const now = Date.now();

		if (!user) {
			user = new User({
				userId,
				hasUnlimitedMessages: promoConfig.unlimitedMessages,
				promoCodeApplied: normalizedPromoCode,
				promoCodeAppliedAt: now,
				createdAt: now,
				updatedAt: now,
			});
		} else {
			if (
				user.hasUnlimitedMessages &&
				user.promoCodeApplied === normalizedPromoCode
			) {
				trackEvent("promo_code_already_applied", {
					userId,
					promoCode: normalizedPromoCode,
				});
				return json(
					{
						success: true,
						message: "This promo code is already active on your account!",
						hasUnlimitedMessages: true,
					},
					{ status: 200 }
				);
			}

			user.hasUnlimitedMessages = promoConfig.unlimitedMessages;
			user.promoCodeApplied = normalizedPromoCode;
			user.promoCodeAppliedAt = now;
			user.updatedAt = now;
		}

		await user.save();

		trackEvent("promo_code_applied", {
			userId,
			promoCode: normalizedPromoCode,
			unlimitedMessages: promoConfig.unlimitedMessages,
		});

		return json(
			{
				success: true,
				message: promoConfig.description,
				hasUnlimitedMessages: user.hasUnlimitedMessages,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Promo code application error:", error);
		trackEvent("promo_code_application_failed", {
			error: String(error),
		});
		return json(
			{
				error:
					error instanceof Error ? error.message : "Failed to apply promo code",
			},
			{ status: 500 }
		);
	}
};
