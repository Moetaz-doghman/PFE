# Utiliser une image de Node.js avec la version souhaitée
FROM node:18.10.0

# Créer le répertoire de l'application
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port (ajuste si nécessaire)
EXPOSE 4200

# Commande par défaut
CMD ["npm", "start"]
