pipeline {
    environment { 
        registry = "moetaz457/pfe"
        registryCredential = 'Dockerhub' 
        dockerImage = '' 
        MAVEN_OPTS = '-Xms256m -Xmx512m'
        NEXUS_URL = 'http://192.168.33.10:8081/repository/maven-releases/'
        NEXUS_USERNAME = 'admin'
        NEXUS_PASSWORD = 'nexus'
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
                    // sh "chmod +x ./mvnw"
                    sh "mvn clean package -DskipTests"
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

        stage('Deploy to Nexus') {
            steps {
                dir('backend') {
                    sh 'mvn deploy -DaltDeploymentRepository=nexus::default::$NEXUS_URL -Dnexus.username=$NEXUS_USERNAME -Dnexus.password=$NEXUS_PASSWORD -DskipTests=true'
                }
            }
        }

        // stage('SonarQube Analysis') {
        //     steps {
        //         dir('backend') {  
        //             sh 'mvn sonar:sonar -Dsonar.login=admin -Dsonar.password=sonar'
        //         }
        //     }
        // }

        // stage('Deploy Artifact to Nexus') {
        //     steps {
        //         withCredentials([usernamePassword(credentialsId: 'NexusCredentialsId', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
        //             dir('backend') {
        //                 sh "mvn deploy -Dusername=${NEXUS_USER} -Dpassword=${NEXUS_PASS}"
        //             }
        //         }
        //     }
        // }


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