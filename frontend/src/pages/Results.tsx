import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { animate } from 'motion'
import { ChevronDown, ChevronUp, Star, DollarSign, Clock, Zap } from 'lucide-react'

interface Fragrance {
  id: number
  name: string
  brand: string
  price: number
  notes: string[]
  projection: string
  longevity: string
  season: string[]
  context: string[]
  style: string[]
  description: string
}

interface QuizResults {
  real_deal: Fragrance[]
  budget_alternatives: Fragrance[]
  query_id: string
}

const Results = () => {
  const [results, setResults] = useState<QuizResults | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get results from sessionStorage
    const storedResults = sessionStorage.getItem('quizResults')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    }
    setLoading(false)

    // Animate results appearance
    animate('.results-content', { opacity: [0, 1], y: [20, 0] }, { duration: 0.6 })
  }, [])

  const toggleCard = (id: number) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCards(newExpanded)
  }

  const getProjectionIcon = (projection: string) => {
    switch (projection) {
      case 'low': return <Zap className="h-4 w-4 text-gray-400" />
      case 'moderate': return <Zap className="h-4 w-4 text-yellow-500" />
      case 'strong': return <Zap className="h-4 w-4 text-red-500" />
      default: return <Zap className="h-4 w-4 text-gray-400" />
    }
  }

  const getLongevityIcon = (longevity: string) => {
    switch (longevity) {
      case '4-6h': return <Clock className="h-4 w-4 text-gray-400" />
      case '6-8h': return <Clock className="h-4 w-4 text-yellow-500" />
      case '8h+': return <Clock className="h-4 w-4 text-green-500" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const FragranceCard = ({ fragrance }: { fragrance: Fragrance; type: 'real_deal' | 'budget' }) => {
    const isExpanded = expandedCards.has(fragrance.id)

    return (
      <div className="card hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{fragrance.name}</h3>
            <p className="text-gray-600">{fragrance.brand}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">${fragrance.price}</div>
            <div className="flex items-center space-x-2 mt-2">
              {getProjectionIcon(fragrance.projection)}
              <span className="text-sm text-gray-500 capitalize">{fragrance.projection}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              {getLongevityIcon(fragrance.longevity)}
              <span className="text-sm text-gray-500">{fragrance.longevity}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{fragrance.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {fragrance.style.map((style) => (
            <span
              key={style}
              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
            >
              {style}
            </span>
          ))}
        </div>

        <button
          onClick={() => toggleCard(fragrance.id)}
          className="w-full flex items-center justify-center space-x-2 py-2 text-primary-600 hover:text-primary-700 transition-colors"
        >
          <span className="font-medium">
            {isExpanded ? 'Show Less' : 'Show More'}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {fragrance.notes.map((note) => (
                <span
                  key={note}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  {note}
                </span>
              ))}
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Best for:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {fragrance.context.map((context) => (
                <span
                  key={context}
                  className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-sm"
                >
                  {context}
                </span>
              ))}
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Seasons:</h4>
            <div className="flex flex-wrap gap-2">
              {fragrance.season.map((season) => (
                <span
                  key={season}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
                >
                  {season}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your recommendations...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-8">Please take the quiz to get personalized recommendations.</p>
          <Link to="/quiz" className="btn-primary">
            Take Quiz
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="results-content">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Perfect Fragrances
            </h1>
            <p className="text-lg text-gray-600">
              Based on your preferences, here are our top recommendations
            </p>
          </div>

          {/* Real Deal Section */}
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <Star className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Premium Picks</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.real_deal.map((fragrance) => (
                <FragranceCard
                  key={fragrance.id}
                  fragrance={fragrance}
                  type="real_deal"
                />
              ))}
            </div>
          </div>

          {/* Budget Alternatives Section */}
          {results.budget_alternatives.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center space-x-2 mb-6">
                <DollarSign className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Budget Alternatives</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.budget_alternatives.map((fragrance) => (
                  <FragranceCard
                    key={fragrance.id}
                    fragrance={fragrance}
                    type="budget"
                  />
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center">
            <div className="card max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Want to refine your preferences?
              </h3>
              <p className="text-gray-600 mb-6">
                Take the quiz again with different preferences to discover more options.
              </p>
              <Link to="/quiz" className="btn-primary">
                Take Quiz Again
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
