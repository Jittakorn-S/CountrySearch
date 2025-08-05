# Stage 1: Build the Next.js frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY frontend/ ./
RUN yarn build

# Stage 2: Build the Rust backend
FROM rust:1.77-slim AS backend-builder

WORKDIR /app
COPY backend/ ./
RUN cargo build --release

# Stage 3: Create the final image
FROM debian:stable-slim

WORKDIR /app

# Copy frontend static files
COPY --from=frontend-builder /app/out ./static

# Copy backend executable and data file
COPY --from=backend-builder /app/target/release/country-search-backend .
COPY backend/CountryData.xlsx .

EXPOSE 3000

CMD ["./country-search-backend"]