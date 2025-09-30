'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = sessionStorage.getItem("user_token")
    if (!storedToken) {
      toast.error("No user token found. Auth failed.")
      setError("No user token found.")
      setLoading(false)
      router.replace("/error")
      return
    }
    fetch(`/api/user?token=${storedToken}`)
      .then(res => {
        if (!res.ok) throw new Error("Invalid token")
        return res.json()
      })
      .then(data => {
        setUserId(data.userId)
        setToken(storedToken)
        setLoading(false)
      })
      .catch(() => {
        toast.error("Invalid or expired user token. Auth failed.")
        setError("Invalid or expired user session.")
        setLoading(false)
        router.replace("/error")
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function createUser() {
    setLoading(true)
    fetch("/api/user", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        sessionStorage.setItem("user_token", data.token)
        setUserId(data.userId)
        setToken(data.token)
        setError(null)
        setLoading(false)
        router.replace("/")
      })
      .catch(() => {
        toast.error("Failed to create user.")
        setError("Failed to create user.")
        setLoading(false)
      })
  }

  return { userId, token, error, loading, createUser }
}