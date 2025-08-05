# Build backend
FROM rust:1.70 as backend-builder
WORKDIR /usr/src/backend
COPY backend .
RUN cargo install --path .

# Build frontend
FROM rust:1.70 as frontend-builder
WORKDIR /usr/src/frontend
COPY frontend .
RUN cargo install --path .

# Final image
FROM rust:1.70
COPY --from=backend-builder /usr/local/cargo/bin/backend /usr/local/cargo/bin/
COPY --from=frontend-builder /usr/local/cargo/bin/frontend /usr/local/cargo/bin/
COPY backend/public /public

EXPOSE 10000
CMD ["backend"]