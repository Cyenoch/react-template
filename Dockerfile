FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /usr/src/app
COPY . .
RUN pnpm install --frozen-lockfile
ENV NODE_ENV=production
RUN pnpm build
EXPOSE 3000/tcp
ENTRYPOINT [ "node", ".output/server/index.mjs" ]
