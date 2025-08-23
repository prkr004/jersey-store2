import { Link } from 'react-router-dom'
import MotionButton from '../components/MotionButton'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="font-display text-6xl">404</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">The page you’re looking for can’t be found.</p>
      <Link to="/"><MotionButton className="mt-6">Back to Home</MotionButton></Link>
    </div>
  )
}