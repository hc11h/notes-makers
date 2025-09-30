"use client"

import ErrorScreen from "@/components/ErrorScreen"
import { useUser } from "@/hooks/use-session"

export default function ErrorPage() {
  const { error, createUser } = useUser()
  // Always show the dialog if error exists
  return error ? <ErrorScreen error={error} onRetry={createUser} /> : null
}