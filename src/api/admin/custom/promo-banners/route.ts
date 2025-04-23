// src/api/admin/custom/promo-banners/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PROMO_BAR_MODULE } from "../../../../modules/promo-bar"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const promoService = req.scope.resolve(PROMO_BAR_MODULE) as any

  // 1) naparsujeme offset a limit z query
  const offset = parseInt((req.query.offset as string) || "0", 10)
  const limit  = parseInt((req.query.limit  as string) || "15", 10)

  // 2) rozdělíme to na “criteria” a “options” (skip/take nesmí být v criteria)
  const [banners, count] = await promoService.listPromoBanners(
    {
      // sem můžete narvat filtr, např. jen aktivní bannery:
      // starts_at: { lte: new Date() },
      // ends_at:   { gte: new Date() },
    },
    {
      skip: offset,
      take: limit,
      order: { priority: "ASC" },
    }
  )

  // 3) odpovíme JSONem, jak admin SDK čeká
  return res.json({ banners, count })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const promoService = req.scope.resolve(PROMO_BAR_MODULE) as any
  const banner = await promoService.create(req.body)

  return res.status(201).json({ banner })
}
