pipeline {
    environment { 
        registry = "moetaz457/pfe"
        registryCredential = 'Dockerhub' 
        dockerImageBackend = '' 
        dockerImageFrontend = '' 
        MAVEN_OPTS = '-Xms256m -Xmx512m'
    }

    agent any

    tools {
        jdk 'JAVA_HOME'
        maven 'M2_HOME'
        nodejs 'Node' 

    }

    stages {
        stage('Checkout Code from Git') {
            steps {
                echo "Fetching Project from GitHub"
                git branch: 'master', url: 'https://github.com/Moetaz-doghman/PFE.git'
            }
        }

        // stage("Check JAVA and Maven Environment") {
        //     steps {
        //         echo "Checking JAVA_HOME and Maven version"
        //         sh 'echo $JAVA_HOME'
        //         sh 'java -version'
        //         sh 'mvn --version'
        //     }
        // }

        // stage('Build Backend Application') {
        //     steps {
        //         dir('backend') {
        //             sh "mvn clean package -DskipTests"
        //         }
        //     }
        // }

        // stage('Run JUnit and Mockito Tests') {
        //     steps {
        //         dir('backend') {  
        //             sh 'mvn test'
        //         }
        //     }
        // }

        // stage('SonarQube Analysis') {
        //     steps {
        //         dir('backend') {  
        //             sh 'mvn sonar:sonar -Dsonar.login=admin -Dsonar.password=sonar'
        //         }
        //     }
        // }

        // stage('Deploy Backend to Nexus') {
        //     steps {
        //         dir('backend') {
        //             sh 'mvn clean deploy -s /usr/share/maven/conf/settings.xml -DskipTests=true'
        //         }
        //     }
        // }

        stage('Check Node.js Version') {
            steps {
                sh 'node -v'
            }
        }

        stage('Build Frontend (Angular)') {
            steps {
                dir('front_end') {
                    echo "Building Angular Application"
                    sh 'npm install'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    dir('backend') {
                        dockerImageBackend = docker.build("${registry}:backend-latest")
                    }
                    dir('front_end') {
                        dockerImageFrontend = docker.build("${registry}:frontend-latest")
                    }
                }
            }
        }

        stage('Push Docker Images to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', registryCredential) {
                        dockerImageBackend.push()
                        dockerImageFrontend.push()
                    }
                }
            }
        }

        stage('Check Docker Containers') {
            steps {
                dir('backend') {
                    sh 'docker-compose ps'
                }
            }
        }

        stage('Clean Up Docker Images') {
            steps {
                script {
                    sh '''
                    docker rmi $(docker images -f "dangling=true" -q) || true
                    '''
                }
            }
        }
    }
}
