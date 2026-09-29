import { ArrowDownToLine, Share, X } from 'lucide-react'
import usePwaInstall from '../hooks/usePwaInstall.js'

export default function InstallAppButton() {
  const { canPrompt, showIosHint, installed, dismissed, install, dismiss } = usePwaInstall()

  // Yahan component tab render hota hai jab browser native prompt de sakta hai, ya iOS Safari mein manual instructions chahiye — installed ya dismiss hone par button hat jata hai.
  if (installed || dismissed || (!canPrompt && !showIosHint)) return null

  return (
    <div className="install-wrap">
      <button aria-label={canPrompt ? 'Install app' : 'Add to Home Screen'} className="install-button" onClick={install} type="button">
        {canPrompt ? <ArrowDownToLine size={15} /> : <Share size={15} />}
        <span>{canPrompt ? 'Install app' : 'Add to Home Screen'}</span>
      </button>
      {showIosHint && <span className="install-hint">Tap Share, then “Add to Home Screen”.</span>}
      <button aria-label="Dismiss install suggestion" className="install-dismiss" onClick={dismiss} type="button"><X size={12} /></button>
    </div>
  )
}
