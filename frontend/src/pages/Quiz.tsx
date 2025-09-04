import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { animate } from 'motion'
import { useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProgressBar from '../components/ProgressBar'

interface QuizData {
  context: string
  season: string
  projection: string
  longevity: string
  style: string[]
  budget: number
  allergies: string[]
}

const Quiz = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [quizData, setQuizData] = useState<QuizData>({
    context: '',
    season: '',
    projection: '',
    longevity: '',
    style: [],
    budget: 100,
    allergies: []
  })

  const totalSteps = 6

  const questions = [
    {
      id: 1,
      title: "What's the main context for your fragrance?",
      options: [
        { value: 'office', label: 'Office/Professional' },
        { value: 'casual', label: 'Casual/Everyday' },
        { value: 'date-night', label: 'Date Night' },
        { value: 'club', label: 'Club/Party' },
        { value: 'gym', label: 'Gym/Sport' }
      ],
      type: 'single'
    },
    {
      id: 2,
      title: "What season are you shopping for?",
      options: [
        { value: 'spring', label: 'Spring' },
        { value: 'summer', label: 'Summer' },
        { value: 'fall', label: 'Fall' },
        { value: 'winter', label: 'Winter' },
        { value: 'all-year', label: 'All Year Round' }
      ],
      type: 'single'
    },
    {
      id: 3,
      title: "How strong do you want the projection to be?",
      options: [
        { value: 'low', label: 'Subtle/Close to skin' },
        { value: 'moderate', label: 'Moderate/Noticeable' },
        { value: 'strong', label: 'Strong/Attention-grabbing' }
      ],
      type: 'single'
    },
    {
      id: 4,
      title: "How long should it last?",
      options: [
        { value: '4-6h', label: '4-6 hours' },
        { value: '6-8h', label: '6-8 hours' },
        { value: '8h+', label: '8+ hours' }
      ],
      type: 'single'
    },
    {
      id: 5,
      title: "What style appeals to you? (Select 2-3)",
      options: [
        { value: 'fresh', label: 'Fresh & Clean' },
        { value: 'woody', label: 'Woody & Masculine' },
        { value: 'sweet', label: 'Sweet & Gourmand' },
        { value: 'spicy', label: 'Spicy & Warm' },
        { value: 'citrus', label: 'Citrus & Bright' },
        { value: 'powdery', label: 'Powdery & Soft' },
        { value: 'green', label: 'Green & Natural' }
      ],
      type: 'multiple'
    },
    {
      id: 6,
      title: "What's your budget?",
      type: 'budget'
    }
  ]

  useEffect(() => {
    // Animate step transitions
    animate('.quiz-content', { opacity: [0, 1], x: [20, 0] }, { duration: 0.3 })
  }, [currentStep])

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleOptionSelect = (value: string) => {
    const currentQuestion = questions[currentStep - 1]
    
    if (currentQuestion.type === 'single') {
      setQuizData(prev => ({ ...prev, [currentQuestion.id === 1 ? 'context' : currentQuestion.id === 2 ? 'season' : currentQuestion.id === 3 ? 'projection' : 'longevity']: value }))
    } else if (currentQuestion.type === 'multiple') {
      setQuizData(prev => ({
        ...prev,
        style: prev.style.includes(value) 
          ? prev.style.filter(s => s !== value)
          : prev.style.length < 3 
            ? [...prev.style, value]
            : prev.style
      }))
    }
  }

  const handleBudgetChange = (value: number) => {
    setQuizData(prev => ({ ...prev, budget: value }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/v1/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      })

      if (response.ok) {
        const result = await response.json()
        // Store results in sessionStorage for the results page
        sessionStorage.setItem('quizResults', JSON.stringify(result))
        navigate('/results')
      } else {
        console.error('Failed to submit quiz')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
    }
  }

  const renderQuestion = () => {
    const question = questions[currentStep - 1]
    
    if (question.type === 'budget') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <label className="text-lg font-medium text-gray-700 mb-4 block">
              What's your maximum budget?
            </label>
            <div className="text-3xl font-bold text-primary-600 mb-4">
              ${quizData.budget}
            </div>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={quizData.budget}
              onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>$20</span>
              <span>$300</span>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          {question.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options?.map((option) => {
            const isSelected = question.type === 'single' 
              ? quizData[question.id === 1 ? 'context' : question.id === 2 ? 'season' : question.id === 3 ? 'projection' : 'longevity'] === option.value
              : quizData.style.includes(option.value)
            
            return (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const canProceed = () => {
    const question = questions[currentStep - 1]
    
    if (question.type === 'single') {
      return quizData[question.id === 1 ? 'context' : question.id === 2 ? 'season' : question.id === 3 ? 'projection' : 'longevity'] !== ''
    } else if (question.type === 'multiple') {
      return quizData.style.length >= 2
    } else if (question.type === 'budget') {
      return quizData.budget > 0
    }
    
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <ProgressBar current={currentStep} total={totalSteps} />
          
          <div className="quiz-content">
            {renderQuestion()}
          </div>
          
          <div className="flex justify-between mt-12">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>
            
            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Get Recommendations</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz
