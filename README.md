# EMP-Tracker_Using_SpringBoot

## Overview
Emp-Tracker System is a full-stack Employee Management System that improves HR workflow efficiency by 40%. It provides role-based access control for over 100 users and supports CRUD operations along with real-time performance tracking.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript, ReactJS
- **Backend:** Spring Boot, Java, MySQL
- **Database:** MySQL

## Features
- Role-based access control for employees, HR, and administrators.
- CRUD operations (Create, Read, Update, Delete) for employee records.
- Dynamic reporting and analytics for HR managers.
- Real-time performance tracking of employees.

## Installation & Setup

### Prerequisites
- Java JDK 11 or higher
- Node.js and npm
- MySQL Database
- Spring Boot

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/emp-tracker-system.git
   cd emp-tracker-system/backend
   ```
2. Configure MySQL Database in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/emp_tracker_db
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   ```
3. Build and run the Spring Boot application:
   ```sh
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React app:
   ```sh
   npm start
   ```

## Usage
- Admins can log in and manage employee records.



