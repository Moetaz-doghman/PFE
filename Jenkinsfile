pipeline {
    environment { 
        registry = "moetaz457/pfe"
        registryCredential = 'Dockerhub' 
        dockerImage = ''
        MAVEN_OPTS = '-Xms256m -Xmx512m'
    }
    agent any

    tools {
        jdk 'JAVA_HOME'
        maven 'M2_HOME'
    }

    stages {
        stage('Checkout Code from Git') {
            steps {
                echo "Fetching Project from GitHub"
                git branch: 'main', url: 'https://github.com/Moetaz-doghman/PFE.git'
            }
        }

        stage("Check Environment") {
            steps {
                echo "Checking JAVA_HOME, Maven, Docker, and Docker Compose"
                sh 'echo $JAVA_HOME'
                sh 'java -version'
                sh 'mvn --version'
                sh 'docker --version'
                sh 'docker-compose --version'
            }
        }

        stage('Build Backend Application') {
            steps {
                dir('backend') {  
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

        stage('Start MySQL Database') {
            steps {
                dir('backend') {
                    sh 'docker-compose up -d db'  // Démarre uniquement la base de données
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

        stage('Deploy Application using Docker') {
            steps {
                dir('backend') {
                    sh '''
                    docker-compose down || true
                    docker-compose up -d
                    '''
                }
            }
        }
    }
}
