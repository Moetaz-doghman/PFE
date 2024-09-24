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

        stage('List files after checkout') {
            steps {
                echo "Listing files in workspace"
                sh 'ls -la'
            }
        }

        stage('Build Backend Application') {
            steps {
                dir('backend') {  // Assurez-vous que le chemin est correct
                    echo "Building backend application"
                    sh 'ls -la'  // Afficher les fichiers dans le répertoire backend pour déboguer
                    script {
                        sh "mvn clean package -DskipTests"
                    }
                }
            }
        }
    }
}
