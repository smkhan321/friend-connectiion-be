import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { UserService } from './modules/user/user.service';
import { FirebaseService } from './modules/firebase/firebase.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const reflector = app.get(Reflector);
  const userService = app.get(UserService);
  app.useGlobalGuards(new AuthGuard(reflector, userService));
  configureSwagger(app);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
