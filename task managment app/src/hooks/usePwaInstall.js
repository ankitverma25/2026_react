import { useCallback, useEffect, useState } from 'react'

const DISMISS_KEY = 'daymark-install-dismissed'
const INSTALLED_KEY = 'daymark-app-installed'

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
  const [promptEvent, setPromptEvent] = useState(null)
  const [installed, setInstalled] = useState(() => isStandalone() || localStorage.getItem(INSTALLED_KEY) === '1')
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1')

  useEffect(() => {
    // Yahan beforeinstallprompt ko capture karke rakha ja raha hai kyunki ye event sirf ek hi baar fire hota hai, isliye isse turant consume nahi karte.
    const onBeforeInstall = (event) => {
      event.preventDefault()
      setPromptEvent(event)
    }
    const onInstalled = () => {
      setInstalled(true)
      setPromptEvent(null)
      localStorage.setItem(INSTALLED_KEY, '1')
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    const standaloneQuery = window.matchMedia?.('(display-mode: standalone)')
    const onDisplayChange = (event) => {
      if (event.matches) onInstalled()
    }
    standaloneQuery?.addEventListener?.('change', onDisplayChange)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
      standaloneQuery?.removeEventListener?.('change', onDisplayChange)
    }
  }, [])

  const install = useCallback(async () => {
    if (!promptEvent) return 'unavailable'
    promptEvent.prompt()
    const choice = await promptEvent.userChoice
    // Yahan promptEvent turant clear kar dete hain kyunki browser ise dobara fire nahi karta, aur user ke "dismiss" karne par button hat jaata hai taaki baar-baar na dikhe.
    setPromptEvent(null)
    if (choice?.outcome === 'accepted') {
      setInstalled(true)
      localStorage.setItem(INSTALLED_KEY, '1')
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
  const canPrompt = Boolean(promptEvent)
  const showIosHint = !canPrompt && !installed && !dismissed && isIosSafari()

  return { canPrompt, showIosHint, installed, dismissed, install, dismiss, isIos: isIosSafari() }
}
