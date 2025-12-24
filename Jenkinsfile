pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')

        cron('H 2 * * *')
    }

    environment {
        RP_USER_PROD = credentials('RP_USER_PROD')
        RP_PASSWORD_PROD = credentials('RP_PASSWORD_PROD')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Wheelpy/report-portal-test.git',
                credentialsId: 'jenkins'
            }
        }

        stage('Install') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Test') {
            steps {
                bat 'npm run test:parallel:prod'
            }
            post {
                always {
                    junit 'test-results/junit-results.xml'
                    archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true
                }
            }
        }
    }
}