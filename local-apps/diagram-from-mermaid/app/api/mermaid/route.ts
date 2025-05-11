import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, unlink } from 'fs/promises'
import path from 'path'
import os from 'os'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Mermaid code is required' },
        { status: 400 }
      )
    }

    // Create a temporary file for the Mermaid code
    const tempDir = os.tmpdir()
    const inputFile = path.join(tempDir, 'mermaid-input.mmd')
    const outputFile = path.join(tempDir, 'mermaid-output.svg')

    // Write the Mermaid code to the temporary file
    await writeFile(inputFile, code)

    try {
      // Use mmdc to convert Mermaid to SVG
      await execAsync(`npx @mermaid-js/mermaid-cli -i ${inputFile} -o ${outputFile}`)

      // Read the generated SVG file
      const svg = await readFile(outputFile, 'utf-8')

      // Convert SVG to base64
      const base64 = Buffer.from(svg).toString('base64')

      // Clean up temporary files
      await unlink(inputFile)
      await unlink(outputFile)

      return NextResponse.json({ 
        base64,
        svg
      })
    } catch (error) {
      // Clean up temporary files in case of error
      try {
        await unlink(inputFile)
        await unlink(outputFile)
      } catch (cleanupError) {
        console.error('Error cleaning up temporary files:', cleanupError)
      }
      throw error
    }
  } catch (error) {
    console.error('Error rendering mermaid diagram:', error)
    return NextResponse.json(
      { error: 'Failed to render diagram' },
      { status: 500 }
    )
  }
} 