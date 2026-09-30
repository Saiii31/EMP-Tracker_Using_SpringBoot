import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8081", // Your Spring Boot base URL
});


export default instance;
