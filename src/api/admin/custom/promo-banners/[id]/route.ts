import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PROMO_BAR_MODULE } from "../../../../../modules/promo-bar"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const promoService = req.scope.resolve(PROMO_BAR_MODULE) as any
  const banner = await promoService.retrieve(req.params.id)
  res.json({ banner })
}

export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const promoService = req.scope.resolve(PROMO_BAR_MODULE) as any
  const updated = await promoService.update(req.params.id, req.body)
  res.json({ updated })
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const promoService = req.scope.resolve(PROMO_BAR_MODULE) as any
  await promoService.delete(req.params.id)
  res.sendStatus(204)
}
