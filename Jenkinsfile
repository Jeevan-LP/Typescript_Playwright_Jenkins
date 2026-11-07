pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'          // must match the name set in Manage Jenkins -> Tools
    }

    parameters {
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Browser project (firefox/webkit must be enabled in playwright.config.ts)')
        choice(name: 'SUITE',   choices: ['All', 'Sanity', 'Regression'],    description: 'Test tag to run (matches @Sanity / @Regression in your tests)')
        string(name: 'WORKERS', defaultValue: '2',                           description: 'Parallel workers')
    }

    environment {
        CI       = 'true'                                  // enables forbidOnly in playwright.config.ts
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
            steps { checkout scm }      // uses the repo this Jenkins job is configured with (no URL needed)
        }

        stage('Install Dependencies') {
            steps {
                bat 'node -v && npm -v'
                bat 'npm ci'            // installs everything in package-lock.json
            }
        }

        stage('Install Browsers') {
            steps { bat "npx playwright install ${params.BROWSER}" }
        }

        stage('Run Playwright Tests') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'qa-app-user',
                    usernameVariable: 'APP_USER',
                    passwordVariable: 'APP_PASS'
                )]) {
                    script {
                        def grep = params.SUITE == 'All' ? '' : "--grep @${params.SUITE}"
                        bat "npx playwright test --project=${params.BROWSER} --workers=${params.WORKERS} ${grep}"
                    }
                }
            }
        }
    }

    post {
        always {
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]

            junit allowEmptyResults: true, testResults: 'test-results/results.xml'

            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])

            archiveArtifacts artifacts: 'test-output/**/*.*, test-results/**/*.*', allowEmptyArchive: true
        }
        success {
            emailext to: 'jeevanpgowda27@gmail.com',
                     subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER} (${params.BROWSER})",
                     body: "All tests passed.\nBuild: ${env.BUILD_URL}\nAllure Report: ${env.BUILD_URL}allure"
        }
        failure {
            emailext to: 'jeevanpgowda27@gmail.com',
                     subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER} (${params.BROWSER})",
                     body: "Tests failed. Check the Allure Report.\nBuild: ${env.BUILD_URL}\nAllure Report: ${env.BUILD_URL}allure"
        }
    }
}