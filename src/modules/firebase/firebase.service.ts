import { Injectable, OnModuleInit } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { app, messaging } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import Messaging = messaging.Messaging;
import { UploadImageDTO } from '../../dto/upload.image.dto';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public static firebaseMessaging: Messaging;
  public static firebaseBucket: any;
  firebaseApp: app.App;

  public static UPLOAD_TYPES = {
    PROFILE: 'profile',
  };

  async onModuleInit() {
    console.log('Initializing firebase...');
    this.firebaseApp = await firebase.initializeApp({
      credential: firebase.credential.cert(
        process.cwd() + '/firebase.config.json',
      ),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET_PATH,
    });
    FirebaseService.firebaseBucket = getStorage().bucket();
    FirebaseService.firebaseMessaging = this.firebaseApp.messaging();
  }

  async upload(uploadImageDTO: UploadImageDTO) {
    if (!uploadImageDTO.file) {
      return FirebaseService.getDefaultFileUrl(uploadImageDTO.from);
    }
    let uploadPath;
    const extension = uploadImageDTO.file.extension;
    switch (uploadImageDTO.from) {
      case FirebaseService.UPLOAD_TYPES.PROFILE:
        uploadPath = `users/${uploadImageDTO.id}/${uploadImageDTO.from}/profile.${extension}`;
        break;
      default:
        uploadPath = null;
        break;
    }
    await FirebaseService.firebaseBucket
      .file(uploadPath)
      .save(uploadImageDTO.file.buffer);
    return uploadPath;
  }

  public static getDefaultFileUrl(uploadType: string): string {
    return process.env[
      `FIREBASE_STORAGE_DEFAULT_${uploadType.toUpperCase()}_PATH`
    ];
  }

  public static getUrlFromPath(path: string) {
    return `${process.env.FIREBASE_STORAGE_BASE_PATH}${
      process.env.FIREBASE_STORAGE_BUCKET_NAME
    }/o/${path.replace(
      /\//g,
      '%2F',
    )}?alt=media&timestamp=${new Date().toISOString()}`;
  }
}
