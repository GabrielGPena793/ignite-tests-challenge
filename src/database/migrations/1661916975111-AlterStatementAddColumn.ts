import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterStatementAddColumn1661916975111 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn("statements",
      new TableColumn({
        name: "sender_id",
        type: "varchar",
        isNullable: true
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn("statements", "sender_id")
    }

}
