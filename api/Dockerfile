# syntax=docker/dockerfile:1

# =========================
# Build stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore as distinct layers
COPY api/api.csproj api/
RUN dotnet restore "api/api.csproj"

# copy the rest of the source
COPY . .
WORKDIR /src/api

# publish
RUN dotnet publish "api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# =========================
# Runtime stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Expose port 8080 inside container
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Optional: environment variables can override appsettings.json
# ENV ConnectionStrings__DefaultConnection=""
# ENV Jwt__Key=""
# ENV Jwt__Issuer=""
# ENV Jwt__Audience=""

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "api.dll"]
