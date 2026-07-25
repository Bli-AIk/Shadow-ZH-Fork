set shell := ["zsh", "-cu"]

default:
    @just --list

# Generate local search indexes, then start the hot-reloading development server.
dev:
    npm run wiki-index
    npm run dev

# Refresh the local Wiki search indexes while the development server is running.
refresh:
    npm run wiki-index

# Build everything, including freshly downloaded/generated Kristal API docs.
build:
    npm run build

# Build without downloading or regenerating Kristal API docs.
build-fast:
    npm run build-fast
