import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UpdateActionDto, UpdateSensorMeasurementsDto } from './events.dto';

@WebSocketGateway(8080, { transports: ['websocket', 'polling'] })
export class EventsGateway {
  private firestore: admin.firestore.Firestore;

  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseAdmin: admin.app.App,
  ) {
    this.firestore = firebaseAdmin.firestore(); // Firestore 인스턴스
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): string {
    this.server.emit('message', data);

    console.log(data);

    return 'Received ' + data;
  }

  @SubscribeMessage('updateSensorMeasurements')
  async handleUpdateSensorMeasurements(
    @MessageBody() data: UpdateSensorMeasurementsDto,
  ) {
    // remove null values
    Object.keys(data).forEach((key) => data[key] == null && delete data[key]);

    console.log(data);

    await this.firestore.collection('sensorState').doc('current').set(data, {
      merge: true,
    });

    this.server.emit('sensorMeasurementsUpdated', data);

    const snapshot = await this.firestore
      .collection('sensorState')
      .doc('current')
      .get();

    return snapshot.data();
  }

  @SubscribeMessage('getSensorMeasurements')
  async handleGetSensorMeasurements() {
    const snapshot = await this.firestore
      .collection('sensorState')
      .doc('current')
      .get();
    return snapshot.data();
  }

  @SubscribeMessage('updateAction')
  async handleUpdateAction(@MessageBody() data: UpdateActionDto) {
    await this.firestore.collection('actionState').doc('current').set(data, {
      merge: true,
    });

    this.server.emit('actionUpdated', data);

    const snapshot = await this.firestore
      .collection('actionState')
      .doc('current')
      .get();

    console.log(snapshot.data());

    return snapshot.data();
  }

  @SubscribeMessage('getAction')
  async handleGetAction() {
    const snapshot = await this.firestore
      .collection('actionState')
      .doc('current')
      .get();

    return snapshot.data();
  }
}
