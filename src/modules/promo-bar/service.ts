// src/modules/promo-bar/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import PromoBanner from "./models/promo-banner"

export default class PromoBarService extends MedusaService({ PromoBanner }) {
  /**
   * Vrátí pouze bannery, které právě běží (mezi starts_at a ends_at),
   * seřazené dle priority.
   */
  async listActive() {
    const now = new Date()
    return this.listPromoBanners({
      where: {
        starts_at: { lte: now },
        ends_at:   { gte: now },
      },
      order: { priority: "ASC" },
    })
  }
}
