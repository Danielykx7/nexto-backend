// src/admin/routes/promo-banners/[id]/edit.tsx

import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useNavigate, useParams } from "react-router-dom"
import {
  Container,
  Heading,
  TextField,
  DatePicker,
  Button,
  Input,
  ColorPicker,
  Switch,
  Alert,
} from "@medusajs/ui"

export const config = defineRouteConfig({
  label: "Edit Promo Banner",
})

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

  const handleSave = async () => {
    setError(null)
    const res = await fetch(`/admin/custom/promo-banners/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      const msg = await res.text()
      setError(msg || res.statusText)
    } else {
      navigate("/promo-banners")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this banner?")) return
    const res = await fetch(`/admin/custom/promo-banners/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (!res.ok) {
      const msg = await res.text()
      setError(msg || res.statusText)
    } else {
      navigate("/promo-banners")
    }
  }

  return (
    <Container className="p-6">
      <Heading level="h2">Edit Promo Banner</Heading>
      {error && <Alert variant="error" dismissible>{error}</Alert>}

      <TextField
        label="Text"
        value={form.text}
        onChange={e => setForm({ ...form, text: e.target.value })}
      />

      <ColorPicker
        label="Background Color"
        value={form.bg_color}
        onChange={c => setForm({ ...form, bg_color: c })}
      />

      <Switch
        checked={form.has_button}
        onCheckedChange={() =>
          setForm(f => ({ ...f, has_button: !f.has_button }))
        }
      >
        Enable Button
      </Switch>
      {form.has_button && (
        <>
          <TextField
            label="Button Text"
            value={form.button_text || ""}
            onChange={e => setForm({ ...form, button_text: e.target.value })}
          />
          <ColorPicker
            label="Button Color"
            value={form.button_color || ""}
            onChange={c => setForm({ ...form, button_color: c })}
          />
          <Input
            label="Button Link"
            value={form.button_link || ""}
            onChange={e => setForm({ ...form, button_link: e.target.value })}
          />
        </>
      )}

      <DatePicker
        label="Starts At"
        value={new Date(form.starts_at)}
        onChange={d => setForm({ ...form, starts_at: d.toISOString() })}
        showTime
      />
      <DatePicker
        label="Ends At"
        value={new Date(form.ends_at)}
        onChange={d => setForm({ ...form, ends_at: d.toISOString() })}
        showTime
      />

      <TextField
        type="number"
        label="Priority"
        value={String(form.priority)}
        onChange={e =>
          setForm({ ...form, priority: parseInt(e.target.value, 10) })
        }
      />

      <div className="flex gap-2 mt-4">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
      </div>
    </Container>
  )
}
