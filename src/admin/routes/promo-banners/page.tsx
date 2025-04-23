// src/admin/routes/promo-banners/page.tsx

import React, { useState, useMemo } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Heading,
  DataTable,
  createDataTableColumnHelper,
  DataTablePaginationState,
  useDataTable,
  Button,
  Input,
  Checkbox,
  Badge,
  Divider,
  Alert,
} from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const config = defineRouteConfig({
  label: "Promo Banners",
})

type Banner = {
  id: string
  text: string
  bg_color: string
  has_button: boolean
  button_text?: string
  button_color?: string
  button_link?: string
  starts_at: string
  ends_at: string
  priority: number
}

const columnHelper = createDataTableColumnHelper<Banner>()
const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  columnHelper.accessor("text", { header: "Text" }),
  columnHelper.accessor("bg_color", { header: "Background Color" }),
  columnHelper.accessor("has_button", {
    header: "Has Button",
    cell: info => (
      info.getValue() ? <Badge>Yes</Badge> : <Badge variant="secondary">No</Badge>
    ),
  }),
  columnHelper.accessor("starts_at", { header: "Starts At" }),
  columnHelper.accessor("ends_at", { header: "Ends At" }),
  columnHelper.accessor("priority", { header: "Priority" }),
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="secondary"
        onClick={() => navigate(`/promo-banners/${row.original.id}/edit`)}
      >
        Edit
      </Button>
    ),
  },
]

export default function PromoBannersPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [pagination, setPagination] = useState<DataTablePaginationState>({ pageIndex: 0, pageSize: 10 })
  const offset = useMemo(() => pagination.pageIndex * pagination.pageSize, [pagination])
  const limit = pagination.pageSize
  const [tab, setTab] = useState<'active' | 'upcoming' | 'expired'>('active')
  const [search, setSearch] = useState<string>("")

  const { data, error, isLoading } = useQuery({
    queryKey: ['promo-banners', offset, limit, tab, search],
    queryFn: async (): Promise<{ banners: Banner[]; count: number }> => {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
        filter: tab,
        search,
      })
      const res = await fetch(`/admin/custom/promo-banners?${params}`, { credentials: 'include' })
      if (!res.ok) {
        throw new Error(await res.text())
      }
      return res.json()
    },
    keepPreviousData: true,
  })

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map(id => fetch(`/admin/custom/promo-banners/${id}`, { method: 'DELETE', credentials: 'include' }))
      )
    },
    onSuccess: () => qc.invalidateQueries(['promo-banners']),
  })

  const table = useDataTable({
    columns,
    data: data?.banners || [],
    rowCount: data?.count || 0,
    getRowId: row => row.id,
    isLoading,
    pagination: { state: pagination, onPaginationChange: setPagination },
    enableRowSelection: true,
  })

  const selectedIds = table.getRowModel().rows
    .filter(row => row.getIsSelected())
    .map(row => row.original.id)

  return (
    <Container className="p-6">
      <div className="flex justify-between items-center">
        <Heading level="h2">Promo Banners</Heading>
        <Button onClick={() => navigate('/promo-banners/new')}>New Banner</Button>
      </div>

      <div className="flex gap-4 items-center mt-4">
        <Button variant={tab === 'active' ? 'primary' : 'secondary'} onClick={() => setTab('active')}>Active</Button>
        <Button variant={tab === 'upcoming' ? 'primary' : 'secondary'} onClick={() => setTab('upcoming')}>Upcoming</Button>
        <Button variant={tab === 'expired' ? 'primary' : 'secondary'} onClick={() => setTab('expired')}>Expired</Button>
        <Input placeholder="Search text..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1" />
        <Button variant="danger" disabled={!selectedIds.length} onClick={() => {
          if (confirm(`Delete ${selectedIds.length} banners?`)) deleteMutation.mutate(selectedIds)
        }}>Delete Selected</Button>
      </div>

      <Divider className="my-4" />

      {error && <Alert variant="error" dismissible>{error.message}</Alert>}

      <DataTable instance={table}>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  )
}
