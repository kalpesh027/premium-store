'use client'

import { useState, useEffect } from "react"
import { cn } from "../utils/features"

const slides = [
  {
    image: "https://1.bp.blogspot.com/-K2rAfFUTuiU/XsO9bDiUJ6I/AAAAAAAAB94/K-qZAwIyYGUfCX4IOKbKMvTH25JCHmMXwCLcBGAsYHQ/w1200-h630-p-k-no-nu/44179397316295.5ec28bdc05409.jpg",
    alt: "iPhone 14 Promotion"
  },
  {
    image: "https://img.freepik.com/premium-vector/gradient-summer-sale-banner-with-photo_16148-1239.jpg",
    alt: "Slide 2"
  },
  {
    image: "/placeholder.svg?height=400&width=800",
    alt: "Slide 3"
  },
  {
    image: "/placeholder.svg?height=400&width=800",
    alt: "Slide 4"
  },
  {
    image: "/placeholder.svg?height=400&width=800",
    alt: "Slide 5"
  }
]

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative overflow-hidden bg-black rounded-lg aspect-[3/1]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            currentSlide === index ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentSlide === index 
                ? "bg-white w-4" 
                : "bg-white/50 hover:bg-white/75"
            )}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

