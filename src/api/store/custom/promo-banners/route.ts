import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PROMO_BAR_MODULE } from "../../../../modules/promo-bar"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const promoService = req.scope.resolve(PROMO_BAR_MODULE) as any
  const banners = await promoService.listActive()
  res.json({ banners })
}
