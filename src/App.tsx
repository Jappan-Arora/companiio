import { Routes, Route } from 'react-router'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

const Home = lazy(() => import('./pages/Home'))
const Discover = lazy(() => import('./pages/Discover'))
const VenueDetail = lazy(() => import('./pages/VenueDetail'))
const Reserve = lazy(() => import('./pages/Reserve'))
const Deals = lazy(() => import('./pages/Deals'))
const Itinerary = lazy(() => import('./pages/Itinerary'))
const ItineraryDetail = lazy(() => import('./pages/ItineraryDetail'))
const SurpriseMe = lazy(() => import('./pages/SurpriseMe'))
const Profile = lazy(() => import('./pages/Profile'))
const VenueDashboard = lazy(() => import('./pages/VenueDashboard'))
const Partner = lazy(() => import('./pages/Partner'))
import Outreach from './pages/Outreach'
const MyPlan = lazy(() => import('./pages/MyPlan'))
const Events = lazy(() => import('./pages/Events'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const Contact = lazy(() => import('./pages/Contact'))

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FF6B4A] border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Suspense fallback={<Loading />}><Home /></Suspense>} />
        <Route path="/discover" element={<Suspense fallback={<Loading />}><Discover /></Suspense>} />
        <Route path="/venue/:slug" element={<Suspense fallback={<Loading />}><VenueDetail /></Suspense>} />
        <Route path="/reserve/:slug" element={<Suspense fallback={<Loading />}><Reserve /></Suspense>} />
        <Route path="/deals" element={<Suspense fallback={<Loading />}><Deals /></Suspense>} />
        <Route path="/plans" element={<Suspense fallback={<Loading />}><Itinerary /></Suspense>} />
        <Route path="/plans/:slug" element={<Suspense fallback={<Loading />}><ItineraryDetail /></Suspense>} />
        <Route path="/surprise-me" element={<Suspense fallback={<Loading />}><SurpriseMe /></Suspense>} />
        <Route path="/profile" element={<Suspense fallback={<Loading />}><Profile /></Suspense>} />
        <Route path="/dashboard" element={<Suspense fallback={<Loading />}><VenueDashboard /></Suspense>} />
        <Route path="/partner" element={<Suspense fallback={<Loading />}><Partner /></Suspense>} />
        <Route path="/outreach" element={<Outreach />} />
        <Route path="/my-plan" element={<Suspense fallback={<Loading />}><MyPlan /></Suspense>} />
        <Route path="/events" element={<Suspense fallback={<Loading />}><Events /></Suspense>} />
        <Route path="/events/:eventId" element={<Suspense fallback={<Loading />}><EventDetail /></Suspense>} />
        <Route path="/privacy" element={<Suspense fallback={<Loading />}><Privacy /></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={<Loading />}><Terms /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<Loading />}><Contact /></Suspense>} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
