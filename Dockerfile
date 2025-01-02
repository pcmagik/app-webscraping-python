FROM node:16

# Instalacja Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list

# Instalacja zależności
RUN apt-get update && apt-get install -y \
    google-chrome-stable \
    libxss1 \
    && rm -rf /var/lib/apt/lists/*

# Ustaw zmienne środowiskowe dla Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

COPY package.json ./
RUN npm install && npm cache clean --force

COPY . .

EXPOSE 3000

CMD ["node", "server.js"] 