"use client"

import ErrorScreen from "@/components/ErrorScreen"
import { useUser } from "@/hooks/useSession"

export default function ErrorPage() {
  const { error, createUser } = useUser()
  return error ? <ErrorScreen error={error} onRetry={createUser} /> : null
}