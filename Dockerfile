FROM node:18.20.3


# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias primero (mejora el cacheo de capas)
COPY package*.json ./

# Instala las dependencias
RUN npm install
# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que corre la aplicación
EXPOSE 8080



CMD ["npm", "start"]