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
                    sh 'pwd' // Affiche le répertoire actuel
                    sh 'ls -la' // Liste les fichiers pour s'assurer que tu es dans le bon dossier
            }
        }

        stage('Backend Build') {
            steps {
                    sh "chmod +x ./mvnw"
                    sh "mvn clean package -X"
                    sh "mvn --version"
            
            }
        }

    }
}
