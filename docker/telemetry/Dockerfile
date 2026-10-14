FROM golang:1.22-alpine AS builder

WORKDIR /app

# Download dependencies
COPY go.mod ./
RUN go mod download || true

# Copy source code and build statically linked binary
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /telemetry-daemon ./cmd/telemetry-daemon

# Minimal production image (< 20 MB RAM footprint)
FROM alpine:3.19
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app

COPY --from=builder /telemetry-daemon .

EXPOSE 8080

CMD ["./telemetry-daemon"]
