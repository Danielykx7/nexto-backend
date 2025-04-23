// src/admin/routes/promo-banners/new.tsx

import React, { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useNavigate } from "react-router-dom"
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
import { useMutation } from "@tanstack/react-query"

export const config = defineRouteConfig({ label: "New Promo Banner" })

export default function NewPromoBanner() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    text: "",
    bg_color: "#ffffff",
    has_button: false,
    button_text: "",
    button_color: "#000000",
    button_link: "",
    starts_at: new Date().toISOString(),
    ends_at: new Date().toISOString(),
    priority: 1,
  })

  const createBanner = useMutation({
    mutationFn: async (newBanner: typeof form) => {
      const res = await fetch("/admin/custom/promo-banners", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBanner),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
      }
      return res.json()
    },
    onError: (err: any) => {
      setError(err.message)
    },
    onSuccess: () => {
      navigate("/promo-banners")
    },
  })

  const handleSubmit = () => {
    setError(null)
    createBanner.mutate(form)
  }

  return (
    <Container className="p-6">
      <Heading level="h2">Create Promo Banner</Heading>
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
            value={form.button_text}
            onChange={e => setForm({ ...form, button_text: e.target.value })}
          />
          <ColorPicker
            label="Button Color"
            value={form.button_color}
            onChange={c => setForm({ ...form, button_color: c })}
          />
          <Input
            label="Button Link"
            value={form.button_link}
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

      <Button
        className="mt-4"
        onClick={handleSubmit}
        loading={createBanner.isLoading}
        disabled={createBanner.isLoading}
      >
        {createBanner.isLoading ? "Creating..." : "Create"}
      </Button>
    </Container>
  )
}
