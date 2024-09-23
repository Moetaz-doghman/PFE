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

        stage("Build") {
            steps {
                    sh "chmod +x ./backend/mvnw"
                    sh "./backend/mvnw clean package -X"
                    sh "./backend/mvnw --version"
            }
        }
    }
}
