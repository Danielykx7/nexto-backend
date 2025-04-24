// místo express importuj MedusaRequest/Response
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import PromoBarService from "../../../../modules/promo-bar/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const promoService = req.scope.resolve("promo_bar") as PromoBarService
  const banners = await promoService.listActive()
  res.status(200).json({
    banners,
    count: banners.length,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const promoService = req.scope.resolve("promo_bar") as PromoBarService
  const banner = await promoService.create(req.body)
  res.status(201).json({ promo_banner: banner })
}
