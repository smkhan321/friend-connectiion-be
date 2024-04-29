import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

const configureSwagger = (app: INestApplication) => {
  // Swagger integration
  const config = new DocumentBuilder()
    .setTitle('Friend Connection')
    .setDescription('API documentation for Friend-Connection-backend')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'api-key',
        in: 'header',
      },
      'access-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};

export { configureSwagger };
