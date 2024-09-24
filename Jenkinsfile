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

        stage('List Files') {
            steps {
                sh 'ls -al'
            }
        }

        stage('Build Backend Application') {
            steps {
                dir('/backend') {
                    script {
                        sh 'pwd'  // Vérifie le répertoire de travail actuel
                        sh 'ls -al'  // Vérifie la présence du fichier pom.xml
                        sh "mvn clean package -DskipTests"
                    }
                }
            }
        }


        
    }

}
