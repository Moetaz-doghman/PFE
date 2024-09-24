pipeline {
    agent any

    stages {
        stage ('GIT') {
            steps {
                echo "Getting Project from Git"
                git branch: 'main', // Spécifiez la branche 'main' ici
                    url: 'https://github.com/Moetaz-doghman/PFE.git'
            }
        }

        stage("Build") {
            steps {
                dir('backend') {
                    sh "chmod +x ./mvnw"
                    sh "./mvnw clean package -X"
                    sh "./mvnw --version"
                }
            }
        }
    }
}
