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

        stage('Delete Maven Repository') {
            steps {
                echo "Deleting Maven Repository"
                sh 'rm -rf /var/lib/jenkins/.m2/repository'
            }
        }

        stage('Debug') {
            steps {
                sh 'pwd' // Affiche le répertoire actuel
                sh 'ls -la' // Liste les fichiers pour s'assurer que tu es dans le bon dossier
            }
        }

        stage('Build Backend Application') {
            steps {
                sh "chmod +x ./mvnw"
                sh "mvn clean package -X -U"
                sh "mvn --version"
            }
        }
    }
}
