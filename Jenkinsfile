    pipeline {
        agent any

        tools {
            jdk 'JAVA_HOME'  // Le nom que vous avez donné à l'installation du JDK dans Jenkins
            maven 'M2_HOME'
        }


        stages {
            stage ('GIT') {
                steps {
                    echo "Getting Project from Git"
                    git branch: 'main', url: 'https://github.com/Moetaz-doghman/PFE.git'
                }
            }

            stage("Check JAVA_HOME") {
            steps {
                sh 'echo $JAVA_HOME'
                sh 'java -version'
            }
            }

            stage("Build") {
                steps {
                    dir('backend') {
                        sh "mvn clean package -X"
                        sh "mvn --version"
                    }
                }
            }

        }
    }
