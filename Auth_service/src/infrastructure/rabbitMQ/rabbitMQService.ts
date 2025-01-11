import amqp, { Channel, Connection } from 'amqplib';
import config from '../config/config';


class RabbitMQService {
  private requestQueue = 'USER_DETAILS_REQUEST';
  private responseQueue = 'USER_DETAILS_RESPONSE';
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerURL!);
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(this.requestQueue);
    await this.channel.assertQueue(this.responseQueue);

    await this.listenForRequest();
  }

  private async listenForRequest() {
    await this.channel.consume(this.requestQueue, async (msg) => {
      if (msg && msg.content) {
        const { userId } = JSON.parse(msg.content.toString());
        const userDetails = await getUserDetail(userId);

        this.channel.sendToQueue(
          this.responseQueue,
          Buffer.from(JSON.stringify(userDetails)),
          { correlationId: msg.properties.correlationId },
        );

        this.channel.ack(msg);
      }
    });
  }
}

const getUserDetail = (userId: string) => {
  return {
    userId: userId,
    name: 'Dummy',
  };
};

export const rabbitMQService = new RabbitMQService();