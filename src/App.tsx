import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import { AnimatePresence } from 'framer-motion'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Account = lazy(() => import('./pages/Account'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Suspense fallback={<PageSkeleton />}>
                  <Home />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/shop"
            element={
              <PageTransition>
                <Suspense fallback={<PageSkeleton />}>
                  <Shop />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PageTransition>
                <Suspense fallback={<PageSkeleton />}>
                  <ProductDetail />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/cart"
            element={
              <PageTransition>
                <Suspense fallback={<PageSkeleton />}>
                  <Cart />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/checkout"
            element={
              <PageTransition>
                <Suspense fallback={<PageSkeleton />}>
                  <Checkout />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/order/confirmation"
            element={
              <PageTransition>
                <Suspense fallback={<PageSkeleton />}>
                  <OrderConfirmation />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/account/*"
            element={
              <PageTransition>
                <Suspense fallback={<PageSkeleton />}>
                  <Account />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <Suspense fallback={<PageSkeleton />}>
                  <About />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <Suspense fallback={<PageSkeleton />}>
                  <Contact />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <Suspense fallback={<PageSkeleton />}>
                  <NotFound />
                </Suspense>
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-2/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}