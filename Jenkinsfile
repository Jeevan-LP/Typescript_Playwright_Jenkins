pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'          // must match the name set in Manage Jenkins -> Tools
    }

    parameters {
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Browser project')
        choice(name: 'SUITE',   choices: ['smoke', 'regression'],            description: 'Test tag to run')
        string(name: 'WORKERS', defaultValue: '2',                           description: 'Parallel workers')
    }

    environment {
        CI       = 'true'                                  // turns on retries/workers in playwright.config.ts
        BASE_URL = 'https://demowebshop.tricentis.com/'    // you have only one site, so no ENV dropdown
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Clean Workspace') {
            steps { cleanWs() }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    //credentialsId: 'github-creds', not required for public repos, but you can add if you want to use a private repo
                    url: 'https://github.com/Jeevan-LP/Typescript_Playwright_Jenkins.git'   // <-- CHANGE to your repo
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'node -v && npm -v'
                bat 'npm ci'      // installs everything in package-lock.json, including dotenv
            }
        }

        stage('Install Browsers') {
            steps { bat "npx playwright install ${params.BROWSER}" }
        }

        stage('Run Playwright Tests') {
            steps {
                // APP_USER / APP_PASS exist only inside this block
                withCredentials([usernamePassword(
                        credentialsId: 'qa-app-user',
                        usernameVariable: 'APP_USER',
                        passwordVariable: 'APP_PASS')]) {
                    bat "npx playwright test --project=${params.BROWSER} --grep @${params.SUITE} --workers=${params.WORKERS}"
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results/results.xml'

            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])

            archiveArtifacts artifacts: 'test-results/**/*.*', allowEmptyArchive: true
        }
        success {
            echo "Build succeeded. No email sent."
            emailext to: 'jeevanpgowda27@gmail.com',
                      subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER} (${params.BROWSER})",
                      body: "All tests passed.\nBuild: ${env.BUILD_URL}"
        }
        failure {
            echo "Build failed. No email sent."
            emailext to: 'jeevanpgowda27@gmail.com',
                      subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER} (${params.BROWSER})",
                      body: "Tests failed. Check the Playwright Report.\nBuild: ${env.BUILD_URL}"
        }
    }
}