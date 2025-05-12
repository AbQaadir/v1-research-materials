# LaTeX TikZ Renderer API

This project provides a FastAPI-based web service for rendering LaTeX TikZ diagrams to images (JPG). It compiles user-submitted LaTeX/TikZ code, converts the output to an image, and returns the result as a base64-encoded string.

## Features

- Accepts LaTeX/TikZ code via a REST API.
- Compiles the code to PDF and converts it to JPG.
- Returns the image as a base64-encoded string.
- Includes a test script for API usage.
- Dockerfile for easy deployment.

## Requirements

- Python 3.10+
- Docker (optional, for containerized deployment)
- LaTeX (with TikZ), ImageMagick, FastAPI, Uvicorn

## Usage

### Run with Docker

```sh
docker build -t latex-tikz-renderer .
docker run -p 8000:8000 latex-tikz-renderer
```

### Run Locally

1. Install dependencies:
    ```sh
    pip install -r requirements.txt
    ```
2. Ensure `pdflatex` and `convert` (ImageMagick) are installed.
3. Start the server:
    ```sh
    uvicorn app.main:app --host 0.0.0.0 --port 8000
    ```

### API Example

Send a POST request to `/render` with your LaTeX/TikZ code:

```json
POST /render
{
  "code": "<your LaTeX/TikZ code here>"
}
```

Response:

```json
{
  "image_base64": "<base64-encoded JPG image>"
}
```

See [test_code.py](test_code.py) for an example client.

## File Structure

- `app/main.py` - FastAPI app and API endpoint
- `app/tikz_renderer.py` - TikZ rendering logic
- `app/templates/diagram.tex` - Example TikZ template
- `test_code.py` - Example client script
- `Dockerfile` - Container setup