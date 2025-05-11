'use client'

import { useEffect, useRef } from 'react'
import { Generator, Parser } from 'latex.js'

interface LatexRendererProps {
  code: string
}

export default function LatexRenderer({ code }: LatexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && code) {
      try {
        const generator = new Generator()
        const parser = new Parser()
        const parsed = parser.parse(code)
        const html = generator.generate(parsed)
        containerRef.current.innerHTML = html
      } catch (error) {
        console.error('Error rendering LaTeX:', error)
        containerRef.current.innerHTML = `<div class="text-red-500 p-4">Error rendering LaTeX: ${error.message}</div>`
      }
    }
  }, [code])

  return <div ref={containerRef} className="latex-container" />
} 