// src/admin/routes/promo-banners/[id]/edit/page.tsx

import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useNavigate, useParams } from "react-router-dom"
import {
  Container,
  Heading,
  Input,
  DatePicker,
  Button,
  Switch,
  Alert,
  Divider,
} from "@medusajs/ui"
import { useMutation } from "@tanstack/react-query"

export const config = defineRouteConfig({ label: "Edit Promo Banner" })

export default function EditPromoBanner() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<{
    text: string
    bg_color: string
    has_button: boolean
    button_text?: string
    button_color?: string
    button_link?: string
    starts_at: string
    ends_at: string
    priority: number
  } | null>(null)

  // Load existing banner
  useEffect(() => {
    fetch(`/admin/custom/promo-banners/${id}`, { credentials: "include" })
      .then(r => r.json())
      .then(({ banner }) => setForm(banner))
      .catch(err => setError(err.message))
  }, [id])

  if (!form) {
    return <div>Loading…</div>
  }

  const saveBanner = useMutation({
    mutationFn: async (updated: typeof form) => {
      const res = await fetch(`/admin/custom/promo-banners/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
      }
      return res.json()
    },
    onError: (err: any) => setError(err.message),
    onSuccess: () => navigate("/promo-banners"),
  })

  const deleteBanner = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/admin/custom/promo-banners/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
      }
      return null
    },
    onError: (err: any) => setError(err.message),
    onSuccess: () => navigate("/promo-banners"),
  })

  const handleSave = () => {
    setError(null)
    saveBanner.mutate(form)
  }

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this banner?")) return
    setError(null)
    deleteBanner.mutate()
  }

  return (
    <Container className="p-6">
      <Heading level="h2">Edit Promo Banner</Heading>
      {error && (
        <Alert variant="error" dismissible>
          {error}
        </Alert>
      )}

      <Input
        label="Text"
        value={form.text}
        onChange={e => setForm({ ...form, text: e.target.value })}
        className="mt-4"
      />

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Background Color
        </label>
        <input
          type="color"
          value={form.bg_color}
          onChange={e => setForm({ ...form, bg_color: e.target.value })}
          className="w-12 h-8 p-0 border-0"
        />
      </div>

      <div className="mt-4">
        <Switch
          checked={form.has_button}
          onCheckedChange={() =>
            setForm(f => ({ ...f, has_button: !f.has_button }))
          }
        >
          Enable Button
        </Switch>
      </div>
      {form.has_button && (
        <>
          <Input
            label="Button Text"
            value={form.button_text || ""}
            onChange={e => setForm({ ...form, button_text: e.target.value })}
            className="mt-4"
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Color
            </label>
            <input
              type="color"
              value={form.button_color || "#000000"}
              onChange={e =>
                setForm({ ...form, button_color: e.target.value })
              }
              className="w-12 h-8 p-0 border-0"
            />
          </div>
          <Input
            label="Button Link"
            value={form.button_link || ""}
            onChange={e => setForm({ ...form, button_link: e.target.value })}
            className="mt-4"
          />
        </>
      )}

      <DatePicker
        label="Starts At"
        value={new Date(form.starts_at)}
        onChange={d => setForm({ ...form, starts_at: d.toISOString() })}
        showTime
        className="mt-4"
      />
      <DatePicker
        label="Ends At"
        value={new Date(form.ends_at)}
        onChange={d => setForm({ ...form, ends_at: d.toISOString() })}
        showTime
        className="mt-4"
      />

      <Input
        label="Priority"
        type="number"
        value={String(form.priority)}
        onChange={e =>
          setForm({ ...form, priority: parseInt(e.target.value, 10) })
        }
        className="mt-4"
      />

      <Divider className="my-6" />

      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          loading={saveBanner.isLoading}
          disabled={saveBanner.isLoading}
        >
          {saveBanner.isLoading ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          loading={deleteBanner.isLoading}
          disabled={deleteBanner.isLoading}
        >
          {deleteBanner.isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Container>
  )
}
