const swaggerAutogen = require('swagger-autogen')({
  openapi: "3.0.0",
  autoHeaders: false,
});

const doc = {
  info: {
    title: 'Circle API',
    description: 'Description'
  },
  servers: [
    {
      url: "https://b54-circleapp-production.up.railway.app"
    },
    {
      url: "http://localhost:5000"
    }
  ],
  components: {
    schemas: {
      registerSchema: {
          $full_name : 'John Doe',
          $email: 'test@test.com',
          $password: 'pass1234'
      },
      loginSchema: {
        $email: 'test@gmail.com',
        $password: 'testtest',
      },
      threadSchema: {
        $content: 'This is some threads content',
      },
      requestPasswordSchema : {
        $email: 'Email to be changed password'
      },
      resetPasswordSchema : {
        $password: 'This is your new password'
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    }
  },
  security: [{
    bearerAuth: []
  }]
};

const outputFile = './swagger-generated.json';
const routes = ['./index.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);