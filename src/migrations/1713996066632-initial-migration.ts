import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1713996066632 implements MigrationInterface {
    name = 'InitialMigration1713996066632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_friend\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`accountStatus\` enum ('active', 'blocked') NOT NULL DEFAULT 'active', \`userId\` varchar(36) NULL, \`friendId\` varchar(36) NULL, INDEX \`IDX_97adb42d8d556d406863d03dc6\` (\`accountStatus\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`email\` varchar(255) NOT NULL, \`status\` varchar(600) NULL, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`fcm_token\` varchar(255) NULL, \`avatar\` varchar(255) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`friend_request\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`friendId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_friend\` ADD CONSTRAINT \`FK_6b8a8ff21cb7439e8eb12cb75ae\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_friend\` ADD CONSTRAINT \`FK_5b823df6e9a0737aa6185923837\` FOREIGN KEY (\`friendId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`friend_request\` ADD CONSTRAINT \`FK_889e9750cb31628225f3406cf6d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`friend_request\` ADD CONSTRAINT \`FK_95da925e0d7467190a2cd06779f\` FOREIGN KEY (\`friendId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`friend_request\` DROP FOREIGN KEY \`FK_95da925e0d7467190a2cd06779f\``);
        await queryRunner.query(`ALTER TABLE \`friend_request\` DROP FOREIGN KEY \`FK_889e9750cb31628225f3406cf6d\``);
        await queryRunner.query(`ALTER TABLE \`user_friend\` DROP FOREIGN KEY \`FK_5b823df6e9a0737aa6185923837\``);
        await queryRunner.query(`ALTER TABLE \`user_friend\` DROP FOREIGN KEY \`FK_6b8a8ff21cb7439e8eb12cb75ae\``);
        await queryRunner.query(`DROP TABLE \`friend_request\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_97adb42d8d556d406863d03dc6\` ON \`user_friend\``);
        await queryRunner.query(`DROP TABLE \`user_friend\``);
    }

}
