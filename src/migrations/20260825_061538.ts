import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."worship_rota" ADD COLUMN "sermon_translator_id" integer;
  ALTER TABLE "payload"."worship_rota" ADD COLUMN "worship_team_leader_name_id" integer NOT NULL;
  ALTER TABLE "payload"."worship_rota" ADD CONSTRAINT "worship_rota_sermon_translator_id_members_id_fk" FOREIGN KEY ("sermon_translator_id") REFERENCES "payload"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."worship_rota" ADD CONSTRAINT "worship_rota_worship_team_leader_name_id_members_id_fk" FOREIGN KEY ("worship_team_leader_name_id") REFERENCES "payload"."members"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "worship_rota_sermon_sermon_translator_idx" ON "payload"."worship_rota" USING btree ("sermon_translator_id");
  CREATE INDEX "worship_rota_worship_team_worship_team_leader_name_idx" ON "payload"."worship_rota" USING btree ("worship_team_leader_name_id");
  ALTER TABLE "payload"."worship_rota_special_items" DROP COLUMN "person_name";
  ALTER TABLE "payload"."worship_rota" DROP COLUMN "worship_team_leader_name";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."worship_rota" DROP CONSTRAINT "worship_rota_sermon_translator_id_members_id_fk";
  
  ALTER TABLE "payload"."worship_rota" DROP CONSTRAINT "worship_rota_worship_team_leader_name_id_members_id_fk";
  
  DROP INDEX "payload"."worship_rota_sermon_sermon_translator_idx";
  DROP INDEX "payload"."worship_rota_worship_team_worship_team_leader_name_idx";
  ALTER TABLE "payload"."worship_rota_special_items" ADD COLUMN "person_name" varchar NOT NULL;
  ALTER TABLE "payload"."worship_rota" ADD COLUMN "worship_team_leader_name" varchar NOT NULL;
  ALTER TABLE "payload"."worship_rota" DROP COLUMN "sermon_translator_id";
  ALTER TABLE "payload"."worship_rota" DROP COLUMN "worship_team_leader_name_id";`)
}
