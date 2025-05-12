FROM texlive/texlive:latest

# Install dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-venv imagemagick

# Create and activate virtual environment, install Python packages
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"
RUN pip install --upgrade pip && pip install fastapi uvicorn

# Copy source code
COPY . /app
WORKDIR /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
