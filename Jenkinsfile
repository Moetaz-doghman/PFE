pipeline {
    agent any

    tools {
        jdk 'JAVA_HOME'  // Remplace par le nom correct de l'installation JDK
        maven 'M2_HOME'  // Remplace par le nom correct de l'installation Maven
    }

    environment {
        MAVEN_OPTS = '-Xms256m -Xmx512m'  // Ajuste les options mémoire si nécessaire
    }

    stages {
        stage('Checkout Code from Git') {
            steps {
                echo "Fetching Project from GitHub"
                git branch: 'moetazDoghman', url: 'https://github.com/Moetaz-doghman/PFE.git'
            }
        }

        stage('Check Environment') {
            steps {
                echo "Checking JAVA_HOME and Maven version"
                sh 'echo JAVA_HOME=$JAVA_HOME'
                sh 'java -version'
                sh 'mvn --version'
            }
        }

        stage('Clean Corrupted POM') {
            steps {
                dir('backend') {
                    echo 'Removing corrupted POM file'
                    sh 'rm -f ~/.m2/repository/org/springframework/boot/spring-boot-starter-parent/3.2.3/spring-boot-starter-parent-3.2.3.pom'
                }
            }
        }

        stage('Build Backend Application') {
            steps {
                dir('backend') {
                    echo "Building the backend application"
                    // Nettoyage et mise à jour des dépendances Maven
                    sh 'mvn clean package -U'
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                dir('backend') {
                    echo "Running Unit Tests"
                    sh 'mvn test'
                }
            }
        }

        stage('Post-Build Cleanup') {
            steps {
                echo 'Cleaning up local Maven repository'
                sh 'rm -rf ~/.m2/repository/org/springframework/boot/spring-boot-dependencies/3.2.3'
            }
        }
    }

    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
            // Collect Maven logs if the build fails
            archiveArtifacts artifacts: '**/target/*.log', allowEmptyArchive: true
        }
        always {
            // Archivage des artefacts générés après le build
            archiveArtifacts artifacts: '**/target/*.jar', allowEmptyArchive: true
        }
    }
}
