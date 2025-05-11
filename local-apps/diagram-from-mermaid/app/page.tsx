"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Download, Copy, RefreshCw } from "lucide-react"
import mermaid from "mermaid"
import LatexRenderer from "@/components/LatexRenderer"

export default function DiagramRenderer() {
  const [code, setCode] = useState<string>(
    `graph TD;
    A["Start"] --> B["Process"];
    B --> C["Decision"];
    C -->|"Yes"| D["Action 1"];
    C -->|"No"| E["Action 2"];
    D --> F["End"];
    E --> F;`,
  )
  const [svg, setSvg] = useState<string>("")
  const [theme, setTheme] = useState<string>("default")
  const [fontSize, setFontSize] = useState<number>(16)
  const [useAnimation, setUseAnimation] = useState<boolean>(true)
  const [isRendering, setIsRendering] = useState<boolean>(false)
  const [diagramType, setDiagramType] = useState<"mermaid" | "latex">("mermaid")
  const svgContainerRef = useRef<HTMLDivElement>(null)

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme,
      fontSize: fontSize,
      securityLevel: "loose",
      flowchart: {
        useMaxWidth: false,
        curve: "basis",
        htmlLabels: true,
      },
      sequence: {
        useMaxWidth: false,
        diagramMarginX: 50,
        diagramMarginY: 30,
        actorMargin: 80,
      },
      gantt: {
        useMaxWidth: false,
      },
    })
    if (diagramType === "mermaid") {
      renderDiagram()
    }
  }, [theme, fontSize, diagramType])

  const renderDiagram = async () => {
    if (!code.trim()) {
      setSvg("")
      return
    }

    if (diagramType === "latex") {
      return
    }

    setIsRendering(true)
    try {
      // Clear previous SVG while rendering
      setSvg("")

      // Update mermaid config
      mermaid.initialize({
        startOnLoad: false,
        theme: theme,
        fontSize: fontSize,
        securityLevel: "loose",
        flowchart: {
          useMaxWidth: false,
          curve: "basis",
          htmlLabels: true,
        },
        sequence: {
          useMaxWidth: false,
          diagramMarginX: 50,
          diagramMarginY: 30,
          actorMargin: 80,
        },
        gantt: {
          useMaxWidth: false,
        },
      })

      const { svg } = await mermaid.render("mermaid-diagram", code)
      setSvg(svg)
    } catch (error) {
      console.error("Failed to render diagram:", error)
      setSvg(`<div class="text-red-500 p-4">Error rendering diagram: ${error.message}</div>`)
    } finally {
      setIsRendering(false)
    }
  }

  const handleCopyAsSVG = () => {
    if (svg) {
      navigator.clipboard.writeText(svg)
    }
  }

  const handleDownloadSVG = () => {
    if (svg) {
      const blob = new Blob([svg], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "diagram.svg"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Diagram Renderer</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Diagram Code</h2>
                <Select value={diagramType} onValueChange={(value: "mermaid" | "latex") => setDiagramType(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mermaid">Mermaid</SelectItem>
                    <SelectItem value="latex">LaTeX/TikZ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Enter your ${diagramType === "mermaid" ? "Mermaid" : "LaTeX/TikZ"} code here...`}
                className="font-mono h-[400px] resize-none"
              />
              <div className="flex justify-between mt-4">
                <Button onClick={renderDiagram} disabled={isRendering} className="flex items-center gap-2">
                  {isRendering ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Rendering...
                    </>
                  ) : (
                    "Render Diagram"
                  )}
                </Button>
                <div className="flex items-center gap-2">
                  <Label htmlFor="animation" className="text-sm">
                    Animation
                  </Label>
                  <Switch id="animation" checked={useAnimation} onCheckedChange={setUseAnimation} />
                </div>
              </div>
            </CardContent>
          </Card>

          {diagramType === "mermaid" && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4">Styling Options</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="forest">Forest</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Font Size: {fontSize}px</Label>
                      <Slider
                        id="fontSize"
                        min={10}
                        max={24}
                        step={1}
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Rendered Diagram</h2>
                {diagramType === "mermaid" && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyAsSVG}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy SVG
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadSVG}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>

              <div
                ref={svgContainerRef}
                className={`bg-white rounded-md p-4 min-h-[400px] overflow-auto flex items-center justify-center border ${
                  useAnimation ? "transition-all duration-500" : ""
                }`}
              >
                {diagramType === "mermaid" ? (
                  <div dangerouslySetInnerHTML={{ __html: svg }} />
                ) : (
                  <LatexRenderer code={code} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Examples</h2>
            <Tabs defaultValue="flowchart">
              <TabsList className="mb-4">
                <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
                <TabsTrigger value="sequence">Sequence</TabsTrigger>
                <TabsTrigger value="class">Class Diagram</TabsTrigger>
                <TabsTrigger value="gantt">Gantt</TabsTrigger>
                <TabsTrigger value="latex">LaTeX/TikZ</TabsTrigger>
              </TabsList>

              <TabsContent value="flowchart">
                <div className="font-mono text-sm p-4 bg-gray-100 rounded-md overflow-x-auto">
                  {`graph TD;
    A["Start"] --> B["Process"];
    B --> C["Decision"];
    C -->|"Yes"| D["Action 1"];
    C -->|"No"| E["Action 2"];
    D --> F["End"];
    E --> F;`}
                </div>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setDiagramType("mermaid")
                    setCode(`graph TD;
    A["Start"] --> B["Process"];
    B --> C["Decision"];
    C -->|"Yes"| D["Action 1"];
    C -->|"No"| E["Action 2"];
    D --> F["End"];
    E --> F;`)
                    setTimeout(renderDiagram, 100)
                  }}
                >
                  Use this example
                </Button>
              </TabsContent>

              <TabsContent value="sequence">
                <div className="font-mono text-sm p-4 bg-gray-100 rounded-md overflow-x-auto">
                  {`sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`}
                </div>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setDiagramType("mermaid")
                    setCode(`sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`)
                    setTimeout(renderDiagram, 100)
                  }}
                >
                  Use this example
                </Button>
              </TabsContent>

              <TabsContent value="class">
                <div className="font-mono text-sm p-4 bg-gray-100 rounded-md overflow-x-auto">
                  {`classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }`}
                </div>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setDiagramType("mermaid")
                    setCode(`classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }`)
                    setTimeout(renderDiagram, 100)
                  }}
                >
                  Use this example
                </Button>
              </TabsContent>

              <TabsContent value="gantt">
                <div className="font-mono text-sm p-4 bg-gray-100 rounded-md overflow-x-auto">
                  {`gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2023-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2023-01-12, 12d
    another task     :24d`}
                </div>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setDiagramType("mermaid")
                    setCode(`gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2023-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2023-01-12, 12d
    another task     :24d`)
                    setTimeout(renderDiagram, 100)
                  }}
                >
                  Use this example
                </Button>
              </TabsContent>

              <TabsContent value="latex">
                <div className="font-mono text-sm p-4 bg-gray-100 rounded-md overflow-x-auto">
                  {`\\begin{tikzpicture}
\\draw (0,0) -- (4,0) -- (4,4) -- (0,4) -- cycle;
\\draw (2,2) circle (1);
\\draw (2,2) -- (4,2);
\\draw (2,2) -- (2,4);
\\end{tikzpicture}`}
                </div>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setDiagramType("latex")
                    setCode(`\\begin{tikzpicture}
\\draw (0,0) -- (4,0) -- (4,4) -- (0,4) -- cycle;
\\draw (2,2) circle (1);
\\draw (2,2) -- (4,2);
\\draw (2,2) -- (2,4);
\\end{tikzpicture}`)
                  }}
                >
                  Use this example
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
