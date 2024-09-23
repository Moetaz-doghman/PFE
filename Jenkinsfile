pipeline {
    agent any
    tools {
        maven 'M2_HOME'
        jdk 'JAVA_HOME'
    }


    environment {
        JAVA_HOME = '/usr/lib/jvm/java-11-openjdk-amd64'
        PATH = "${JAVA_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('GIT') {
            steps {
                echo "Getting Project from Git"
                git branch: 'main', url: 'https://github.com/Moetaz-doghman/PFE.git'
            }
        }

        stage('Check Maven Version') {
            steps {
                dir('backend') {
                    sh 'mvn -version' // Check if Maven is correctly installed
                }
            }
        }

        stage('Debug') {
            steps {
                dir('backend') {
                    sh 'pwd' // Show current directory
                    sh 'ls -la' // List files to confirm you're in the correct directory
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    // Ensure Maven Wrapper is executable
                    sh 'chmod +x ./mvnw'
                    
                    // Add extra logging for troubleshooting Maven Wrapper issues
                    sh 'ls -la .mvn/wrapper/' // Check the wrapper files
                    sh 'cat .mvn/wrapper/maven-wrapper.properties' // Display wrapper properties

                    // Run Maven build directly
                    sh "mvn --version"
                    sh "mvn clean package -DskipTests"                    
                }
            }
        }

    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs() // Clean up the workspace after the job completes
        }
    }
}
