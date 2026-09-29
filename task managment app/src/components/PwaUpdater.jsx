import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw, X } from 'lucide-react'

export default function PwaUpdater() {
  // Yahan prompt-mode registration isliye hai kyunki naya build aate hi user ko turant reload nahi karna chahiye — sirf ek chhota toast, aur reload user ke click par.
  const [offlineDismissed, setOfflineDismissed] = useState(false)
  const [updateDismissed, setUpdateDismissed] = useState(false)
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.warn('Service worker registration failed:', error)
    },
  })

  // Offline aur update ke liye alag dismissal state rakhi gayi hai, taaki offline toast band karne se aage ke version updates miss na hon.
  if (needRefresh && !updateDismissed) {
    return (
      <div className="pwa-toast" role="status">
        <span>A new version of Daymark is ready.</span>
        <button onClick={() => updateServiceWorker(true)} type="button"><RefreshCw size={13} /> Reload</button>
        <button aria-label="Dismiss" className="pwa-toast-close" onClick={() => { setNeedRefresh(false); setUpdateDismissed(true) }} type="button"><X size={13} /></button>
      </div>
    )
  }

  if (offlineReady && !offlineDismissed) {
    return (
      <div className="pwa-toast" role="status">
        <span>Daymark is ready to work offline.</span>
        <button aria-label="Dismiss" className="pwa-toast-close" onClick={() => { setOfflineReady(false); setOfflineDismissed(true) }} type="button"><X size={13} /></button>
      </div>
    )
  }

  return null
}
