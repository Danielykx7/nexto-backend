import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PROMO_BAR_MODULE } from "../../../../modules/promo-bar"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  // container.resolve podle dokumentace Custom API Routes v /src/api/README.md
  const promoService = req.scope.resolve(PROMO_BAR_MODULE) as any
  const banners = await promoService.list()
  res.json({ banners })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const promoService = req.scope.resolve(PROMO_BAR_MODULE) as any
  const banner = await promoService.create(req.body)
  res.status(201).json({ banner })
}
