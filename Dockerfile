# Use an official Java runtime as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only essential files first (to leverage Docker caching)
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Ensure Maven wrapper is executable
RUN chmod +x mvnw

# Download dependencies without building
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src src

# Package the application
RUN ./mvnw clean package -DskipTests

# Copy the built JAR file to the final image
COPY target/moneymanager-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]