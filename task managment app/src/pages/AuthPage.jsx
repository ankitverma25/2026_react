import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Check, CircleCheck, LoaderCircle, LockKeyhole, Mail, UserRound } from 'lucide-react'
import useAuth from '../hooks/useAuth.js'
import useApi from '../hooks/useApi.js'
import InstallAppButton from '../components/InstallAppButton.jsx'
import api from '../lib/api.js'
import { demoUser } from '../data/demoTasks.js'

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const { user, saveSession } = useAuth()
  const { run, loading, error, setError } = useApi()
  // Yahan useState isliye use kiya hai kyunki signup/login ke controlled fields ko har keystroke par validate aur submit ke waqt serialize karna hai.
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [demoNotice, setDemoNotice] = useState(false)

  if (user) return <Navigate to="/app" replace />

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setDemoNotice(false)
    try {
      const response = await run(() => api.post(isSignup ? '/auth/signup' : '/auth/login', form))
      saveSession(response.data.user, response.data.token)
    } catch (requestError) {
      if (requestError.response) return
      // Local demo sign-in keeps the screens usable while the separately written backend is not running.
      const demoName = form.name.trim() || form.email.split('@')[0] || demoUser.name
      saveSession({ ...demoUser, name: demoName, email: form.email || demoUser.email }, 'demo-token')
      setDemoNotice(true)
    }
    navigate('/app')
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <Link className="brand-mark" to="/login" aria-label="Daymark home">
          <span className="brand-symbol"><Check size={19} strokeWidth={3} /></span> daymark
        </Link>
        <div className="auth-story-copy">
          <p className="eyebrow eyebrow-light">A little more room to think</p>
          <h1>Make space for the work that matters.</h1>
          <p className="story-note">A clear view of today. A calmer plan for everything after.</p>
        </div>
        <div className="story-bottom"><span>01</span><span className="story-rule" /><span>Plan with intention</span></div>
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
      </section>

      <section className="auth-panel">
        <div className="auth-panel-top"><span>YOUR WORKSPACE</span><span>01 / 02</span></div>
        <div className="auth-form-wrap">
          <div className="auth-heading-icon"><CircleCheck size={22} /></div>
          <p className="eyebrow">{isSignup ? 'Start fresh' : 'Welcome back'}</p>
          <h2>{isSignup ? 'Create your account' : 'Sign in to Daymark'}</h2>
          <p className="muted">{isSignup ? 'A focused week starts with one small step.' : 'Pick up right where your best work begins.'}</p>

          {demoNotice && <div className="notice notice-demo">API is offline. You are using a local demo session.</div>}
          {error && !demoNotice && <div className="notice notice-error">{error}</div>}
          {/* Yahan conditional rendering isliye use ki hai kyunki signup ko name input chahiye, login ko nahi, aur loading/error feedback request state se badalta hai. */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="field-label">Your name
                <span className="input-wrap"><UserRound size={17} /><input autoComplete="name" name="name" onChange={handleChange} placeholder="Alex Morgan" required value={form.name} /></span>
              </label>
            )}
            <label className="field-label">Email address
              <span className="input-wrap"><Mail size={17} /><input autoComplete="email" name="email" onChange={handleChange} placeholder="you@company.com" required type="email" value={form.email} /></span>
            </label>
            <label className="field-label">Password
              <span className="input-wrap"><LockKeyhole size={17} /><input autoComplete={isSignup ? 'new-password' : 'current-password'} minLength="6" name="password" onChange={handleChange} placeholder="At least 6 characters" required type="password" value={form.password} /></span>
            </label>
            <button className="button button-dark auth-submit" disabled={loading} type="submit">
              {loading ? <LoaderCircle className="spin" size={17} /> : null}
              {loading ? 'Please wait' : isSignup ? 'Create account' : 'Continue'}
              {!loading && <ArrowUpRight size={17} />}
            </button>
          </form>
          <p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to Daymark?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link></p>
          <div className="auth-demo-tip">Try any email and password to preview the app while the API is offline.</div>
        </div>
        <div className="auth-install"><InstallAppButton /></div>
        <div className="auth-footer"><span>DAYMARK / TASK SPACE</span><span>MADE FOR FOCUS</span></div>
      </section>
    </main>
  )
}