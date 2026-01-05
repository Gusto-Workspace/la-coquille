import Stripe from "stripe";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

function signProof(payload, timestamp) {
  const secret = process.env.GUSTO_SHARED_SECRET;
  if (!secret) throw new Error("Missing GUSTO_SHARED_SECRET");
  const body = JSON.stringify(payload);
  return crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action = "create" } = req.body;

  // ---------------- CREATE ----------------
  if (action === "create") {
    const { amount, restaurantId, giftId } = req.body;

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0 || !restaurantId || !giftId) {
      return res
        .status(400)
        .json({ error: "amount (>0), restaurantId and giftId are required" });
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amt,
        currency: "eur",
        metadata: {
          restaurantId: String(restaurantId),
          giftId: String(giftId),
        },
      });

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error("PI create error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // ---------------- VERIFY ----------------
  if (action === "verify") {
    const { paymentIntentId, amount, restaurantId, giftId } = req.body;

    const amt = Number(amount);
    if (
      !paymentIntentId ||
      !Number.isFinite(amt) ||
      amt <= 0 ||
      !restaurantId ||
      !giftId
    ) {
      return res.status(400).json({
        error:
          "paymentIntentId, amount (>0), restaurantId, giftId are required",
      });
    }

    try {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (pi.status !== "succeeded") {
        return res.status(402).json({ error: "Payment not completed" });
      }

      if (pi.amount !== amt || pi.currency !== "eur") {
        return res.status(400).json({ error: "Invalid amount/currency" });
      }

      if (
        pi.metadata?.restaurantId !== String(restaurantId) ||
        pi.metadata?.giftId !== String(giftId)
      ) {
        return res.status(400).json({ error: "Payment metadata mismatch" });
      }

      const timestamp = Date.now().toString();

      // ⚠️ Important: on signe l'amount NORMALISÉ (number), pour matcher le middleware Gusto
      const payload = {
        paymentIntentId,
        amount: amt,
        restaurantId: String(restaurantId),
        giftId: String(giftId),
      };

      const signature = signProof(payload, timestamp);

      return res.status(200).json({ timestamp, signature, payload });
    } catch (error) {
      console.error("PI verify error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(400).json({ error: "Invalid action" });
}
