import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Sprout, CloudSun, CalendarDays, Bell, ChartNoAxesCombined } from 'lucide-react'
import logo from '../assets/logo.png'
import farmImage from '../assets/agricbylov1.avif'
import dashboardPreview from '../assets/dashboard-preview.png'
import './Landing.css'

const features = [
    { icon: MapPin, title: 'Keep a record of each field', description: 'Save field names, sizes, and soil details. See which crops you have planted in each one.' },
    { icon: Sprout, title: 'Follow your crops from planting to harvest', description: 'Browse growing guides, record planting dates, update growth stages, and save your harvest results.' },
    { icon: CloudSun, title: 'Check the weather around your farm', description: 'Add your farm location to see local conditions, forecasts, and farming advice based on the weather.' },
    { icon: CalendarDays, title: 'See planting and harvest dates together', description: 'Use the calendar to review your planting records and estimated harvest dates before planning the next task.' },
    { icon: Bell, title: 'Keep reminders where you can find them', description: 'Read farm reminders and saved weather alerts in your notifications. Read alerts stay in your history until you remove them.' },
    { icon: ChartNoAxesCombined, title: 'Look back at what you have grown', description: 'Review crop summaries and harvest history, with recorded yields and income where you have added them.' },
]
const steps = [
    { title: 'Create your account', description: 'Add your name and farm details. You can update them later in your profile.' },
    { title: 'Add a field and your first crop', description: 'Record where you are growing it and when you planted it.' },
    { title: 'Keep your records up to date', description: 'Check the dashboard, update crop stages, and record each harvest as it happens.' },
]

export default function Landing() {
    return (
        <div className="landing">
            <a className="landing-skip" href="#main-content">Skip to content</a>
            <header className="landing-header landing-container">
                <Link to="/" aria-label="AgricByLovely home" className="landing-brand"><img src={logo} alt="AgricByLovely" width="84" height="84" /></Link>
                <nav aria-label="Main navigation" className="landing-nav">
                    <a href="#features" className="landing-section-link">Features</a>
                    <a href="#how-it-works" className="landing-section-link">How it works</a>
                    <Link to="/login">Log in</Link>
                    <Link to="/register" className="landing-button landing-button-small">Create account</Link>
                </nav>
            </header>
            <main id="main-content">
                <section className="landing-hero landing-container" aria-labelledby="landing-title">
                    <div className="landing-hero-copy">
                        <h1 id="landing-title">Keep track of your farm, from planting to harvest.</h1>
                        <p>AgricByLovely helps farmers in Nigeria keep field records, follow crop growth, and check local weather in one place.</p>
                        <p>See what is growing, what needs attention, and when a harvest is due, without piecing together scattered notes.</p>
                        <div className="landing-actions">
                            <Link to="/register" className="landing-button">Create your account <ArrowRight size={18} aria-hidden="true" /></Link>
                            <a href="#dashboard-preview" className="landing-text-link">See the dashboard <ArrowRight size={16} aria-hidden="true" /></a>
                        </div>
                    </div>
                    <figure className="landing-hero-image">
                        <img src={farmImage} alt="Hands holding soil and a young plant" width="600" height="660" fetchPriority="high" />
                        <figcaption>Keep a record of what you plant and where it grows.</figcaption>
                    </figure>
                </section>
                <section id="dashboard-preview" className="landing-preview-section" aria-labelledby="preview-title">
                    <div className="landing-container">
                        <div className="landing-section-intro">
                            <h2 id="preview-title">See what is happening on your farm.</h2>
                            <p>Your dashboard brings active crops, upcoming harvests, weather, and recent alerts together. Start here when you want to check on your farm.</p>
                        </div>
                        <figure className="landing-preview">
                            <img src={dashboardPreview} alt="AgricByLovely dashboard showing sample maize and tomato records, crop stages, and links to harvests and alerts" width="1280" height="800" loading="lazy" />
                            <figcaption>The actual dashboard, shown with example farm records. Your account starts with your own records.</figcaption>
                        </figure>
                    </div>
                </section>
                <section id="features" className="landing-features landing-container" aria-labelledby="features-title">
                    <div className="landing-section-intro">
                        <h2 id="features-title">Keep your fields, crops, and harvests together.</h2>
                        <p>Whether you are adding your first planting or reviewing a completed harvest, your records stay connected to your fields and crops.</p>
                    </div>
                    <div className="landing-feature-grid">
                        {features.map(({ icon: Icon, title, description }) => <article className="landing-feature" key={title}><Icon size={25} strokeWidth={1.6} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>)}
                    </div>
                </section>
                <section id="how-it-works" className="landing-steps-section" aria-labelledby="steps-title">
                    <div className="landing-container landing-steps-layout">
                        <div className="landing-section-intro"><h2 id="steps-title">Set up your farm in three steps.</h2><p>You do not need every detail ready. Set up your account, add your first field, and build your records as you go.</p></div>
                        <ol className="landing-steps">{steps.map(({ title, description }) => <li key={title}><h3>{title}</h3><p>{description}</p></li>)}</ol>
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
