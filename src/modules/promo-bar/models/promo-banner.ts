import { model } from "@medusajs/framework/utils"

const PromoBanner = model.define("promo_banner", {
  id: model.id().primaryKey(),
  text: model.text(),
  bg_color: model.text(),
  button_text: model.text().nullable(),
  button_color: model.text().nullable(),
  button_link: model.text().nullable(),
  starts_at: model.dateTime(),   // timestamp začátku platnosti
  ends_at: model.dateTime(),     // timestamp konce platnosti
  priority: model.number().default(0), // pořadí pro rotaci
})

export default PromoBanner
