// src/modules/promo-bar/service.ts

import { MedusaService } from "@medusajs/framework/utils"
import type {
  InferEntityType,
  FilterQuery,
  FindConfig,
} from "@medusajs/framework/types"
import PromoBanner from "./models/promo-banner"

// DTO, který budeš předávat do createPromoBanners
type PromoBannerDTO = {
  text: string
  bg_color: string
  button_text?: string | null
  button_color?: string | null
  button_link?: string | null
  starts_at: Date
  ends_at: Date
  priority?: number
}

export default class PromoBarService extends MedusaService({ PromoBanner }) {
  /**
   * Vytvoří nový promo banner.
   */
  async create(
    data: PromoBannerDTO
  ): Promise<InferEntityType<typeof PromoBanner>> {
    // jednoduchá validace rozsahu
    if (data.starts_at >= data.ends_at) {
      throw new Error(
        "Invalid date range: 'starts_at' musí být menší než 'ends_at'"
      )
    }

    // použij vygenerovanou metodu
    return this.createPromoBanners(data)
  }

  /**
   * Vrátí bannery aktivní právě teď, seřazené podle priority.
   */
  async listActive(): Promise<InferEntityType<typeof PromoBanner>[]> {
    const now = new Date()

    const filter: FilterQuery<InferEntityType<typeof PromoBanner>> = {
      starts_at: { $lte: now },
      ends_at:   { $gte: now },
    }

    const config: FindConfig<InferEntityType<typeof PromoBanner>> = {
      order: { priority: "ASC" },
    }

    return this.listPromoBanners(filter, config)
  }
}
