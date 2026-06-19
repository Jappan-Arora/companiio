import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

// Eager imports for instant navigation — no lazy loading delays
import Home from './pages/Home'
import Discover from './pages/Discover'
import VenueDetail from './pages/VenueDetail'
import Reserve from './pages/Reserve'
import Deals from './pages/Deals'
import Itinerary from './pages/Itinerary'
import ItineraryDetail from './pages/ItineraryDetail'
import SurpriseMe from './pages/SurpriseMe'
import Profile from './pages/Profile'
import PartnerDashboard from './pages/PartnerDashboard'
import QRCodeDisplay from './pages/QRCodeDisplay'
import CreatePlan from './pages/CreatePlan'
import ViewCustomPlan from './pages/ViewCustomPlan'
import VenueSignup from './pages/VenueSignup'
import InstallPrompt from './components/InstallPrompt'
import ToastContainer from './components/Toast'
import Partner from './pages/Partner'
import Outreach from './pages/Outreach'
import MyPlan from './pages/MyPlan'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'

export default function App() {
  return (
    <>
    <ToastContainer />
    <InstallPrompt />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/venue/:slug" element={<VenueDetail />} />
        <Route path="/reserve/:slug" element={<Reserve />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/plans" element={<Itinerary />} />
        <Route path="/plans/:slug" element={<ItineraryDetail />} />
        <Route path="/surprise-me" element={<SurpriseMe />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<PartnerDashboard />} />
        <Route path="/qr/:code" element={<QRCodeDisplay />} />
        <Route path="/create-plan" element={<CreatePlan />} />
        <Route path="/plan/:planId" element={<ViewCustomPlan />} />
        <Route path="/list-your-venue" element={<VenueSignup />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/outreach" element={<Outreach />} />
        <Route path="/my-plan" element={<MyPlan />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}
