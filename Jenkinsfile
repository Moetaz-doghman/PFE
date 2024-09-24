pipeline {
    agent any

    tools {
        jdk 'JAVA_HOME'  // Utilisez le nom de l'installation du JDK dans Jenkins
        maven 'M2_HOME'  // Utilisez le nom de l'installation Maven dans Jenkins
    }

    environment {
        MAVEN_OPTS = '-Xms256m -Xmx512m'  // Ajustement des options mémoire si nécessaire
    }

    stages {
        stage('Checkout Code from Git') {
            steps {
                echo "Fetching Project from GitHub"
                git branch: 'moetazDoghman', url: 'https://github.com/Moetaz-doghman/PFE.git'
            }
        }

        stage("Check JAVA and Maven Environment") {
            steps {
                echo "Checking JAVA_HOME and Maven version"
                sh 'echo $JAVA_HOME'
                sh 'java -version'
                sh 'mvn --version'
            }
        }

        stage('Clean Corrupted POM') {
            steps {
                echo 'Removing corrupted POM file'
                // Suppression du fichier POM corrompu
                sh 'rm -f ~/.m2/repository/org/springframework/boot/spring-boot-starter-parent/3.2.3/spring-boot-starter-parent-3.2.3.pom'
            }
        }

        stage('Build Backend Application') {
            steps {
                dir('backend') {
                    echo "Building the backend application"
                    // Nettoyage et mise à jour des dépendances Maven
                    sh 'mvn clean package -U -X'
                }
            }
        }

        stage('Post-Build Cleanup') {
            steps {
                echo 'Cleaning up local Maven repository'
                // Optionnel : suppression des dépendances locales ou autres nettoyages si nécessaire
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
        }
        always {
            // Optionnel : archivage des artefacts ou des journaux en cas de réussite ou d'échec
            archiveArtifacts artifacts: '**/target/*.jar', allowEmptyArchive: true
        }
    }
}
