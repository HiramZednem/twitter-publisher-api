#!/bin/bash

start_container() {
    local name=$1
    local env_file=$2
    local port_mapping=$3

    if docker ps -a --format '{{.Names}}' | grep -q "^${name}$"; then
        echo "El contenedor '${name}' ya existe. Iniciándolo..."
        docker start "${name}"
    else
        echo "Creando y ejecutando el contenedor '${name}'..."
        docker run --env-file "${env_file}" --name "${name}" --restart always -p "${port_mapping}" -d twitter-api
    fi
}

# Ejecutar los contenedores
start_container "lettuce" ".env-lettuce" "3000:8080"
start_container "maikol" ".env" "3001:8080"