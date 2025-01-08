FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package

FROM quay.io/wildfly/wildfly:27.0.1.Final-jdk17
COPY --from=build /app/target/app.war /opt/jboss/wildfly/standalone/deployments/

# Configure WildFly to listen on all interfaces
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0"]