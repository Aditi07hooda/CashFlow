# Use an official Java runtime as a parent image
FROM maven:3.9.9-openjdk-21 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy only essential files first (to leverage Docker caching)
COPY pom.xml .
COPY mvn dependency:go-offline

# Copy the source code
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests
FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy the built JAR file to the final image
COPY --from=build /app/target/moneymanager-0.0.1-SNAPSHOT.jar .

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]