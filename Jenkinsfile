// Jenkinsfile.windows
// Declarative Jenkins pipeline for Windows build agents


/*
Pipeline Stages:
1. Checkout: Checks out the source code from the repository.
2. Install Dependencies: Installs project dependencies using npm ci.
3. Install Playwright Browsers & Dependencies: Installs Playwright browsers and copies the .env.example file to .env if it doesn't exist.
4. Run Playwright Tests: Executes the selected Playwright test suite with the specified browser and mode (headless or headed).
5. Post Actions: Archives test reports, publishes JUnit and Allure reports, and cleans up allure-results on success.
6. Email Notification: Sends an email notification with the build status and links to the reports.
7. Parameters: Allows users to select the test suite, browser, and mode for the test execution.

*/

pipeline {
  agent any
  tools {
    git 'Default'
    nodejs 'NodeJS-20'      // must match the name set in Manage Jenkins -> Tools
  }
  options { timestamps() }
  parameters {
    choice(
      name: 'TEST_TAG',
      choices: ['@jenkins', '@smoke', '@regression'],
      description: 'Select the Playwright tag to run'
    )
    choice(
      name: 'BROWSER',
      choices: ['chromium', 'firefox', 'webkit'],
      description: 'Select the browser for tests'
    )
    choice(
      name: 'MODE',
      choices: ['headless', 'headed'],
      description: 'Run tests in headless or headed mode'
    )
  }
  environment {
    NODE_ENV = 'test'
    CI = '1'
    RECIPIENT_EMAIL = 'jeevanpgowda27@gmail.com'
  }
  stages {
    stage('🔄 Checkout') {
      steps {
        checkout scm
      }
    }
    stage('📦 Install Dependencies') {
      steps {
        bat 'node -v && npm -v'
        bat 'npm ci'
      }
    }
    stage('🤖 Install Playwright Browser') {
      steps {
        bat "npx playwright install ${params.BROWSER}"
      }
    }
    stage('▶️ Run Playwright Tests') {
      steps {
        script {
          def tag = params.TEST_TAG ?: '@jenkins'
          def browserFlag = "--project=${params.BROWSER}"
          def modeFlag = params.MODE == 'headed' ? '--headed' : ''
          def grepFlag = "--grep \"${tag}\""
          bat "npx playwright test tests/jenkinsTest.spec.ts ${browserFlag} ${grepFlag} ${modeFlag}"
        }
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**,allure-results/**,test-results/**', allowEmptyArchive: true
      junit testResults: 'test-results/results.xml', allowEmptyResults: true
      allure includeProperties: false, results: [[path: 'allure-results']]
      publishHTML([
        allowMissing: true,
        alwaysLinkToLastBuild: true,
        keepAll: true,
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'Playwright HTML Report'
      ])

      script {
        if (env.RECIPIENT_EMAIL?.trim()) {
          emailext(
            subject: "Jenkins Build: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
            body: """
              <h2>Playwright Test Execution Report</h2>
              <p><b>Job:</b> ${env.JOB_NAME}</p>
              <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
              <p><b>Status:</b> ${currentBuild.currentResult}</p>
              <p><b>Test Tag:</b> ${params.TEST_TAG}</p>
              <p><b>Browser:</b> ${params.BROWSER}</p>
              <p><a href="${env.BUILD_URL}">Open Jenkins Build</a> |
                 <a href="${env.BUILD_URL}allure">Open Allure Report</a></p>
            """,
            to: env.RECIPIENT_EMAIL,
            mimeType: 'text/html'
          )
        }
      }
    }
    success {
      bat 'if exist allure-results rmdir /s /q allure-results'
    }
  }
}