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
                git branch: 'master', url: 'https://github.com/Moetaz-doghman/PFE.git'
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
                dir('backend') {
                    sh "chmod +x ./mvnw"
                    sh "mvn clean package -X -U -DskipTests"
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

        stage('SonarQube Analysis') {
            steps {
                dir('backend') {  
                    sh 'mvn sonar:sonar -Dsonar.login=admin -Dsonar.password=sonar'
                }
            }
        }

        // stage('Build Docker Image') {
        //     steps {
        //         dir('backend') {
        //             script {
        //                 dockerImage = docker.build("${registry}:latest")
        //             }
        //         }
        //     }
        // }

        // stage('Push Docker Image to DockerHub and Check Docker Containers') {
        //     steps {
        //         script {
        //             docker.withRegistry('', registryCredential) {
        //                 dockerImage.push()
        //             }
        //             dir('backend') {
        //                 sh 'docker-compose ps'
        //             }
        //         }
        //     }
        // }

        // stage('Clean Up Docker Images') {
        //     steps {
        //         dir('backend') {
        //             script {
        //                 sh '''
        //                 docker rmi $(docker images -f "dangling=true" -q) || true
        //                 '''
        //             }
        //         }
        //     }
        // }
    }
}