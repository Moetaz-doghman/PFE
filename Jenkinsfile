pipeline {
    agent any

    tools {
        jdk 'JAVA_HOME'  // Le nom que vous avez donné à l'installation du JDK dans Jenkins
        maven 'M2_HOME'
    }

    stages {
        stage('GIT') {
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

        // Étape pour supprimer le fichier POM corrompu
        stage('Clean Corrupted POM') {
            steps {
                echo 'Cleaning corrupted POM file'
                // Commande pour supprimer le fichier POM corrompu si nécessaire
                sh 'rm -f /var/lib/jenkins/.m2/repository/org/springframework/boot/spring-boot-starter-parent/3.2.3/spring-boot-starter-parent-3.2.3.pom'
            }
        }

        stage("Build") {
            steps {
                dir('backend') {
                    // Commande pour forcer Maven à mettre à jour les dépendances avec -U
                    sh "mvn clean package -U -X"
                    sh "mvn --version"
                }
            }
        }
    }
}
