# --- FASE 1: Construcción ---
# Usamos el SDK completo de .NET (Pesado, incluye herramientas)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restaurar dependencias de NuGet (indicando la carpeta WebApi)
COPY ["WebApi/WebApi.csproj", "WebApi/"]
RUN dotnet restore "WebApi/WebApi.csproj"

# Copiar el resto del código
COPY . .

# Nos movemos dentro de la carpeta del proyecto para compilar
WORKDIR /src/WebApi
RUN dotnet publish -c Release -o /app/publish

# --- FASE 2: Producción ---
# Usamos solo el Runtime de ASP.NET (Súper ligero)
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Traemos SOLO los archivos compilados de la Fase 1
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "WebApi.dll"]