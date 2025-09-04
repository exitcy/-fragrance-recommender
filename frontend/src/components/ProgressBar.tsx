import { animate } from 'motion'
import { useEffect, useRef } from 'react'

interface ProgressBarProps {
  current: number
  total: number
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progressRef = useRef<HTMLDivElement>(null)
  const percentage = (current / total) * 100

  useEffect(() => {
    if (progressRef.current) {
      animate(progressRef.current, { width: `${percentage}%` }, { duration: 0.3 })
    }
  }, [percentage])

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
      <div
        ref={progressRef}
        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export default ProgressBar
