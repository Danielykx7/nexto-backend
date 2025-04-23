import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PROMO_BAR_MODULE } from "../../../../../modules/promo-bar"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const promoService = req.scope.resolve(PROMO_BAR_MODULE) as any
  const banner = await promoService.retrieve(id)
  return res.json({ banner })
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const promoService = req.scope.resolve(PROMO_BAR_MODULE) as any
  const updated = await promoService.update(id, req.body)
  return res.json({ banner: updated })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const promoService = req.scope.resolve(PROMO_BAR_MODULE) as any
  await promoService.delete(id)
  return res.status(204).end()
}
