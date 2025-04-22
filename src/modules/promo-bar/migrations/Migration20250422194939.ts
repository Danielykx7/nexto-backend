import { Migration } from '@mikro-orm/migrations';

export class Migration20250422194939 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "promo_banner" ("id" text not null, "text" text not null, "bg_color" text not null, "button_text" text null, "button_color" text null, "button_link" text null, "starts_at" timestamptz not null, "ends_at" timestamptz not null, "priority" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "promo_banner_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_promo_banner_deleted_at" ON "promo_banner" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "promo_banner" cascade;`);
  }

}
