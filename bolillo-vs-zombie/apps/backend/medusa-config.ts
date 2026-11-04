import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const isProduction = process.env.NODE_ENV === "production";
const redisUrl = process.env.REDIS_URL;

if (isProduction && !redisUrl) {
  console.error("REDIS_URL is required when NODE_ENV=production.");
  process.exit(1);
}

const productionRedisModules = isProduction
  ? [
      {
        resolve: "@medusajs/medusa/event-bus-redis",
        options: { redisUrl },
      },
      {
        resolve: "@medusajs/medusa/workflow-engine-redis",
        options: { redis: { redisUrl } },
      },
      {
        resolve: "@medusajs/medusa/caching",
        options: {
          providers: [
            {
              resolve: "@medusajs/caching-redis",
              id: "caching-redis",
              is_default: true,
              options: { redisUrl, prefix: "bolillo:cache:" },
            },
          ],
        },
      },
      {
        resolve: "@medusajs/medusa/locking",
        options: {
          providers: [
            {
              resolve: "@medusajs/medusa/locking-redis",
              id: "locking-redis",
              is_default: true,
              options: { redisUrl, namespace: "bolillo:lock:" },
            },
          ],
        },
      },
    ]
  : [];

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    ...(isProduction ? { redisUrl, redisPrefix: "bolillo:" } : {}),
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  admin: {
    vite: () => ({
      plugins: [
        {
          name: "bolillo-admin-language-and-sidebar",
          transformIndexHtml(html) {
            const customization = `
              <script>
                document.cookie = "lng=es; Max-Age=31536000; Path=/; SameSite=Lax";
                window.localStorage.setItem("lng", "es");
              </script>
              <style>
                #medusa aside nav.py-3 .gap-y-1 > div:not(:has(a[href$="/customers"])):not(:has(a[href$="/analytics"])) {
                  display: none !important;
                }
                #medusa aside > div > div > div > div:has(> div > div > a[href$="/settings"]) {
                  display: none !important;
                }
              </style>
            `;

            return html.replace("</head>", `${customization}</head>`);
          },
        },
      ],
    }),
  },
  modules: [
    ...productionRedisModules,
    {
      resolve: "./src/modules/analytics",
    },
  ],
});
