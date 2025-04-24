import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PROMO_BAR_MODULE } from "../../../../modules/promo-bar";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const promoBarService = req.scope.resolve(PROMO_BAR_MODULE);
  const banners = await promoBarService.listActive();
  res.json({ banners });
}
