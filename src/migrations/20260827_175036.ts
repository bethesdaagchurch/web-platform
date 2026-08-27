import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."events" ADD COLUMN IF NOT EXISTS "reminder_sent_at" timestamp(3) with time zone;
  ALTER TABLE "payload"."live_page" ADD COLUMN IF NOT EXISTS "stream_current_live_video_url" varchar;
  ALTER TABLE "payload"."live_page_locales" ADD COLUMN IF NOT EXISTS "stream_sermon_notes" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."events" DROP COLUMN IF EXISTS "reminder_sent_at";
  ALTER TABLE "payload"."live_page" DROP COLUMN IF EXISTS "stream_current_live_video_url";
  ALTER TABLE "payload"."live_page_locales" DROP COLUMN IF EXISTS "stream_sermon_notes";`)
}
