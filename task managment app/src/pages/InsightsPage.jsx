import { ArrowRight, CalendarClock, CircleCheck, Flag, ListTodo } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function InsightsPage() {
  return (
    <section className="insights-view">
      <p className="eyebrow">A MOMENT TO REFLECT</p>
      <div className="insights-title-row"><div><h1>Small wins,<br /><em>in perspective.</em></h1><p className="muted">A little look at how your week is taking shape.</p></div><div className="insights-stamp"><span>WEEK</span><strong>40</strong><small>2026</small></div></div>
      <div className="insight-grid">
        <article className="insight-panel insight-dark"><span className="insight-icon"><ListTodo size={18} /></span><p className="eyebrow eyebrow-light">YOUR OPEN LOOPS</p><strong>06</strong><p>Tasks still have room to move. Pick one and give it ten minutes.</p></article>
        <article className="insight-panel insight-coral"><span className="insight-icon"><CircleCheck size={18} /></span><p className="eyebrow">ALREADY DONE</p><strong>03</strong><p>That is real progress. Take a second to let it count.</p></article>
        <article className="insight-panel insight-light"><span className="insight-icon"><CalendarClock size={18} /></span><p className="eyebrow">COMING UP</p><strong>02</strong><p>Two dates on the horizon this week. You have time to prepare.</p></article>
      </div>
      <div className="insights-note"><Flag size={18} /><div><strong>Make the next thing the right thing.</strong><p>Progress is not a perfect checklist. It is a direction you choose again.</p></div><Link to="/app">Back to tasks <ArrowRight size={15} /></Link></div>
      <div className="insights-bars"><div className="bars-heading"><div><p className="eyebrow">THE LAST FEW DAYS</p><h2>Energy, spent well.</h2></div><span>SEPTEMBER 23 — 29</span></div><div className="bar-chart" aria-label="Completed tasks over the past week"><div className="bar-column"><i style={{ height: '35%' }} /><span>W</span></div><div className="bar-column"><i style={{ height: '52%' }} /><span>T</span></div><div className="bar-column"><i style={{ height: '31%' }} /><span>F</span></div><div className="bar-column"><i style={{ height: '70%' }} /><span>S</span></div><div className="bar-column"><i style={{ height: '45%' }} /><span>S</span></div><div className="bar-column"><i style={{ height: '83%' }} /><span>M</span></div><div className="bar-column today"><i style={{ height: '61%' }} /><span>T</span></div></div></div>
    </section>
  )
}