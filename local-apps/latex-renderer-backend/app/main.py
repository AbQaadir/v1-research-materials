from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import FileResponse
from tikz_renderer import render_tikz
import base64

app = FastAPI()

class TikzCode(BaseModel):
    code: str

@app.post("/render")
def render(code: TikzCode):
    image_path = render_tikz(code.code)
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")
    return {"image_base64": image_data}


# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
