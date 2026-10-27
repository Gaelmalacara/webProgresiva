import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261027020839 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "analytics_event" drop constraint if exists "analytics_event_event_id_unique";`);
    this.addSql(`create table if not exists "analytics_event" ("id" text not null, "event_id" text not null, "event_name" text not null, "path" text not null, "visitor_id" text not null, "session_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "analytics_event_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_analytics_event_event_id_unique" ON "analytics_event" ("event_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_analytics_event_deleted_at" ON "analytics_event" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "analytics_event" cascade;`);
  }

}
