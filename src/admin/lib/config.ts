import Medusa from "@medusajs/js-sdk"

export const medusaClient = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "http://localhost:9000",
  auth: { type: "session" },
})
