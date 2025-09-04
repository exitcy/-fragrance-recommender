import { Link } from 'react-router-dom'
import { animate } from 'motion'
import { useEffect } from 'react'
import { Sparkles, ArrowRight, Star, Zap } from 'lucide-react'

const Landing = () => {
  useEffect(() => {
    // Animate hero elements
    animate('.hero-title', { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.2 })
    animate('.hero-subtitle', { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.4 })
    animate('.hero-cta', { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.6 })
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="hero-title opacity-0">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Find Your Perfect
                <span className="text-primary-600"> Fragrance</span>
              </h1>
            </div>
            
            <div className="hero-subtitle opacity-0">
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Take our 60-second quiz and discover personalized fragrance recommendations 
                tailored to your style, budget, and preferences.
              </p>
            </div>
            
            <div className="hero-cta opacity-0">
              <Link 
                to="/quiz" 
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Start Quiz</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose FragranceFinder?
            </h2>
            <p className="text-lg text-gray-600">
              Our AI-powered system analyzes thousands of fragrances to find your perfect match.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                Our algorithm considers your style, season, and context to find the perfect fragrance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Budget Options</h3>
              <p className="text-gray-600">
                Get both premium recommendations and affordable alternatives that smell similar.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick & Easy</h3>
              <p className="text-gray-600">
                Complete our quiz in under 90 seconds and get instant personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Discover Your Signature Scent?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of users who have found their perfect fragrance with our quiz.
          </p>
          <Link 
            to="/quiz" 
            className="bg-white text-gray-900 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing
