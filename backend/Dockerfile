# Étape 1 : Utilisation d'une image Maven pour la compilation
FROM maven:3.8.1-openjdk-17 AS builder

# Répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration Maven et les fichiers de code source
COPY pom.xml .
COPY src ./src

# Compiler le projet et générer le fichier JAR
RUN mvn clean package -DskipTests

# Étape 2 : Utilisation d'une image OpenJDK pour l'exécution de l'application
FROM openjdk:17-jdk-slim

# Répertoire de travail
WORKDIR /app

# Copier le fichier JAR depuis l'étape précédente
COPY --from=builder /app/target/*.jar app.jar

# Exposer le port 8034
EXPOSE 8034

# Commande pour démarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
