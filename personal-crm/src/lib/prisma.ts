import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function getConnectionString(): string {
  const url = process.env.DATABASE_URL;

  // Use DATABASE_URL directly if it's a real postgres URL
  if (url && (url.startsWith("postgresql://") || url.startsWith("postgres://"))) {
    return url;
  }

  // Fall back to individual DB_* env vars (e.g. Portainer/Docker Compose setup)
  const host     = process.env.DB_HOST;
  const user     = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const name     = process.env.DB_NAME;
  const port     = process.env.DB_PORT     ?? "5432";
  const ssl      = process.env.SSL_MODE    ?? "disable";
  const timeout  = process.env.CONNECT_TIMEOUT ?? "10";

  if (host && user && password && name) {
    return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${name}?sslmode=${ssl}&connect_timeout=${timeout}`;
  }

  throw new Error(
    "Database not configured. Set DATABASE_URL or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME."
  );
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: getConnectionString() });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
