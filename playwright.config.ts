import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: isCI ? 1 : 0,            // retry once in Jenkins to reduce flaky noise
  workers: isCI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  use: {
    baseURL: 'https://demowebshop.tricentis.com/',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});

// import { defineConfig, devices } from '@playwright/test';

// const isCi = !!((globalThis as any).process?.env?.CI);

// const environment = process.env.ENV_NAME || 'QA';

// const baseUrls: Record<string, string> = {
//   QA: 'https://demowebshop.tricentis.com/',
//   STAGE: 'https://stage.your-application.com',
//   UAT: 'https://uat.your-application.com'
// };

// const baseURL = baseUrls[environment];

// if (!baseURL) {
//   throw new Error(
//     `Invalid ENV_NAME: ${environment}. Allowed values: QA, STAGE, UAT`
//   );
// }
// export default defineConfig({
//   reporter:[['html', {open:'always', outputFolder:'HTML-Report'}],
//             ['list'],
//             ['dot'],],

//   testDir: './tests',
//   outputDir:'./test-output',

  
//   //Prevent accidental test.only from passing in CI
//   forbidOnly: !!process.env.CI,

//   //Retry failed tests only in Jenkins/CI
//   retries: process.env.CI ? 2 : 0,

//   //Playwright recommends controlled workers in CI for stability and reproducibility.
//   workers: process.env.CI ? 1 : undefined,

//   use: {
//     baseURL,
//     headless: true,
//     screenshot: 'only-on-failure',
//   },

//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//         //fullyParallel:true,
//         //workers:5,
//     },
// /*
//     {
//       name: 'firefox',
//       use: { ...devices['Desktop Firefox'] },
//         //fullyParallel:false,
//         //workers:1,
//     },

//     {
//       name: 'webkit',
//       use: { ...devices['Desktop Safari'] },
//     },
// */
    
//   ]
// });


// import { defineConfig, devices } from '@playwright/test';

// const environment = process.env.ENV_NAME || 'QA';

// const baseUrls: Record<string, string> = {
//   QA: 'https://qa.your-application.com',
//   STAGE: 'https://stage.your-application.com',
//   UAT: 'https://uat.your-application.com'
// };

// const baseURL = baseUrls[environment];

// if (!baseURL) {
//   throw new Error(
//     `Invalid ENV_NAME: ${environment}. Allowed values: QA, STAGE, UAT`
//   );
// }

// export default defineConfig({

//   /*
//    * Test directory
//    */
//   testDir: './tests',

//   /*
//    * Maximum time allowed for one test
//    */
//   timeout: 60 * 1000,

//   /*
//    * Assertion timeout
//    */
//   expect: {
//     timeout: 10 * 1000
//   },

//   /*
//    * Prevent accidental test.only from passing in CI
//    */
//   forbidOnly: !!process.env.CI,

//   /*
//    * Retry failed tests only in Jenkins/CI
//    */
//   retries: process.env.CI ? 2 : 0,

//   /*
//    * Playwright recommends controlled workers in CI
//    * for stability and reproducibility.
//    */
//   workers: process.env.CI ? 1 : undefined,

//   /*
//    * Test execution
//    */
//   fullyParallel: true,

//   /*
//    * Reports
//    */
//   reporter: [
//     ['list'],

//     [
//       'html',
//       {
//         outputFolder: 'playwright-report',
//         open: 'never'
//       }
//     ],

//     [
//       'junit',
//       {
//         outputFile: 'test-results/e2e-results.xml'
//       }
//     ]
//   ],

//   /*
//    * Common Playwright settings
//    */
//   use: {

//     baseURL,

//     headless: true,

//     screenshot: 'only-on-failure',

//     video: 'retain-on-failure',

//     trace: 'retain-on-failure',

//     actionTimeout: 30 * 1000,

//     navigationTimeout: 60 * 1000,

//     ignoreHTTPSErrors: true
//   },

//   /*
//    * Browser projects
//    */
//   projects: [

//     {
//       name: 'chromium',

//       use: {
//         ...devices['Desktop Chrome']
//       }
//     },

//     {
//       name: 'firefox',

//       use: {
//         ...devices['Desktop Firefox']
//       }
//     },

//     {
//       name: 'edge',

//       use: {
//         ...devices['Desktop Chrome'],

//         channel: 'msedge'
//       }
//     }
//   ]
// });