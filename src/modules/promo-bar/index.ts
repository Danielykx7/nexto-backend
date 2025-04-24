// src/modules/promo-bar/index.ts
import { Module } from "@medusajs/framework/utils"
import PromoBarService from "./service"

export const PROMO_BAR_MODULE = "promo_bar"

export default Module(PROMO_BAR_MODULE, {
  service: PromoBarService,
})