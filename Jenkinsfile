pipeline {
    agent any

    environment {
        JAVA_HOME = '/usr/lib/jvm/default-java' // Ajustez ce chemin selon votre installation
        PATH = "${JAVA_HOME}/bin:${env.PATH}"
    }

    stages {
        stage ('GIT') {
            steps {
                echo "Getting Project from Git"
                git branch: 'main',
                    url: 'https://github.com/Moetaz-doghman/PFE.git'
            }
        }

        stage('Debug') {
            steps {
                dir('backend') {
                    sh 'pwd' // Affiche le répertoire actuel
                    sh 'ls -la' // Liste les fichiers pour s'assurer que tu es dans le bon dossier
                }
            }
        }

        dir('backend') { // Change to the backend directory
                    sh 'chmod +x ./mvnw' // Adjust this command to the backend directory
                    sh './mvnw clean install'
        }

    }
}
