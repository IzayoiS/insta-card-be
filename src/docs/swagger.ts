import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "Dokumentasi API INSTA-CARD",
    description: "Dokumentasi API INSTA-CARD",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "",
      description: "Deploy Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "admin",
        password: "Admin123",
      },
      RegisterRequest: {
        username: "admin",
        email: "admin@mail.com",
        password: "Admin123",
        confirmPassword: "Admin123",
      },
      UpdateUserRequest: {
        username: "admin",
        email: "admin@mail.com",
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
