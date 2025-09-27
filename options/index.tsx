import React, { useEffect, useMemo, useState } from "react"
import { supabase } from "~core/supabase"
import "../style.css"

function OptionsPage() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [ready, setReady] = useState(false)

  const linkType = useMemo(() => {
    // Supabase uses URL hash for auth redirects, example: #access_token=...&type=recovery
    const hash = window.location.hash || ""
    console.log({hash})
    const params = new URLSearchParams(hash.replace(/^#/, ""))
    return params.get("type") // 'recovery' | 'signup' | null
  }, [])

  useEffect(() => {
    // When opened from the email link, supabase-js with detectSessionInUrl=true
    // will process the URL and establish a session automatically on first load.
    // We wait a moment for that to complete and then check the session.
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setError("No recovery session found. Please use the password reset link from your email again.")
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        setError(message)
      } finally {
        setReady(true)
      }
    }
    void init()
  }, [])

  const handleUpdatePassword = async () => {
    try {
      setError("")
      setStatus("")
      if (!newPassword || !confirmPassword) {
        setError("Please fill out both password fields.")
        return
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.")
        return
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        setError(error.message)
        return
      }
      setStatus("Your password has been updated. You can close this tab and log in from the extension.")
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-brand-grey">
      <div className="w-full max-w-md p-6 bg-white border border-brand-darkblue">
        {!ready ? (
          <p className="text-center">Loading...</p>
        ) : (linkType === "recovery") ? (
          <>
            <h1 className="text-2xl font-candu tracking-wide uppercase text-brand-darkblue text-center mb-2">{chrome.i18n?.getMessage("auth_resetPassword") || "Reset Password"}</h1>
            <p className="text-brand-darkblue/80 text-center mb-6">{chrome.i18n?.getMessage("auth_resetPasswordDesc") || "Enter a new password to complete the reset."}</p>
            {error && (
              <div className="mb-3 text-red-600 text-sm text-center">{error}</div>
            )}
            {status && (
              <div className="mb-3 text-green-700 text-sm text-center">{status}</div>
            )}

            <div className="space-y-3">
              <div>
                <label htmlFor="new-password" className="block text-brand-darkblue text-sm mb-1">{chrome.i18n?.getMessage("auth_newPassword") || "New Password"}</label>
                <input id="new-password" type="password" className="w-full border px-3 py-2" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={chrome.i18n?.getMessage("auth_enterNewPassword") || "Enter new password"} />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-brand-darkblue text-sm mb-1">{chrome.i18n?.getMessage("auth_confirmPassword") || "Confirm Password"}</label>
                <input id="confirm-password" type="password" className="w-full border px-3 py-2" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={chrome.i18n?.getMessage("auth_confirmPassword") || "Confirm password"} />
              </div>
              <button className="w-full bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide px-4 py-2" onClick={handleUpdatePassword}>
                {chrome.i18n?.getMessage("auth_updatePassword") || "Update Password"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-candu tracking-wide uppercase text-brand-darkblue text-center mb-2">{chrome.i18n?.getMessage("auth_resetPassword") || "Reset Password"}</h1>
            <div className="text-brand-darkblue text-center mb-6">{chrome.i18n?.getMessage("auth_openFromResetEmail") || "This page is used for password resets. Please open it from your password reset email."}</div>
          </>
        )}
      </div>
    </div>
  )
}

export default OptionsPage
