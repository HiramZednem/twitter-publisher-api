import "dotenv/config"; // Carga automáticamente las variables de entorno desde .env
import { z } from "zod";

/**
 * Esquema de validación de variables de entorno con Zod
 */
const twitterEnvSchema = z.object({
  TWITTER_USERNAME: z.string().min(1, "Twitter username is required"),
  TWITTER_PASSWORD: z.string().min(1, "Twitter password is required"),
  TWITTER_EMAIL: z.string().email("Valid Twitter email is required"),
  TWITTER_2FA_SECRET: z.string().optional(),
});

/**
 * Generar el tipo a partir del esquema
 */
export type TwitterConfig = z.infer<typeof twitterEnvSchema>;

/**
 * Parsea las variables de entorno
 */
const parsedEnv = twitterEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Error en la configuración:", parsedEnv.error.format());
  process.exit(1);
}

/**
 * Configuración validada con tipado correcto
 */
export const config: TwitterConfig = parsedEnv.data;