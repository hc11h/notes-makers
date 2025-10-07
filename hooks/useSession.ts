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
      toast.info("No user token found. Creating a new user...");

      // Call async createUser and handle toast on success/fail
      createUser().then((success: boolean) => {
        if (success) {
          toast.success("User created successfully!")
        } else {
          toast.error("Failed to create user.")
        }
      })

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
        // router.replace("/error")
      })
  }, [])

  // Make createUser async and return a boolean
  async function createUser(): Promise<boolean> {
    setLoading(true)
    try {
      const res = await fetch("/api/user", { method: "POST" })
      const data = await res.json()

      sessionStorage.setItem("user_token", data.token)
      setUserId(data.userId)
      setToken(data.token)
      setError(null)
      setLoading(false)
      router.replace("/")

      return true
    } catch (err) {
      toast.error("Failed to create user.")
      setError("Failed to create user.")
      setLoading(false)
      return false
    }
  }

  return { userId, token, error, loading, createUser }
}