#!/usr/bin/env bash
# After prisma generate, copy the generated .d.ts files into @prisma/client
# so TypeScript can resolve PrismaClient from '@prisma/client'.
SRC="node_modules/.prisma/client/index.d.ts"
DST_DEFAULT="node_modules/@prisma/client/default.d.ts"
DST_INDEX="node_modules/@prisma/client/index.d.ts"

if [ -f "$SRC" ]; then
  cp "$SRC" "$DST_DEFAULT"
  cp "$SRC" "$DST_INDEX"
  echo "[fix-prisma-types] Prisma type bridge applied."
else
  echo "[fix-prisma-types] WARNING: $SRC not found – skipping type bridge."
fi
