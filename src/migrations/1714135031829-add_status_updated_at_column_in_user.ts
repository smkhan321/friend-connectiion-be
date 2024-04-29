import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusUpdatedAtColumnInUser1714135031829 implements MigrationInterface {
    name = 'AddStatusUpdatedAtColumnInUser1714135031829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`status_updated_at\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`status_updated_at\``);
    }

}
