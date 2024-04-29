import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'mariadb',
  port: 3306,
  host: '127.0.0.1',
  username: 'root',
  password: '',
  database: 'friend-connection',
  timezone: 'utc',
  logging: false,
  synchronize: false,
  entities: ['dist/src/models/*.entity{.ts,.js}'],
  migrationsTableName: '_schema',
  migrations: ['dist/src/migrations/*.js'],
  extra: {
    extensions: ['uuid-ossp'],
  },
});
