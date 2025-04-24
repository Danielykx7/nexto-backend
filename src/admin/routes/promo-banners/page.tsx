// src/admin/routes/promo-banners/new/page.tsx
import React, { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  Button,
  Input,
  Textarea,
  Label,
  Field,
  DateTimePicker,
  Divider,
} from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const config = defineRouteConfig({ label: "New Promo Banner" })

export default function NewPromoBannerPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  // lokální state pro formulář
  const [text, setText] = useState("")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [buttonText, setButtonText] = useState("")
  const [buttonLink, setButtonLink] = useState("")
  const [startsAt, setStartsAt] = useState<Date>(new Date())
  const [endsAt, setEndsAt] = useState<Date>(new Date(Date.now() + 3600_000))
  const [priority, setPriority] = useState(0)

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        text,
        bg_color: bgColor,
        button_text: buttonText || null,
        button_link: buttonLink || null,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        priority,
      }
      const res = await fetch("/admin/custom/promo-banners", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        throw new Error(await res.text())
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries(["promo-banners"])
      navigate("/promo-banners")
    },
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate()
  }

  return (
    <Container className="p-6 max-w-lg">
      <Heading level="h1">New Promo Banner</Heading>
      <Divider className="my-4" />

      <form onSubmit={onSubmit} className="space-y-4">
        <Field>
          <Label>Text</Label>
          <Textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write banner text…"
          />
        </Field>

        <Field>
          <Label>Background Color</Label>
          <Input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </Field>

        <Field>
          <Label>Button Text</Label>
          <Input
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            placeholder="Optional"
          />
        </Field>

        <Field>
          <Label>Button Link</Label>
          <Input
            type="url"
            value={buttonLink}
            onChange={(e) => setButtonLink(e.target.value)}
            placeholder="https://…"
          />
        </Field>

        <Field>
          <Label>Starts At</Label>
          <DateTimePicker
            value={startsAt}
            onChange={(d) => d && setStartsAt(d)}
          />
        </Field>

        <Field>
          <Label>Ends At</Label>
          <DateTimePicker
            value={endsAt}
            onChange={(d) => d && setEndsAt(d)}
          />
        </Field>

        <Field>
          <Label>Priority (lower = higher)</Label>
          <Input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            min={0}
          />
        </Field>

        <div className="flex space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isLoading}>
            {createMutation.isLoading ? "Saving…" : "Save Banner"}
          </Button>
        </div>
      </form>
    </Container>
  )
}
