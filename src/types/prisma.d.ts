// Bridge declaration for Prisma 7 — types live in .prisma/client
declare module '@prisma/client' {
  export * from '../../node_modules/.prisma/client/default';
  export { default } from '../../node_modules/.prisma/client/default';
}
