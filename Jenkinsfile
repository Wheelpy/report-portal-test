pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')
        cron('H 2 * * *')
    }

    environment {
        RP_USER_PROD = credentials('RP_USER_PROD')
        RP_PASSWORD_PROD = credentials('RP_PASSWORD_PROD')
        SLACK_CHANNEL = '#all-testworkspace'
    }

    stages {
        stage('Notify Slack - Start') {
            steps {
                script {
                    def startMessage = """
*Pipeline Started*
- Job: *${env.JOB_NAME}*
- Build: *#${env.BUILD_NUMBER}*
- Branch: *main*
- User: *${env.CHANGE_AUTHOR ?: 'Scheduled/SCM'}*
- Workspace: *${env.WORKSPACE}*
                    """.stripIndent().trim()
                    
                    slackSend(
                        channel: env.SLACK_CHANNEL,
                        color: '#439FE0',
                        message: startMessage
                    )
                }
            }
        }

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
                    
                    script {
                        def testResults = []
                        try {
                            testResults = junit testResults: 'test-results/junit-results.xml'
                        } catch(e) {
                            echo "Unable to read test results: ${e.message}"
                        }
                        
                        env.TEST_PASS_COUNT = testResults.passCount ?: 0
                        env.TEST_FAIL_COUNT = testResults.failCount ?: 0
                        env.TEST_SKIP_COUNT = testResults.skipCount ?: 0
                    }
                }
            }
        }
    }
    
    post {
        success {
            script {
                def successMessage = """
*Pipeline Successful*
- Job: *${env.JOB_NAME}* #${env.BUILD_NUMBER}
- Duration: *${currentBuild.durationString}*
- Tests: *${env.TEST_PASS_COUNT ?: '?'} passed, ${env.TEST_FAIL_COUNT ?: '?'} failed*
- Status: *All tests passed*
- Console: ${env.BUILD_URL}console
- Report: ${env.BUILD_URL}Playwright_20Report/
                """.stripIndent().trim()
                
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'good',
                    message: successMessage
                )
            }
        }
        
        failure {
            script {
                def failureMessage = """
*Pipeline Failed*
- Job: *${env.JOB_NAME}* #${env.BUILD_NUMBER}
- Duration: *${currentBuild.durationString}*
- Status: *Build failed or tests errors*
- Error: ${currentBuild.currentResult}
- Console: ${env.BUILD_URL}console
- Check logs for details
                """.stripIndent().trim()
                
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'danger',
                    message: failureMessage
                )
            }
        }
        
        unstable {
            script {
                def unstableMessage = """
*Pipeline Unstable*
- Job: *${env.JOB_NAME}* #${env.BUILD_NUMBER}
- Duration: *${currentBuild.durationString}*
- Tests: *${env.TEST_PASS_COUNT ?: '?'} passed, ${env.TEST_FAIL_COUNT ?: '?'} failed*
- Status: *Some tests failed but pipeline continued*
- Report: ${env.BUILD_URL}testReport/
- Console: ${env.BUILD_URL}console
                """.stripIndent().trim()
                
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'warning',
                    message: unstableMessage
                )
            }
        }
        
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
        }
    }
}