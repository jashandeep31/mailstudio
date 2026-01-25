CREATE TYPE "public"."credit_transaction_type" AS ENUM('spent', 'grant', 'expire');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('dodopayments', 'stripe', 'lemonsqueezy');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'succeeded', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."plan_type" AS ENUM('free', 'starter_pack');--> statement-breakpoint
CREATE TABLE "billings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(10, 2),
	"payment_transaction_id" uuid,
	"plan_type" "plan_type" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chat_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "credit_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"balance" numeric(10, 2),
	"after_balance" numeric(10, 2),
	"type" "credit_transaction_type" NOT NULL,
	"reason" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "credit-wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"balance" numeric(10, 2) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "credit-wallets_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"provider" "payment_provider" NOT NULL,
	"payment_id" varchar(255) NOT NULL,
	"invoice_id" varchar(255) NOT NULL,
	"subscription_id" varchar(255),
	"customer_id" varchar(255),
	"checkout_session_id" varchar(255),
	"settlement_amount" numeric(10, 2),
	"tax_amount" numeric(10, 2),
	"payment_method" varchar(200),
	"card_last_four" varchar(4),
	"card_network" varchar(50),
	"card_type" varchar(50),
	"status" "payment_status" NOT NULL,
	"error_code" varchar(100),
	"error_message" text,
	"provider_metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_transactions_invoice_id_unique" UNIQUE("invoice_id")
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_type" "plan_type" NOT NULL,
	"user_id" uuid NOT NULL,
	"active" boolean NOT NULL,
	"subscription_id" varchar,
	"customer_id" varchar(255),
	"price" numeric NOT NULL,
	"active_from" timestamp NOT NULL,
	"renew_at" timestamp NOT NULL,
	"ends_at" timestamp,
	"cancel_at_next_billing_date" boolean NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "plans_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "upload_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"signed_url" text NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"key" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"exact_url" text NOT NULL,
	"deleted_at" timestamp,
	"deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_liked_chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brand_kits" ALTER COLUMN "logo_url" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "brand_summary" text;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "brand_design_style" text;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "website_url" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "copyright" text;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "desclaimer" text;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "icon_logo_url" varchar(255);--> statement-breakpoint
ALTER TABLE "chat_media" ADD COLUMN "chat_prompt_id" uuid;--> statement-breakpoint
ALTER TABLE "chat_version_outputs" ADD COLUMN "generation_instructions" text;--> statement-breakpoint
ALTER TABLE "chat_versions" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "price" numeric(5, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "like_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan_type" "plan_type" DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "billings" ADD CONSTRAINT "billings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billings" ADD CONSTRAINT "billings_payment_transaction_id_payment_transactions_id_fk" FOREIGN KEY ("payment_transaction_id") REFERENCES "public"."payment_transactions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_wallet_id_credit-wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."credit-wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit-wallets" ADD CONSTRAINT "credit-wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload_media" ADD CONSTRAINT "upload_media_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_liked_chats" ADD CONSTRAINT "user_liked_chats_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_liked_chats" ADD CONSTRAINT "user_liked_chats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_media" ADD CONSTRAINT "chat_media_chat_prompt_id_chat_version_prompts_id_fk" FOREIGN KEY ("chat_prompt_id") REFERENCES "public"."chat_version_prompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_versions" ADD CONSTRAINT "chat_versions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_category_id_chat_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."chat_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_kits" DROP COLUMN "metadata";