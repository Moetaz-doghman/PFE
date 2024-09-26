pipeline {
    environment { 
        registry = "moetaz457/pfe"
        registryCredential = 'Dockerhub' 
        dockerImage = '' 
    }
    agent any

    tools {
        jdk 'JAVA_HOME'  // Nom de l'installation du JDK dans Jenkins
        maven 'M2_HOME'  // Nom de l'installation Maven dans Jenkins
    }

    environment {
        MAVEN_OPTS = '-Xms256m -Xmx512m'
    }

    stages {
        stage('Checkout Code from Git') {
            steps {
                echo "Fetching Project from GitHub"
                git branch: 'main', url: 'https://github.com/Moetaz-doghman/PFE.git'
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

        stage('Build Backend Application') {
            steps {
                dir('backend') {  // Accès au dossier backend
                    sh "chmod +x ./mvnw"
                    sh "mvn clean package -X -U -DskipTests"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    script {
                        dockerImage = docker.build("${registry}:latest")
                    }
                }
            }
        }

        stage('Push Docker Image to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', registryCredential) {
                        dockerImage.push()
                    }
                }
            }
        }

        stage('Deploy Application using Docker') {
            steps {
                dir('backend') {
                    sh '''
                    docker-compose down
                    docker-compose up -d
                    '''
                }
            }
        }

        stage('Run JUnit and Mockito Tests') {
            steps {
                dir('backend') {  
                    sh 'mvn test'
                }
            }
        }
    }
}
