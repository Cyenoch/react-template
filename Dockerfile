FROM oven/bun:latest AS base
WORKDIR /usr/src/app
COPY . .
RUN bun install --frozen-lockfile
ENV NODE_ENV=production
RUN bun -b run build
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", ".output/server/index.mjs" ]
