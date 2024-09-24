pipeline {
    agent any

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
                dir('backend') {
                    // Définir JAVA_HOME explicitement
                    withEnv(["JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64", "PATH+JDK=$JAVA_HOME/bin"]) {
                        sh "chmod +x ./mvnw"
                        sh "./mvnw clean package -X"
                        sh "./mvnw --version"
                    }
                }
            }
        }
    }
}
