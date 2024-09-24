pipeline {
    agent any

    tools {
        jdk 'java-17-openjdk'  // Le nom que vous avez donné à l'installation du JDK dans Jenkins
    }

    stages {
        stage ('GIT') {
            steps {
                echo "Getting Project from Git"
                git branch: 'main', url: 'https://github.com/Moetaz-doghman/PFE.git'
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
