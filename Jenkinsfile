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

        stage('List Files') {
            steps {
                dir('backend') {
                    sh 'ls -la'  // Vérifie la présence de docker-compose.yml
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

        stage('Deploy Application using Docker Compose') {
            steps {
                dir('backend') {
                    sh '''
                    docker-compose down || true
                    docker-compose up -d
                    '''
                }
            }
        }

        stage('List Active Docker Containers') {
            steps {
                script {
                    sh 'docker ps'
                }
            }
        }

        stage('Wait for MySQL to be Ready') {
            steps {
                script {
                    def isMysqlReady = false
                    def retryCount = 0
                    def maxRetries = 10

                    while (!isMysqlReady && retryCount < maxRetries) {
                        sleep(10)  // Attendre 10 secondes avant de vérifier à nouveau
                        // Assurez-vous de remplacer "backend_mysql_1" par le nom correct de votre conteneur MySQL
                        def mysqlStatus = sh(script: "docker exec backend_mysql_1 mysql -uroot -e 'SHOW DATABASES;'", returnStatus: true)
                        if (mysqlStatus == 0) {
                            echo "MySQL is ready!"
                            isMysqlReady = true
                        } else {
                            retryCount++
                            echo "Waiting for MySQL to be ready... (attempt ${retryCount})"
                        }
                    }

                    if (!isMysqlReady) {
                        error("MySQL is not ready after ${maxRetries} attempts!")
                    }
                }
            }
        }

        stage('Check Tables in MySQL') {
            steps {
                script {
                    // Assurez-vous de remplacer "backend_mysql_1" par le nom correct de votre conteneur MySQL
                    def checkTables = sh(script: """
                        docker exec backend_mysql_1 mysql -uroot -e "USE projetPfe2024; SHOW TABLES;"
                    """, returnStdout: true).trim()
                    
                    echo "Tables in MySQL: ${checkTables}"

                    if (!checkTables.contains("expected_table_name")) {
                        error("Expected table not found in MySQL!")
                    }
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

        stage('Stop and Remove Docker Containers') {
            steps {
                dir('backend') {
                    script {
                        sh '''
                        docker-compose down
                        '''
                    }
                }
            }
        }
    }
}
