// src/admin/routes/promo‑banners/page.tsx
import React, { useState, useMemo } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  DataTable,
  createDataTableColumnHelper,
  DataTablePaginationState,
  useDataTable,
} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { medusaClient } from "../../lib/config"

export const config = defineRouteConfig({
  label: "Promo Banners",
})

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

// ─── Columns ─────────────────────────────────────────────────────────────────────
const columnHelper = createDataTableColumnHelper<Banner>()
const columns = [
  columnHelper.accessor("text",        { header: "Text" }),
  columnHelper.accessor("bg_color",    { header: "Barva pozadí" }),
  columnHelper.accessor("button_text", { header: "Text tlačítka" }),
  columnHelper.accessor("starts_at",   { header: "Začíná" }),
  columnHelper.accessor("ends_at",     { header: "Končí" }),
  columnHelper.accessor("priority",    { header: "Priorita" }),
]

const PromoBannersPage: React.FC = () => {
  // 1) pagination state
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageIndex: 0,
    pageSize:  15,
  })

  // 2) compute offset/limit
  const offset = useMemo(
    () => pagination.pageIndex * pagination.pageSize,
    [pagination]
  )
  const limit = pagination.pageSize

  // 3) fetch data
  const { data, isLoading, error } = useQuery<{
    banners: Banner[]
    count:   number
  }>({
    queryKey: ["promo-banners", offset, limit],
    queryFn:  () =>
      medusaClient.admin.request(
        "GET",
        "/admin/custom/promo-banners",
        { query: { offset, limit } }
      ),
    keepPreviousData: true,
  })

  // 4) initialize table (always called)
  const table = useDataTable({
    columns,
    data:     data?.banners || [],
    rowCount: data?.count   || 0,
    getRowId: (row) => row.id,
    isLoading,
    pagination: {
      state:              pagination,
      onPaginationChange: setPagination,
    },
  })

  return (
    <Container className="p-6">
      <Heading level="h2">Promo Banners</Heading>

      {error ? (
        <Heading level="h3" variant="danger">
          Chyba: {(error as Error).message}
        </Heading>
      ) : (
        <DataTable instance={table}>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable>
      )}
    </Container>
  )
}

export default PromoBannersPage
