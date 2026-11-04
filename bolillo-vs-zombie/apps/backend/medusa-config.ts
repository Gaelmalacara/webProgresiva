import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: {
      connection: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
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
    {
      resolve: "./src/modules/analytics",
    },
  ],
});
