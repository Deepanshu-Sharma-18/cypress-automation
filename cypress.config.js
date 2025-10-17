const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
  e2e: {
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    chromeWebSecurity: false,
    modifyObstructiveCode: false,
    baseUrl: "https://www.photowhoa.com",
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          // Remove automation flags
          launchOptions.args = launchOptions.args.filter(
            (arg) => !arg.includes("--enable-automation")
          );

          // Add more realistic browser flags
          launchOptions.args.push(
            "--disable-blink-features=AutomationControlled"
          );
          launchOptions.args.push(
            "--disable-features=IsolateOrigins,site-per-process"
          );
        }
        return launchOptions;
      });
      on("task", {
        updateCurrentPassword(newPassword) {
          try {
            const envPath = "cypress.env.json";
            const env = JSON.parse(fs.readFileSync(envPath, "utf8"));

            if (env.password !== newPassword) {
              env.password = newPassword;
              fs.writeFileSync(envPath, JSON.stringify(env, null, 2));
              console.log("✅ Password updated in cypress.env.json");
            }

            return null;
          } catch (error) {
            console.error("❌ Failed to update password:", error.message);
            throw error;
          }
        },
      });
      return config;
    },
  },
});
