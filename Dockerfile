FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN ./mvnw clean package

EXPOSE 8080

CMD ["java", "-jar", "target/moneymanager-0.0.1-SNAPSHOT.jar"]