import PromoBarService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PROMO_BAR_MODULE = "promo_bar"

export default Module(PROMO_BAR_MODULE, {
  service: PromoBarService,
})
