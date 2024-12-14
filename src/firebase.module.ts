import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: (configService: ConfigService) => {
        return admin.initializeApp({
          credential: admin.credential.cert({
            projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
            privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY'),
            clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          }),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseAdminModule {}
