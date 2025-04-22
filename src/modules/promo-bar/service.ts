import { MedusaService } from "@medusajs/framework/utils"
import PromoBanner from "./models/promo-banner"

class PromoBarService extends MedusaService({ PromoBanner }) {
  /**
   * Vrátí jen obdobně jako u slevu aktivní bannery
   * mezi starts_at a ends_at, seřazené podle priority.
   */
  async listActive() {
    const now = new Date()
    return this.list({
      where: {
        starts_at: { lte: now },
        ends_at:   { gte: now },
      },
      order: { priority: "ASC" },
    })
  }
}

export default PromoBarService
