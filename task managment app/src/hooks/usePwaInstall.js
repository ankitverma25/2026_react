import { useCallback, useEffect, useState } from 'react'

const DISMISS_KEY = 'daymark-install-dismissed'

// Yahan prompt event module level par cache hota hai kyunki browser ise sirf ek hi baar fire karta hai —
// agar user pehle /login par aaya aur phir /app par gaya, to per-component state reset hone se button gayab ho jaata tha.
let cachedPromptEvent = null
const promptListeners = new Set()

function capturePromptEvent(event) {
  event.preventDefault()
  cachedPromptEvent = event
  promptListeners.forEach((listener) => listener(event))
}

if (typeof window !== 'undefined') {
  // Yahan stale installed flag clear kiya ja raha hai kyunki ab installed state live display-mode se detect hoti hai —
  // localStorage ka purana "installed" likha hua value uninstall ke baad button ko hamesha ke liye chhupa deta tha.
  localStorage.removeItem('daymark-app-installed')
  window.addEventListener('beforeinstallprompt', capturePromptEvent)
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)')?.matches === true ||
    window.matchMedia?.('(display-mode: fullscreen)')?.matches === true ||
    window.matchMedia?.('(display-mode: minimal-ui)')?.matches === true ||
    window.navigator.standalone === true
  )
}

function isIosSafari() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return iOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)
}

export default function usePwaInstall() {
  // Yahan installed state runtime par live rehti hai (display-mode + appinstalled event), isliye uninstall ke baad button wapas aa jaata hai.
  const [promptEvent, setPromptEvent] = useState(cachedPromptEvent)
  const [installed, setInstalled] = useState(() => isStandalone())
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1')

  useEffect(() => {
    const onPrompt = (event) => setPromptEvent(event)
    promptListeners.add(onPrompt)

    const onInstalled = () => {
      setInstalled(true)
      setPromptEvent(null)
      cachedPromptEvent = null
      // Install hone par purana dismiss hata dete hain, taaki user baad me app uninstall kare to option dobara mile.
      localStorage.removeItem(DISMISS_KEY)
      setDismissed(false)
    }
    window.addEventListener('appinstalled', onInstalled)

    // App installed mode me chalu hone par bhi ye check zaroori hai, kyunki tab appinstalled event fire nahi hota.
    const standaloneQuery = window.matchMedia?.('(display-mode: standalone)')
    const onDisplayChange = (event) => {
      if (event.matches) onInstalled()
      else setInstalled(false)
    }
    standaloneQuery?.addEventListener?.('change', onDisplayChange)

    // Yahan storage event se doosre tab ke dismiss ko sync kiya ja raha hai, taaki ek tab me dismiss karne par doosra tab bhi option chhupa de.
    const onStorage = (event) => {
      if (event.key === DISMISS_KEY) setDismissed(event.newValue === '1')
    }
    window.addEventListener('storage', onStorage)

    return () => {
      promptListeners.delete(onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      window.removeEventListener('storage', onStorage)
      standaloneQuery?.removeEventListener?.('change', onDisplayChange)
    }
  }, [])

  const install = useCallback(async () => {
    if (!promptEvent) return 'unavailable'
    promptEvent.prompt()
    const choice = await promptEvent.userChoice
    // Yahan promptEvent turant clear kar dete hain kyunki browser ise dobara fire nahi karta, aur native dialog dismiss karne par button hat jaata hai taaki baar-baar na dikhe.
    setPromptEvent(null)
    cachedPromptEvent = null
    if (choice?.outcome === 'accepted') {
      setInstalled(true)
      localStorage.removeItem(DISMISS_KEY)
      setDismissed(false)
      return 'accepted'
    }
    setDismissed(true)
    localStorage.setItem(DISMISS_KEY, '1')
    return 'dismissed'
  }, [promptEvent])

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }, [])

  // Yahan iOS par beforeinstallprompt nahi aata, isliye wahan manual "Add to Home Screen" hint dikhaya jaata hai.
  const canPrompt = Boolean(promptEvent) && !installed
  const showIosHint = !canPrompt && !installed && !dismissed && isIosSafari()

  return { canPrompt, showIosHint, installed, dismissed, install, dismiss }
}
