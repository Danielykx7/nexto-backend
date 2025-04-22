import {
  Container,
  Heading,
  DataTable,
  createDataTableColumnHelper,
} from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useDataTable, DataTablePaginationState } from "@medusajs/ui"
import { useState } from "react"
import { medusaClient } from "../../lib/config"

type Banner = {
  id: string
  text: string
  bg_color: string
  button_text?: string
  button_color?: string
  button_link?: string
  starts_at: string
  ends_at: string
  priority: number
}

type BannersResponse = {
  banners: Banner[]
}

export const config = defineRouteConfig({
  path: "/promo-banners",
  title: "Promo Banners",
  icon: () => <></>,
})

const columnHelper = createDataTableColumnHelper<Banner>()

const columns = [
  columnHelper.accessor("text", { header: "Text" }),
  columnHelper.accessor("bg_color", { header: "Barva" }),
  columnHelper.accessor("button_text", { header: "Tlačítko" }),
  columnHelper.accessor("starts_at", { header: "Začíná" }),
  columnHelper.accessor("ends_at", { header: "Končí" }),
]

const PromoBannersPage = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: 50,
    current: 1,
  })

  const { rows, isLoading } = useDataTable<Banner, BannersResponse>({
    resource: "promo-banners",
    fetcher: () =>
      medusaClient.admin.promoBanners.list().then((res) => ({
        banners: res.banners,
      })),
    pagination,
    onPaginationChange: setPagination,
  })

  return (
    <Container className="p-6">
      <Heading level="h2">Promo Banners</Heading>
      <DataTable
        columns={columns}
        rows={rows}
        loading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </Container>
  )
}

export default PromoBannersPage
