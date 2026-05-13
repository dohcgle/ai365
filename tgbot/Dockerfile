# Python slim versiyasidan foydalanamiz
FROM python:3.12-slim

# Ishchi katalogni belgilaymiz
WORKDIR /app

# Atrof-muhit o'zgaruvchilarini sozlaymiz
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Kerakli paketlarni o'rnatamiz
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Bog'liqliklarni nusxalaymiz va o'rnatamiz
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Loyiha kodini nusxalaymiz
COPY . .

# Botni ishga tushiramiz
CMD ["python", "main.py"]
