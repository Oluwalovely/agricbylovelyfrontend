import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Sprout, CloudSun, CalendarDays, Bell, ChartNoAxesCombined } from 'lucide-react'
import logo from '../assets/logo.png'
import farmImage from '../assets/agricbylov1.avif'
import dashboardPreview from '../assets/dashboard-showcase.png'
import cropPreview from '../assets/crop-showcase.png'
import weatherPreview from '../assets/weather-showcase.png'
import harvestPreview from '../assets/harvest-showcase.png'
import './Landing.css'

const features = [
    { icon: MapPin, title: 'Keep a record of each field', description: 'Save field names, sizes, and soil details. See which crops you have planted in each one.' },
    { icon: Sprout, title: 'Follow your crops from planting to harvest', description: 'Browse growing guides, record planting dates, update growth stages, and save your harvest results.' },
    { icon: CloudSun, title: 'Check the weather around your farm', description: 'Add your farm location to see local conditions, forecasts, and farming advice based on the weather.' },
    { icon: CalendarDays, title: 'See planting and harvest dates together', description: 'Use the calendar to review your planting records and estimated harvest dates before planning the next task.' },
    { icon: Bell, title: 'Keep reminders where you can find them', description: 'Read farm reminders and saved weather alerts in your notifications. Read alerts stay in your history until you remove them.' },
    { icon: ChartNoAxesCombined, title: 'Look back at what you have grown', description: 'Review crop summaries and harvest history, with recorded yields where you have added them.' },
]
const steps = [
    { title: 'Create your account', description: 'Add your name and farm details. You can update them later in your profile.' },
    { title: 'Add a field and your first crop', description: 'Record where you are growing it and when you planted it.' },
    { title: 'Keep your records up to date', description: 'Check the dashboard, update crop stages, and record each harvest as it happens.' },
]

const previews = [
    { id: 'dashboard', label: 'Dashboard', image: dashboardPreview, alt: 'Actual farm dashboard with example crop progress, weather, and upcoming harvests', title: 'Your farm at a glance', description: 'Active crops, local conditions, and upcoming harvests share one dashboard.' },
    { id: 'crops', label: 'Crop progress', image: cropPreview, alt: 'Example maize and tomato records showing growth stages, progress, and their fields', title: 'Follow each planting', description: 'See the field, growth stage, and estimated time to harvest for each saved crop.' },
    { id: 'weather', label: 'Weather', image: weatherPreview, alt: 'Example current conditions and three-day weather forecast from the app', title: 'Check local conditions', description: 'Review temperature, rainfall, humidity, and wind before planning work on your farm.' },
    { id: 'harvests', label: 'Harvest dates', image: harvestPreview, alt: 'Example upcoming tomato and maize harvest estimates linked to their fields', title: 'Know which dates to check', description: 'Review upcoming harvest estimates, then record the actual harvest when it is complete.' },
]

function Feature({ index }) {
    const { icon: Icon, title, description } = features[index]
    return <article className="landing-feature"><Icon size={28} strokeWidth={1.5} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>
}

export default function Landing() {
    const [preview, setPreview] = useState(0)
    const reveal = useRef(null)
    const selected = previews[preview]

    useEffect(() => {
        if (!window.IntersectionObserver) return
        const observer = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                reveal.current?.classList.add('is-revealed')
                observer.disconnect()
            }
        }, { threshold: 0.15 })
        if (reveal.current) observer.observe(reveal.current)
        return () => observer.disconnect()
    }, [])

    const handleTabKey = event => {
        let next
        if (event.key === 'ArrowRight') next = (preview + 1) % previews.length
        else if (event.key === 'ArrowLeft') next = (preview + previews.length - 1) % previews.length
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = previews.length - 1
        else return
        event.preventDefault()
        setPreview(next)
        document.getElementById(`preview-tab-${previews[next].id}`)?.focus()
    }

    return (
        <div className="landing">
            <a className="landing-skip" href="#main-content">Skip to content</a>
            <header className="landing-header">
                <div className="landing-header-inner landing-container">
                <Link to="/" aria-label="AgricByLovely home" className="landing-brand"><img src={logo} alt="AgricByLovely" width="84" height="84" /></Link>
                <nav aria-label="Main navigation" className="landing-nav">
                    <a href="#features" className="landing-section-link">Features</a>
                    <a href="#how-it-works" className="landing-section-link">How it works</a>
                    <Link to="/login">Log in</Link>
                    <Link to="/register" className="landing-button landing-button-small">Create account</Link>
                </nav>
                </div>
            </header>
            <main id="main-content">
                <section className="landing-hero landing-container" aria-labelledby="landing-title">
                    <div className="landing-hero-copy">
                        <h1 id="landing-title">Keep track of your farm, <span>from planting to harvest.</span></h1>
                        <p>AgricByLovely helps farmers in Nigeria keep field records, follow crop growth, and check local weather in one place.</p>
                        <p>See what is growing, what needs attention, and when a harvest is due, without piecing together scattered notes.</p>
                        <div className="landing-actions">
                            <Link to="/register" className="landing-button">Create your account <ArrowRight size={18} aria-hidden="true" /></Link>
                            <a href="#dashboard-preview" className="landing-text-link">See the dashboard <ArrowRight size={16} aria-hidden="true" /></a>
                        </div>
                    </div>
                    <div className="landing-hero-art">
                        <figure className="landing-hero-image">
                            <img src={farmImage} alt="Hands holding soil and a young plant" width="600" height="660" fetchPriority="high" />
                        </figure>
                        <figure className="landing-hero-crops">
                            <figcaption><Sprout size={18} aria-hidden="true" /> Crop progress <span>Example records</span></figcaption>
                            <img src={cropPreview} alt="Two example planting records from the app, showing maize growing and tomato flowering" width="744" height="506" fetchPriority="high" />
                            <p className="landing-hero-caption">Keep a record of what you plant and where it grows.</p>
                        </figure>
                    </div>
                </section>
                <section id="dashboard-preview" className="landing-preview-section" aria-labelledby="preview-title">
                    <div className="landing-container">
                        <div className="landing-section-intro landing-preview-intro">
                            <h2 id="preview-title">See what is happening on your farm.</h2>
                            <p>Your dashboard brings active crops, upcoming harvests, weather, and recent alerts together. Start here when you want to check on your farm.</p>
                        </div>
                        <div className="landing-preview-tabs" role="tablist" aria-label="Explore app previews">
                            {previews.map((item, index) => <button key={item.id} id={`preview-tab-${item.id}`} role="tab" type="button" aria-selected={preview === index} aria-controls="preview-panel" tabIndex={preview === index ? 0 : -1} onClick={() => setPreview(index)} onKeyDown={handleTabKey}>{item.label}</button>)}
                        </div>
                        <div ref={reveal} className="landing-preview-stage" id="preview-panel" role="tabpanel" aria-labelledby={`preview-tab-${selected.id}`} tabIndex={0}>
                            <div className={`landing-preview-screen landing-preview-screen-${selected.id}`} tabIndex={selected.id === 'dashboard' ? 0 : undefined} role={selected.id === 'dashboard' ? 'region' : undefined} aria-label={selected.id === 'dashboard' ? 'Dashboard image, scroll to see more' : undefined}><img src={selected.image} alt={selected.alt} loading="lazy" /></div>
                            {selected.id === 'dashboard' && <p className="landing-preview-scroll-hint">Swipe across the dashboard, or choose a close-up above.</p>}
                            <div className="landing-preview-note"><h3>{selected.title}</h3><p>{selected.description}</p></div>
                        </div>
                        <p className="landing-example-note">The actual app, shown with example farm records and weather. Your account starts with your own records.</p>
                    </div>
                </section>
                <section id="features" className="landing-features landing-container" aria-labelledby="features-title">
                    <div className="landing-section-intro">
                        <h2 id="features-title">Keep your fields, crops, and harvests together.</h2>
                        <p>Whether you are adding your first planting or reviewing a completed harvest, your records stay connected to your fields and crops.</p>
                    </div>
                    <div className="landing-feature-story">
                        <div className="landing-feature-copy"><Feature index={0} /><Feature index={1} /></div>
                        <figure className="landing-crop-detail"><img src={cropPreview} alt="Close-up of example crop records and their field assignments" width="744" height="506" loading="lazy" /><figcaption>Crop progress and field names stay together.</figcaption></figure>
                    </div>
                    <div className="landing-feature-story landing-feature-story-weather">
                        <figure className="landing-weather-detail"><img src={weatherPreview} alt="Close-up of the app's current weather and daily forecast with example conditions" width="760" height="556" loading="lazy" /><figcaption>Example weather preview. Conditions depend on your saved farm location.</figcaption></figure>
                        <div className="landing-feature-copy"><Feature index={2} /><Feature index={3} /></div>
                    </div>
                    <div className="landing-feature-grid"><Feature index={4} /><Feature index={5} /></div>
                </section>
                <section id="how-it-works" className="landing-steps-section" aria-labelledby="steps-title">
                    <div className="landing-container landing-steps-layout">
                        <div className="landing-section-intro"><h2 id="steps-title">Set up your farm in three steps.</h2><p>You do not need every detail ready. Set up your account, add your first field, and build your records as you go.</p></div>
                        <ol className="landing-steps">{steps.map(({ title, description }, index) => <li key={title}><span className="landing-step-number" aria-hidden="true">{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
                    </div>
                </section>
                <section className="landing-cta landing-container" aria-labelledby="cta-title">
                    <h2 id="cta-title">Add your first field and crop.</h2>
                    <p>Create an account and add your first field and crop. Already using AgricByLovely? Log in to pick up where you left off.</p>
                    <div className="landing-actions">
                        <Link to="/register" className="landing-button">Create your account <ArrowRight size={18} aria-hidden="true" /></Link>
                        <Link to="/login" className="landing-text-link">Log in <ArrowRight size={16} aria-hidden="true" /></Link>
                    </div>
                </section>
            </main>
            <footer className="landing-footer landing-container">
                <div><span className="landing-footer-name">AgricByLovely</span><p>Field and crop records for farmers in Nigeria.</p></div>
                <nav aria-label="Footer navigation"><a href="#features">Features</a><Link to="/login">Log in</Link><Link to="/register">Create account</Link></nav>
            </footer>
        </div>
    )
}
