# Root Dockerfile referencing Docker Compose workflow
# To run the complete Every Child Reads platform:
# docker compose up --build
FROM node:20-alpine
WORKDIR /app
COPY . .
EXPOSE 3000 8000
CMD ["echo", "Please use: docker compose up --build to launch both Frontend & Backend services."]

