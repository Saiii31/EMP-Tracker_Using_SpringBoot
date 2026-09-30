# EMP-Tracker Backend

## Overview
Enterprise-grade Spring Boot backend with multi-tenant architecture, JWT authentication, and comprehensive HR management features.

## Tech Stack
- **Framework**: Spring Boot 3.4.0
- **Language**: Java 17
- **Security**: Spring Security + JWT
- **Database**: MySQL 8.0 with Hibernate ORM
- **Build Tool**: Maven

## Features
- Multi-tenant SaaS architecture
- Role-based access control (ADMIN, HR, EMPLOYEE)
- JWT authentication
- Audit logging
- Notification system
- Employee management
- Task tracking
- Leave management
- Attendance system

## Setup

### Prerequisites
- Java JDK 17+
- Maven 3.6+
- MySQL 8.0+

### Database Configuration
```sql
CREATE DATABASE EMP_New;
```

### Application Properties
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/EMP_New
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### Build & Run
```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Or using Maven Wrapper
.\mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8081`

## API Documentation
Access Swagger UI at: `http://localhost:8081/swagger-ui.html`

## Testing
```bash
mvn test
```

## Default Credentials
- Admin: admin / admin123
- HR: hr / hr123
- Employee: employee / employee123

## Architecture
- **Controller Layer**: REST API endpoints
- **Service Layer**: Business logic
- **Repository Layer**: Data access
- **Security Layer**: JWT authentication and authorization
- **Multi-tenancy**: Tenant-aware request handling
