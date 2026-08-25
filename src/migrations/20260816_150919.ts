import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE SCHEMA "payload";
  CREATE TYPE "payload"."_locales" AS ENUM('en', 'ta', 'kn');
  CREATE TYPE "payload"."enum_ministries_categories" AS ENUM('adults', 'kids-youth', 'service');
  CREATE TYPE "payload"."enum_ministries_icon" AS ENUM('youth', 'children', 'women', 'men', 'worship', 'outreach', 'groups');
  CREATE TYPE "payload"."enum_leadership_variant" AS ENUM('photo-left', 'photo-top', 'avatar');
  CREATE TYPE "payload"."enum_events_actions_variant" AS ENUM('solid', 'outline');
  CREATE TYPE "payload"."enum_events_category" AS ENUM('youth', 'missions', 'conferences', 'worship');
  CREATE TYPE "payload"."enum_groups_category" AS ENUM('worship', 'youth', 'care-groups', 'kids', 'care');
  CREATE TYPE "payload"."enum_contact_submissions_status" AS ENUM('new', 'in-progress', 'resolved');
  CREATE TYPE "payload"."enum_prayer_requests_status" AS ENUM('new', 'praying', 'resolved');
  CREATE TYPE "payload"."enum_visit_plans_status" AS ENUM('new', 'confirmed', 'completed');
  CREATE TYPE "payload"."enum_volunteer_interests_status" AS ENUM('new', 'contacted', 'placed');
  CREATE TYPE "payload"."enum_leadership_interests_status" AS ENUM('new', 'contacted', 'placed');
  CREATE TYPE "payload"."enum_event_registrations_number_of_attendees" AS ENUM('1', '2', '3', '4', '5+');
  CREATE TYPE "payload"."enum_event_registrations_status" AS ENUM('registered', 'cancelled');
  CREATE TYPE "payload"."enum_join_requests_status" AS ENUM('pending', 'approved', 'declined');
  CREATE TYPE "payload"."enum_homepage_quick_links_icon" AS ENUM('watch', 'calendar', 'give', 'prayer');
  CREATE TYPE "payload"."enum_ministries_page_small_groups_features_icon" AS ENUM('discussion', 'support');
  CREATE TYPE "payload"."enum_about_page_core_values_icon" AS ENUM('book', 'heart', 'community', 'globe');
  CREATE TYPE "payload"."enum_about_page_core_values_accent" AS ENUM('blue', 'gold');
  CREATE TYPE "payload"."enum_about_page_journey_dot_accent" AS ENUM('blue', 'gold');
  CREATE TYPE "payload"."enum_sermons_page_podcast_cta_links_icon" AS ENUM('headphones', 'waveform');
  CREATE TYPE "payload"."enum_schedule_page_weekly_services_badge_label" AS ENUM('In-Person', 'Hybrid');
  CREATE TYPE "payload"."enum_visit_page_what_to_expect_icon" AS ENUM('parking', 'kids', 'coffee');
  CREATE TYPE "payload"."enum_directions_page_parking_items_icon" AS ENUM('car', 'accessibility', 'bus');
  CREATE TYPE "payload"."enum_volunteer_page_areas_variant" AS ENUM('image', 'plain', 'featured');
  CREATE TYPE "payload"."enum_volunteer_page_areas_icon" AS ENUM('worship', 'hospitality', 'outreach', 'kids');
  CREATE TABLE "payload"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"notifications_seen_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload"."ministries_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "payload"."enum_ministries_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."ministries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"icon" "payload"."enum_ministries_icon" NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."ministries_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"cta_label" varchar DEFAULT 'Join Ministry',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."leadership" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"variant" "payload"."enum_leadership_variant" DEFAULT 'photo-top' NOT NULL,
  	"has_full_bio" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."leadership_locales" (
  	"role_label" varchar NOT NULL,
  	"bio" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."sermons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"scripture" varchar NOT NULL,
  	"speaker_name" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"duration" varchar NOT NULL,
  	"thumbnail_id" integer NOT NULL,
  	"youtube_url" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."sermons_locales" (
  	"title" varchar NOT NULL,
  	"series_label" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"topic" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."events_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL,
  	"variant" "payload"."enum_events_actions_variant" DEFAULT 'solid' NOT NULL
  );
  
  CREATE TABLE "payload"."events_actions_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "payload"."enum_events_category" NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"image_id" integer,
  	"requires_registration" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."events_locales" (
  	"title" varchar NOT NULL,
  	"time" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"cost" varchar,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."members_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"avatar_id" integer,
  	"volunteer_shift_day_label" varchar,
  	"volunteer_shift_role" varchar,
  	"volunteer_shift_time" varchar,
  	"volunteer_shift_location" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."members_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"ministries_id" integer
  );
  
  CREATE TABLE "payload"."worship_rota_worship_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."worship_rota_special_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"person_name" varchar NOT NULL,
  	"role_label" varchar
  );
  
  CREATE TABLE "payload"."worship_rota" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"ministry" varchar NOT NULL,
  	"service_time" varchar NOT NULL,
  	"sermon_speaker_name" varchar NOT NULL,
  	"sermon_speaker_photo_id" integer,
  	"sermon_is_guest" boolean DEFAULT false,
  	"sermon_title" varchar NOT NULL,
  	"worship_team_team_name" varchar NOT NULL,
  	"worship_team_leader_name" varchar NOT NULL,
  	"worship_team_badge" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."worship_rota_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"members_id" integer
  );
  
  CREATE TABLE "payload"."groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "payload"."enum_groups_category" NOT NULL,
  	"leader_name" varchar NOT NULL,
  	"leader_photo_id" integer,
  	"contact_email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."groups_locales" (
  	"title" varchar NOT NULL,
  	"badge_label" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"schedule" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."groups_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"members_id" integer
  );
  
  CREATE TABLE "payload"."contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "payload"."enum_contact_submissions_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."prayer_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"request" varchar NOT NULL,
  	"is_private" boolean DEFAULT false,
  	"status" "payload"."enum_prayer_requests_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."visit_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"date_of_visit" timestamp(3) with time zone NOT NULL,
  	"number_in_party" varchar NOT NULL,
  	"wants_host" boolean DEFAULT false,
  	"status" "payload"."enum_visit_plans_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."volunteer_interests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"area_of_interest" varchar NOT NULL,
  	"status" "payload"."enum_volunteer_interests_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."leadership_interests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"area_of_interest" varchar NOT NULL,
  	"submitted_by_member_id" integer,
  	"status" "payload"."enum_leadership_interests_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."event_registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"event_id" integer NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"number_of_attendees" "payload"."enum_event_registrations_number_of_attendees" DEFAULT '1' NOT NULL,
  	"special_requests" varchar,
  	"status" "payload"."enum_event_registrations_status" DEFAULT 'registered',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."join_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"member_name" varchar NOT NULL,
  	"member_email" varchar NOT NULL,
  	"status" "payload"."enum_join_requests_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."join_requests_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"ministries_id" integer,
  	"groups_id" integer
  );
  
  CREATE TABLE "payload"."donations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"amount" numeric NOT NULL,
  	"fund" varchar NOT NULL,
  	"donor_name" varchar NOT NULL,
  	"donor_email" varchar NOT NULL,
  	"donor_phone" varchar,
  	"member_id" integer,
  	"razorpay_order_id" varchar NOT NULL,
  	"razorpay_payment_id" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"ministries_id" integer,
  	"leadership_id" integer,
  	"sermons_id" integer,
  	"events_id" integer,
  	"members_id" integer,
  	"worship_rota_id" integer,
  	"groups_id" integer,
  	"contact_submissions_id" integer,
  	"prayer_requests_id" integer,
  	"visit_plans_id" integer,
  	"volunteer_interests_id" integer,
  	"leadership_interests_id" integer,
  	"event_registrations_id" integer,
  	"join_requests_id" integer,
  	"donations_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"members_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."homepage_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "payload"."enum_homepage_quick_links_icon" NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."homepage_quick_links_locales" (
  	"title" varchar NOT NULL,
  	"subtext" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."homepage_service_times" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."homepage_service_times_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."homepage_giving_breakdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"percentage" numeric NOT NULL
  );
  
  CREATE TABLE "payload"."homepage_giving_breakdown_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_primary_button_href" varchar NOT NULL,
  	"hero_secondary_button_href" varchar NOT NULL,
  	"hero_background_image_id" integer NOT NULL,
  	"hero_background_video_id" integer,
  	"hero_background_video_webm_id" integer,
  	"pastor_welcome_photo_id" integer NOT NULL,
  	"pastor_welcome_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."homepage_locales" (
  	"hero_badge_text" varchar NOT NULL,
  	"hero_heading" varchar NOT NULL,
  	"hero_subtext" varchar NOT NULL,
  	"hero_primary_button_label" varchar NOT NULL,
  	"hero_secondary_button_label" varchar NOT NULL,
  	"pastor_welcome_eyebrow" varchar NOT NULL,
  	"pastor_welcome_heading" varchar NOT NULL,
  	"pastor_welcome_quote" varchar NOT NULL,
  	"pastor_welcome_title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings_address" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings_office_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hours" varchar NOT NULL,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "payload"."site_settings_office_hours_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"church_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"map_embed_url" varchar,
  	"social_links_facebook" varchar,
  	"social_links_instagram" varchar,
  	"social_links_youtube" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."site_settings_locales" (
  	"tagline" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."ministries_page_small_groups_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "payload"."enum_ministries_page_small_groups_features_icon" NOT NULL
  );
  
  CREATE TABLE "payload"."ministries_page_small_groups_features_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."ministries_page_area_of_interest_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."ministries_page_area_of_interest_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."ministries_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."ministries_page_locales" (
  	"hero_heading" varchar NOT NULL,
  	"hero_subtext" varchar NOT NULL,
  	"small_groups_heading" varchar NOT NULL,
  	"small_groups_description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."about_page_core_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "payload"."enum_about_page_core_values_icon" NOT NULL,
  	"accent" "payload"."enum_about_page_core_values_accent" NOT NULL
  );
  
  CREATE TABLE "payload"."about_page_core_values_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."about_page_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"dot_accent" "payload"."enum_about_page_journey_dot_accent" NOT NULL
  );
  
  CREATE TABLE "payload"."about_page_journey_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_cta_href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."about_page_locales" (
  	"hero_eyebrow" varchar NOT NULL,
  	"hero_heading" varchar NOT NULL,
  	"hero_subtext" varchar NOT NULL,
  	"hero_cta_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."contact_page_subject_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."contact_page_subject_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visit_directions_href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."contact_page_locales" (
  	"hero_heading" varchar NOT NULL,
  	"hero_subtext" varchar NOT NULL,
  	"visit_campus_name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."sermons_page_podcast_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL,
  	"icon" "payload"."enum_sermons_page_podcast_cta_links_icon" NOT NULL
  );
  
  CREATE TABLE "payload"."sermons_page_podcast_cta_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."sermons_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_featured_sermon_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."sermons_page_locales" (
  	"hero_badge" varchar DEFAULT 'Latest Message' NOT NULL,
  	"podcast_cta_heading" varchar NOT NULL,
  	"podcast_cta_description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."events_page_community_focus" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."events_page_community_focus_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."events_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_featured_event_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."events_page_locales" (
  	"hero_badge" varchar NOT NULL,
  	"newsletter_cta_heading" varchar NOT NULL,
  	"newsletter_cta_subtext" varchar NOT NULL,
  	"newsletter_cta_placeholder" varchar NOT NULL,
  	"newsletter_cta_button_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."schedule_page_weekly_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar NOT NULL,
  	"badge_label" "payload"."enum_schedule_page_weekly_services_badge_label" NOT NULL
  );
  
  CREATE TABLE "payload"."schedule_page_weekly_services_locales" (
  	"name" varchar NOT NULL,
  	"service_title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."schedule_page_special_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."schedule_page_special_services_locales" (
  	"title" varchar NOT NULL,
  	"schedule" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."schedule_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote_reference" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."schedule_page_locales" (
  	"hero_heading" varchar NOT NULL,
  	"hero_subtext" varchar NOT NULL,
  	"quote_quote" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."live_page_in_person_service_times" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."live_page_in_person_service_times_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."live_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stream_is_live" boolean DEFAULT false,
  	"stream_youtube_channel_id" varchar NOT NULL,
  	"stream_speaker" varchar NOT NULL,
  	"online_giving_button_href" varchar NOT NULL,
  	"in_person_directions_href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."live_page_locales" (
  	"stream_live_label" varchar DEFAULT 'Live Now' NOT NULL,
  	"stream_title" varchar NOT NULL,
  	"stream_book_reference" varchar NOT NULL,
  	"online_giving_heading" varchar NOT NULL,
  	"online_giving_description" varchar NOT NULL,
  	"online_giving_button_label" varchar NOT NULL,
  	"in_person_heading" varchar NOT NULL,
  	"in_person_directions_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."visit_page_what_to_expect" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "payload"."enum_visit_page_what_to_expect_icon" NOT NULL
  );
  
  CREATE TABLE "payload"."visit_page_what_to_expect_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."visit_page_service_times" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."visit_page_service_times_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."visit_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."visit_page_locales" (
  	"hero_heading" varchar NOT NULL,
  	"hero_subtext" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."directions_page_service_times" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."directions_page_service_times_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."directions_page_driving_directions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."directions_page_driving_directions_locales" (
  	"heading" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."directions_page_parking_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "payload"."enum_directions_page_parking_items_icon" NOT NULL
  );
  
  CREATE TABLE "payload"."directions_page_parking_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."directions_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."directions_page_locales" (
  	"hero_heading" varchar NOT NULL,
  	"hero_subtext" varchar NOT NULL,
  	"need_help_heading" varchar NOT NULL,
  	"need_help_description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."prayer_page_prayer_team_avatar_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."prayer_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_scripture_reference" varchar NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"prayer_team_additional_count" numeric NOT NULL,
  	"intercede_card_link_href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."prayer_page_locales" (
  	"hero_heading" varchar NOT NULL,
  	"hero_scripture_quote" varchar NOT NULL,
  	"hero_description" varchar NOT NULL,
  	"prayer_team_heading" varchar NOT NULL,
  	"prayer_team_description" varchar NOT NULL,
  	"intercede_card_heading" varchar NOT NULL,
  	"intercede_card_description" varchar NOT NULL,
  	"intercede_card_link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."rota_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"worship_guidelines_link_href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."rota_page_locales" (
  	"eyebrow" varchar DEFAULT 'Ministry Schedule' NOT NULL,
  	"worship_guidelines_heading" varchar NOT NULL,
  	"worship_guidelines_description" varchar NOT NULL,
  	"worship_guidelines_link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."volunteer_page_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "payload"."enum_volunteer_page_areas_variant" DEFAULT 'plain' NOT NULL,
  	"icon" "payload"."enum_volunteer_page_areas_icon" NOT NULL,
  	"image_id" integer,
  	"sign_up_href" varchar
  );
  
  CREATE TABLE "payload"."volunteer_page_areas_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"sign_up_label" varchar,
  	"high_need_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."volunteer_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_button_href" varchar NOT NULL,
  	"hero_background_image_id" integer NOT NULL,
  	"quote_reference" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."volunteer_page_locales" (
  	"hero_badge" varchar NOT NULL,
  	"hero_heading" varchar NOT NULL,
  	"hero_subtext" varchar NOT NULL,
  	"hero_button_label" varchar NOT NULL,
  	"quote_quote" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."groups_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_background_image_id" integer NOT NULL,
  	"quote_reference" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."groups_page_locales" (
  	"hero_heading" varchar NOT NULL,
  	"hero_subtext" varchar NOT NULL,
  	"hero_search_placeholder" varchar NOT NULL,
  	"quote_quote" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."ministries_categories" ADD CONSTRAINT "ministries_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."ministries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."ministries" ADD CONSTRAINT "ministries_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."ministries_locales" ADD CONSTRAINT "ministries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."ministries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."leadership" ADD CONSTRAINT "leadership_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."leadership_locales" ADD CONSTRAINT "leadership_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."leadership"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."sermons" ADD CONSTRAINT "sermons_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."sermons_locales" ADD CONSTRAINT "sermons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."sermons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events_actions" ADD CONSTRAINT "events_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events_actions_locales" ADD CONSTRAINT "events_actions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events_actions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."members_sessions" ADD CONSTRAINT "members_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."members" ADD CONSTRAINT "members_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."members_rels" ADD CONSTRAINT "members_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."members_rels" ADD CONSTRAINT "members_rels_ministries_fk" FOREIGN KEY ("ministries_id") REFERENCES "payload"."ministries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."worship_rota_worship_team_members" ADD CONSTRAINT "worship_rota_worship_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."worship_rota_worship_team_members" ADD CONSTRAINT "worship_rota_worship_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."worship_rota"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."worship_rota_special_items" ADD CONSTRAINT "worship_rota_special_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."worship_rota"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."worship_rota" ADD CONSTRAINT "worship_rota_sermon_speaker_photo_id_media_id_fk" FOREIGN KEY ("sermon_speaker_photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."worship_rota_rels" ADD CONSTRAINT "worship_rota_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."worship_rota"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."worship_rota_rels" ADD CONSTRAINT "worship_rota_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "payload"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."groups" ADD CONSTRAINT "groups_leader_photo_id_media_id_fk" FOREIGN KEY ("leader_photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."groups_locales" ADD CONSTRAINT "groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."groups_rels" ADD CONSTRAINT "groups_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."groups_rels" ADD CONSTRAINT "groups_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "payload"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."leadership_interests" ADD CONSTRAINT "leadership_interests_submitted_by_member_id_members_id_fk" FOREIGN KEY ("submitted_by_member_id") REFERENCES "payload"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."event_registrations" ADD CONSTRAINT "event_registrations_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "payload"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "payload"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."join_requests" ADD CONSTRAINT "join_requests_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "payload"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."join_requests_rels" ADD CONSTRAINT "join_requests_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."join_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."join_requests_rels" ADD CONSTRAINT "join_requests_rels_ministries_fk" FOREIGN KEY ("ministries_id") REFERENCES "payload"."ministries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."join_requests_rels" ADD CONSTRAINT "join_requests_rels_groups_fk" FOREIGN KEY ("groups_id") REFERENCES "payload"."groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."donations" ADD CONSTRAINT "donations_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "payload"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ministries_fk" FOREIGN KEY ("ministries_id") REFERENCES "payload"."ministries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leadership_fk" FOREIGN KEY ("leadership_id") REFERENCES "payload"."leadership"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sermons_fk" FOREIGN KEY ("sermons_id") REFERENCES "payload"."sermons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "payload"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_worship_rota_fk" FOREIGN KEY ("worship_rota_id") REFERENCES "payload"."worship_rota"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_groups_fk" FOREIGN KEY ("groups_id") REFERENCES "payload"."groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "payload"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prayer_requests_fk" FOREIGN KEY ("prayer_requests_id") REFERENCES "payload"."prayer_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_visit_plans_fk" FOREIGN KEY ("visit_plans_id") REFERENCES "payload"."visit_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_volunteer_interests_fk" FOREIGN KEY ("volunteer_interests_id") REFERENCES "payload"."volunteer_interests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leadership_interests_fk" FOREIGN KEY ("leadership_interests_id") REFERENCES "payload"."leadership_interests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_registrations_fk" FOREIGN KEY ("event_registrations_id") REFERENCES "payload"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_join_requests_fk" FOREIGN KEY ("join_requests_id") REFERENCES "payload"."join_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_donations_fk" FOREIGN KEY ("donations_id") REFERENCES "payload"."donations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "payload"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_quick_links" ADD CONSTRAINT "homepage_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_quick_links_locales" ADD CONSTRAINT "homepage_quick_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage_quick_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_service_times" ADD CONSTRAINT "homepage_service_times_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_service_times_locales" ADD CONSTRAINT "homepage_service_times_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage_service_times"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_giving_breakdown" ADD CONSTRAINT "homepage_giving_breakdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_giving_breakdown_locales" ADD CONSTRAINT "homepage_giving_breakdown_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage_giving_breakdown"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage" ADD CONSTRAINT "homepage_hero_background_image_id_media_id_fk" FOREIGN KEY ("hero_background_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."homepage" ADD CONSTRAINT "homepage_hero_background_video_id_media_id_fk" FOREIGN KEY ("hero_background_video_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."homepage" ADD CONSTRAINT "homepage_hero_background_video_webm_id_media_id_fk" FOREIGN KEY ("hero_background_video_webm_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."homepage" ADD CONSTRAINT "homepage_pastor_welcome_photo_id_media_id_fk" FOREIGN KEY ("pastor_welcome_photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."homepage_locales" ADD CONSTRAINT "homepage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_address" ADD CONSTRAINT "site_settings_address_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_office_hours" ADD CONSTRAINT "site_settings_office_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_office_hours_locales" ADD CONSTRAINT "site_settings_office_hours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings_office_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."ministries_page_small_groups_features" ADD CONSTRAINT "ministries_page_small_groups_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."ministries_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."ministries_page_small_groups_features_locales" ADD CONSTRAINT "ministries_page_small_groups_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."ministries_page_small_groups_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."ministries_page_area_of_interest_options" ADD CONSTRAINT "ministries_page_area_of_interest_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."ministries_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."ministries_page_area_of_interest_options_locales" ADD CONSTRAINT "ministries_page_area_of_interest_options_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."ministries_page_area_of_interest_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."ministries_page_locales" ADD CONSTRAINT "ministries_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."ministries_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_page_core_values" ADD CONSTRAINT "about_page_core_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_page_core_values_locales" ADD CONSTRAINT "about_page_core_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about_page_core_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_page_journey" ADD CONSTRAINT "about_page_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_page_journey_locales" ADD CONSTRAINT "about_page_journey_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about_page_journey"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."contact_page_subject_options" ADD CONSTRAINT "contact_page_subject_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."contact_page_subject_options_locales" ADD CONSTRAINT "contact_page_subject_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."contact_page_subject_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."contact_page_locales" ADD CONSTRAINT "contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."sermons_page_podcast_cta_links" ADD CONSTRAINT "sermons_page_podcast_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."sermons_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."sermons_page_podcast_cta_links_locales" ADD CONSTRAINT "sermons_page_podcast_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."sermons_page_podcast_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."sermons_page" ADD CONSTRAINT "sermons_page_hero_featured_sermon_id_sermons_id_fk" FOREIGN KEY ("hero_featured_sermon_id") REFERENCES "payload"."sermons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."sermons_page_locales" ADD CONSTRAINT "sermons_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."sermons_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events_page_community_focus" ADD CONSTRAINT "events_page_community_focus_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."events_page_community_focus" ADD CONSTRAINT "events_page_community_focus_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events_page_community_focus_locales" ADD CONSTRAINT "events_page_community_focus_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events_page_community_focus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events_page" ADD CONSTRAINT "events_page_hero_featured_event_id_events_id_fk" FOREIGN KEY ("hero_featured_event_id") REFERENCES "payload"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."events_page_locales" ADD CONSTRAINT "events_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."schedule_page_weekly_services" ADD CONSTRAINT "schedule_page_weekly_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."schedule_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."schedule_page_weekly_services_locales" ADD CONSTRAINT "schedule_page_weekly_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."schedule_page_weekly_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."schedule_page_special_services" ADD CONSTRAINT "schedule_page_special_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."schedule_page_special_services" ADD CONSTRAINT "schedule_page_special_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."schedule_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."schedule_page_special_services_locales" ADD CONSTRAINT "schedule_page_special_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."schedule_page_special_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."schedule_page_locales" ADD CONSTRAINT "schedule_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."schedule_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."live_page_in_person_service_times" ADD CONSTRAINT "live_page_in_person_service_times_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."live_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."live_page_in_person_service_times_locales" ADD CONSTRAINT "live_page_in_person_service_times_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."live_page_in_person_service_times"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."live_page_locales" ADD CONSTRAINT "live_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."live_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."visit_page_what_to_expect" ADD CONSTRAINT "visit_page_what_to_expect_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."visit_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."visit_page_what_to_expect_locales" ADD CONSTRAINT "visit_page_what_to_expect_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."visit_page_what_to_expect"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."visit_page_service_times" ADD CONSTRAINT "visit_page_service_times_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."visit_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."visit_page_service_times_locales" ADD CONSTRAINT "visit_page_service_times_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."visit_page_service_times"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."visit_page_locales" ADD CONSTRAINT "visit_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."visit_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."directions_page_service_times" ADD CONSTRAINT "directions_page_service_times_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."directions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."directions_page_service_times_locales" ADD CONSTRAINT "directions_page_service_times_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."directions_page_service_times"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."directions_page_driving_directions" ADD CONSTRAINT "directions_page_driving_directions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."directions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."directions_page_driving_directions_locales" ADD CONSTRAINT "directions_page_driving_directions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."directions_page_driving_directions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."directions_page_parking_items" ADD CONSTRAINT "directions_page_parking_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."directions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."directions_page_parking_items_locales" ADD CONSTRAINT "directions_page_parking_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."directions_page_parking_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."directions_page_locales" ADD CONSTRAINT "directions_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."directions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."prayer_page_prayer_team_avatar_images" ADD CONSTRAINT "prayer_page_prayer_team_avatar_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."prayer_page_prayer_team_avatar_images" ADD CONSTRAINT "prayer_page_prayer_team_avatar_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."prayer_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."prayer_page" ADD CONSTRAINT "prayer_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."prayer_page_locales" ADD CONSTRAINT "prayer_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."prayer_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."rota_page_locales" ADD CONSTRAINT "rota_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."rota_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."volunteer_page_areas" ADD CONSTRAINT "volunteer_page_areas_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."volunteer_page_areas" ADD CONSTRAINT "volunteer_page_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."volunteer_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."volunteer_page_areas_locales" ADD CONSTRAINT "volunteer_page_areas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."volunteer_page_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."volunteer_page" ADD CONSTRAINT "volunteer_page_hero_background_image_id_media_id_fk" FOREIGN KEY ("hero_background_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."volunteer_page_locales" ADD CONSTRAINT "volunteer_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."volunteer_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."groups_page" ADD CONSTRAINT "groups_page_hero_background_image_id_media_id_fk" FOREIGN KEY ("hero_background_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."groups_page_locales" ADD CONSTRAINT "groups_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."groups_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX "ministries_categories_order_idx" ON "payload"."ministries_categories" USING btree ("order");
  CREATE INDEX "ministries_categories_parent_idx" ON "payload"."ministries_categories" USING btree ("parent_id");
  CREATE UNIQUE INDEX "ministries_slug_idx" ON "payload"."ministries" USING btree ("slug");
  CREATE INDEX "ministries_image_idx" ON "payload"."ministries" USING btree ("image_id");
  CREATE INDEX "ministries_updated_at_idx" ON "payload"."ministries" USING btree ("updated_at");
  CREATE INDEX "ministries_created_at_idx" ON "payload"."ministries" USING btree ("created_at");
  CREATE UNIQUE INDEX "ministries_locales_locale_parent_id_unique" ON "payload"."ministries_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "leadership_slug_idx" ON "payload"."leadership" USING btree ("slug");
  CREATE INDEX "leadership_photo_idx" ON "payload"."leadership" USING btree ("photo_id");
  CREATE INDEX "leadership_updated_at_idx" ON "payload"."leadership" USING btree ("updated_at");
  CREATE INDEX "leadership_created_at_idx" ON "payload"."leadership" USING btree ("created_at");
  CREATE UNIQUE INDEX "leadership_locales_locale_parent_id_unique" ON "payload"."leadership_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "sermons_slug_idx" ON "payload"."sermons" USING btree ("slug");
  CREATE INDEX "sermons_thumbnail_idx" ON "payload"."sermons" USING btree ("thumbnail_id");
  CREATE INDEX "sermons_updated_at_idx" ON "payload"."sermons" USING btree ("updated_at");
  CREATE INDEX "sermons_created_at_idx" ON "payload"."sermons" USING btree ("created_at");
  CREATE UNIQUE INDEX "sermons_locales_locale_parent_id_unique" ON "payload"."sermons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_actions_order_idx" ON "payload"."events_actions" USING btree ("_order");
  CREATE INDEX "events_actions_parent_id_idx" ON "payload"."events_actions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_actions_locales_locale_parent_id_unique" ON "payload"."events_actions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "payload"."events" USING btree ("slug");
  CREATE INDEX "events_image_idx" ON "payload"."events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "payload"."events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "payload"."events" USING btree ("created_at");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "payload"."events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "members_sessions_order_idx" ON "payload"."members_sessions" USING btree ("_order");
  CREATE INDEX "members_sessions_parent_id_idx" ON "payload"."members_sessions" USING btree ("_parent_id");
  CREATE INDEX "members_avatar_idx" ON "payload"."members" USING btree ("avatar_id");
  CREATE INDEX "members_updated_at_idx" ON "payload"."members" USING btree ("updated_at");
  CREATE INDEX "members_created_at_idx" ON "payload"."members" USING btree ("created_at");
  CREATE UNIQUE INDEX "members_email_idx" ON "payload"."members" USING btree ("email");
  CREATE INDEX "members_rels_order_idx" ON "payload"."members_rels" USING btree ("order");
  CREATE INDEX "members_rels_parent_idx" ON "payload"."members_rels" USING btree ("parent_id");
  CREATE INDEX "members_rels_path_idx" ON "payload"."members_rels" USING btree ("path");
  CREATE INDEX "members_rels_ministries_id_idx" ON "payload"."members_rels" USING btree ("ministries_id");
  CREATE INDEX "worship_rota_worship_team_members_order_idx" ON "payload"."worship_rota_worship_team_members" USING btree ("_order");
  CREATE INDEX "worship_rota_worship_team_members_parent_id_idx" ON "payload"."worship_rota_worship_team_members" USING btree ("_parent_id");
  CREATE INDEX "worship_rota_worship_team_members_photo_idx" ON "payload"."worship_rota_worship_team_members" USING btree ("photo_id");
  CREATE INDEX "worship_rota_special_items_order_idx" ON "payload"."worship_rota_special_items" USING btree ("_order");
  CREATE INDEX "worship_rota_special_items_parent_id_idx" ON "payload"."worship_rota_special_items" USING btree ("_parent_id");
  CREATE INDEX "worship_rota_sermon_sermon_speaker_photo_idx" ON "payload"."worship_rota" USING btree ("sermon_speaker_photo_id");
  CREATE INDEX "worship_rota_updated_at_idx" ON "payload"."worship_rota" USING btree ("updated_at");
  CREATE INDEX "worship_rota_created_at_idx" ON "payload"."worship_rota" USING btree ("created_at");
  CREATE INDEX "worship_rota_rels_order_idx" ON "payload"."worship_rota_rels" USING btree ("order");
  CREATE INDEX "worship_rota_rels_parent_idx" ON "payload"."worship_rota_rels" USING btree ("parent_id");
  CREATE INDEX "worship_rota_rels_path_idx" ON "payload"."worship_rota_rels" USING btree ("path");
  CREATE INDEX "worship_rota_rels_members_id_idx" ON "payload"."worship_rota_rels" USING btree ("members_id");
  CREATE UNIQUE INDEX "groups_slug_idx" ON "payload"."groups" USING btree ("slug");
  CREATE INDEX "groups_leader_photo_idx" ON "payload"."groups" USING btree ("leader_photo_id");
  CREATE INDEX "groups_updated_at_idx" ON "payload"."groups" USING btree ("updated_at");
  CREATE INDEX "groups_created_at_idx" ON "payload"."groups" USING btree ("created_at");
  CREATE UNIQUE INDEX "groups_locales_locale_parent_id_unique" ON "payload"."groups_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "groups_rels_order_idx" ON "payload"."groups_rels" USING btree ("order");
  CREATE INDEX "groups_rels_parent_idx" ON "payload"."groups_rels" USING btree ("parent_id");
  CREATE INDEX "groups_rels_path_idx" ON "payload"."groups_rels" USING btree ("path");
  CREATE INDEX "groups_rels_members_id_idx" ON "payload"."groups_rels" USING btree ("members_id");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "payload"."contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "payload"."contact_submissions" USING btree ("created_at");
  CREATE INDEX "prayer_requests_updated_at_idx" ON "payload"."prayer_requests" USING btree ("updated_at");
  CREATE INDEX "prayer_requests_created_at_idx" ON "payload"."prayer_requests" USING btree ("created_at");
  CREATE INDEX "visit_plans_updated_at_idx" ON "payload"."visit_plans" USING btree ("updated_at");
  CREATE INDEX "visit_plans_created_at_idx" ON "payload"."visit_plans" USING btree ("created_at");
  CREATE INDEX "volunteer_interests_updated_at_idx" ON "payload"."volunteer_interests" USING btree ("updated_at");
  CREATE INDEX "volunteer_interests_created_at_idx" ON "payload"."volunteer_interests" USING btree ("created_at");
  CREATE INDEX "leadership_interests_submitted_by_member_idx" ON "payload"."leadership_interests" USING btree ("submitted_by_member_id");
  CREATE INDEX "leadership_interests_updated_at_idx" ON "payload"."leadership_interests" USING btree ("updated_at");
  CREATE INDEX "leadership_interests_created_at_idx" ON "payload"."leadership_interests" USING btree ("created_at");
  CREATE INDEX "event_registrations_member_idx" ON "payload"."event_registrations" USING btree ("member_id");
  CREATE INDEX "event_registrations_event_idx" ON "payload"."event_registrations" USING btree ("event_id");
  CREATE INDEX "event_registrations_updated_at_idx" ON "payload"."event_registrations" USING btree ("updated_at");
  CREATE INDEX "event_registrations_created_at_idx" ON "payload"."event_registrations" USING btree ("created_at");
  CREATE INDEX "join_requests_member_idx" ON "payload"."join_requests" USING btree ("member_id");
  CREATE INDEX "join_requests_updated_at_idx" ON "payload"."join_requests" USING btree ("updated_at");
  CREATE INDEX "join_requests_created_at_idx" ON "payload"."join_requests" USING btree ("created_at");
  CREATE INDEX "join_requests_rels_order_idx" ON "payload"."join_requests_rels" USING btree ("order");
  CREATE INDEX "join_requests_rels_parent_idx" ON "payload"."join_requests_rels" USING btree ("parent_id");
  CREATE INDEX "join_requests_rels_path_idx" ON "payload"."join_requests_rels" USING btree ("path");
  CREATE INDEX "join_requests_rels_ministries_id_idx" ON "payload"."join_requests_rels" USING btree ("ministries_id");
  CREATE INDEX "join_requests_rels_groups_id_idx" ON "payload"."join_requests_rels" USING btree ("groups_id");
  CREATE INDEX "donations_member_idx" ON "payload"."donations" USING btree ("member_id");
  CREATE UNIQUE INDEX "donations_razorpay_order_id_idx" ON "payload"."donations" USING btree ("razorpay_order_id");
  CREATE UNIQUE INDEX "donations_razorpay_payment_id_idx" ON "payload"."donations" USING btree ("razorpay_payment_id");
  CREATE INDEX "donations_updated_at_idx" ON "payload"."donations" USING btree ("updated_at");
  CREATE INDEX "donations_created_at_idx" ON "payload"."donations" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_ministries_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("ministries_id");
  CREATE INDEX "payload_locked_documents_rels_leadership_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("leadership_id");
  CREATE INDEX "payload_locked_documents_rels_sermons_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("sermons_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_members_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("members_id");
  CREATE INDEX "payload_locked_documents_rels_worship_rota_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("worship_rota_id");
  CREATE INDEX "payload_locked_documents_rels_groups_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("groups_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_prayer_requests_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("prayer_requests_id");
  CREATE INDEX "payload_locked_documents_rels_visit_plans_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("visit_plans_id");
  CREATE INDEX "payload_locked_documents_rels_volunteer_interests_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("volunteer_interests_id");
  CREATE INDEX "payload_locked_documents_rels_leadership_interests_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("leadership_interests_id");
  CREATE INDEX "payload_locked_documents_rels_event_registrations_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("event_registrations_id");
  CREATE INDEX "payload_locked_documents_rels_join_requests_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("join_requests_id");
  CREATE INDEX "payload_locked_documents_rels_donations_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("donations_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_members_id_idx" ON "payload"."payload_preferences_rels" USING btree ("members_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_quick_links_order_idx" ON "payload"."homepage_quick_links" USING btree ("_order");
  CREATE INDEX "homepage_quick_links_parent_id_idx" ON "payload"."homepage_quick_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_quick_links_locales_locale_parent_id_unique" ON "payload"."homepage_quick_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_service_times_order_idx" ON "payload"."homepage_service_times" USING btree ("_order");
  CREATE INDEX "homepage_service_times_parent_id_idx" ON "payload"."homepage_service_times" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_service_times_locales_locale_parent_id_unique" ON "payload"."homepage_service_times_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_giving_breakdown_order_idx" ON "payload"."homepage_giving_breakdown" USING btree ("_order");
  CREATE INDEX "homepage_giving_breakdown_parent_id_idx" ON "payload"."homepage_giving_breakdown" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_giving_breakdown_locales_locale_parent_id_unique" ON "payload"."homepage_giving_breakdown_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_hero_hero_background_image_idx" ON "payload"."homepage" USING btree ("hero_background_image_id");
  CREATE INDEX "homepage_hero_hero_background_video_idx" ON "payload"."homepage" USING btree ("hero_background_video_id");
  CREATE INDEX "homepage_hero_hero_background_video_webm_idx" ON "payload"."homepage" USING btree ("hero_background_video_webm_id");
  CREATE INDEX "homepage_pastor_welcome_pastor_welcome_photo_idx" ON "payload"."homepage" USING btree ("pastor_welcome_photo_id");
  CREATE UNIQUE INDEX "homepage_locales_locale_parent_id_unique" ON "payload"."homepage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_address_order_idx" ON "payload"."site_settings_address" USING btree ("_order");
  CREATE INDEX "site_settings_address_parent_id_idx" ON "payload"."site_settings_address" USING btree ("_parent_id");
  CREATE INDEX "site_settings_office_hours_order_idx" ON "payload"."site_settings_office_hours" USING btree ("_order");
  CREATE INDEX "site_settings_office_hours_parent_id_idx" ON "payload"."site_settings_office_hours" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_office_hours_locales_locale_parent_id_unique" ON "payload"."site_settings_office_hours_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "payload"."site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ministries_page_small_groups_features_order_idx" ON "payload"."ministries_page_small_groups_features" USING btree ("_order");
  CREATE INDEX "ministries_page_small_groups_features_parent_id_idx" ON "payload"."ministries_page_small_groups_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ministries_page_small_groups_features_locales_locale_parent_" ON "payload"."ministries_page_small_groups_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ministries_page_area_of_interest_options_order_idx" ON "payload"."ministries_page_area_of_interest_options" USING btree ("_order");
  CREATE INDEX "ministries_page_area_of_interest_options_parent_id_idx" ON "payload"."ministries_page_area_of_interest_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ministries_page_area_of_interest_options_locales_locale_pare" ON "payload"."ministries_page_area_of_interest_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "ministries_page_locales_locale_parent_id_unique" ON "payload"."ministries_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_core_values_order_idx" ON "payload"."about_page_core_values" USING btree ("_order");
  CREATE INDEX "about_page_core_values_parent_id_idx" ON "payload"."about_page_core_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_core_values_locales_locale_parent_id_unique" ON "payload"."about_page_core_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_journey_order_idx" ON "payload"."about_page_journey" USING btree ("_order");
  CREATE INDEX "about_page_journey_parent_id_idx" ON "payload"."about_page_journey" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_journey_locales_locale_parent_id_unique" ON "payload"."about_page_journey_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "payload"."about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_page_subject_options_order_idx" ON "payload"."contact_page_subject_options" USING btree ("_order");
  CREATE INDEX "contact_page_subject_options_parent_id_idx" ON "payload"."contact_page_subject_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "contact_page_subject_options_locales_locale_parent_id_unique" ON "payload"."contact_page_subject_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_page_locales_locale_parent_id_unique" ON "payload"."contact_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "sermons_page_podcast_cta_links_order_idx" ON "payload"."sermons_page_podcast_cta_links" USING btree ("_order");
  CREATE INDEX "sermons_page_podcast_cta_links_parent_id_idx" ON "payload"."sermons_page_podcast_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "sermons_page_podcast_cta_links_locales_locale_parent_id_uniq" ON "payload"."sermons_page_podcast_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "sermons_page_hero_hero_featured_sermon_idx" ON "payload"."sermons_page" USING btree ("hero_featured_sermon_id");
  CREATE UNIQUE INDEX "sermons_page_locales_locale_parent_id_unique" ON "payload"."sermons_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_page_community_focus_order_idx" ON "payload"."events_page_community_focus" USING btree ("_order");
  CREATE INDEX "events_page_community_focus_parent_id_idx" ON "payload"."events_page_community_focus" USING btree ("_parent_id");
  CREATE INDEX "events_page_community_focus_image_idx" ON "payload"."events_page_community_focus" USING btree ("image_id");
  CREATE UNIQUE INDEX "events_page_community_focus_locales_locale_parent_id_unique" ON "payload"."events_page_community_focus_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_page_hero_hero_featured_event_idx" ON "payload"."events_page" USING btree ("hero_featured_event_id");
  CREATE UNIQUE INDEX "events_page_locales_locale_parent_id_unique" ON "payload"."events_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "schedule_page_weekly_services_order_idx" ON "payload"."schedule_page_weekly_services" USING btree ("_order");
  CREATE INDEX "schedule_page_weekly_services_parent_id_idx" ON "payload"."schedule_page_weekly_services" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "schedule_page_weekly_services_locales_locale_parent_id_uniqu" ON "payload"."schedule_page_weekly_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "schedule_page_special_services_order_idx" ON "payload"."schedule_page_special_services" USING btree ("_order");
  CREATE INDEX "schedule_page_special_services_parent_id_idx" ON "payload"."schedule_page_special_services" USING btree ("_parent_id");
  CREATE INDEX "schedule_page_special_services_image_idx" ON "payload"."schedule_page_special_services" USING btree ("image_id");
  CREATE UNIQUE INDEX "schedule_page_special_services_locales_locale_parent_id_uniq" ON "payload"."schedule_page_special_services_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "schedule_page_locales_locale_parent_id_unique" ON "payload"."schedule_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "live_page_in_person_service_times_order_idx" ON "payload"."live_page_in_person_service_times" USING btree ("_order");
  CREATE INDEX "live_page_in_person_service_times_parent_id_idx" ON "payload"."live_page_in_person_service_times" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "live_page_in_person_service_times_locales_locale_parent_id_u" ON "payload"."live_page_in_person_service_times_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "live_page_locales_locale_parent_id_unique" ON "payload"."live_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "visit_page_what_to_expect_order_idx" ON "payload"."visit_page_what_to_expect" USING btree ("_order");
  CREATE INDEX "visit_page_what_to_expect_parent_id_idx" ON "payload"."visit_page_what_to_expect" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "visit_page_what_to_expect_locales_locale_parent_id_unique" ON "payload"."visit_page_what_to_expect_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "visit_page_service_times_order_idx" ON "payload"."visit_page_service_times" USING btree ("_order");
  CREATE INDEX "visit_page_service_times_parent_id_idx" ON "payload"."visit_page_service_times" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "visit_page_service_times_locales_locale_parent_id_unique" ON "payload"."visit_page_service_times_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "visit_page_locales_locale_parent_id_unique" ON "payload"."visit_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "directions_page_service_times_order_idx" ON "payload"."directions_page_service_times" USING btree ("_order");
  CREATE INDEX "directions_page_service_times_parent_id_idx" ON "payload"."directions_page_service_times" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "directions_page_service_times_locales_locale_parent_id_uniqu" ON "payload"."directions_page_service_times_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "directions_page_driving_directions_order_idx" ON "payload"."directions_page_driving_directions" USING btree ("_order");
  CREATE INDEX "directions_page_driving_directions_parent_id_idx" ON "payload"."directions_page_driving_directions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "directions_page_driving_directions_locales_locale_parent_id_" ON "payload"."directions_page_driving_directions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "directions_page_parking_items_order_idx" ON "payload"."directions_page_parking_items" USING btree ("_order");
  CREATE INDEX "directions_page_parking_items_parent_id_idx" ON "payload"."directions_page_parking_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "directions_page_parking_items_locales_locale_parent_id_uniqu" ON "payload"."directions_page_parking_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "directions_page_locales_locale_parent_id_unique" ON "payload"."directions_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "prayer_page_prayer_team_avatar_images_order_idx" ON "payload"."prayer_page_prayer_team_avatar_images" USING btree ("_order");
  CREATE INDEX "prayer_page_prayer_team_avatar_images_parent_id_idx" ON "payload"."prayer_page_prayer_team_avatar_images" USING btree ("_parent_id");
  CREATE INDEX "prayer_page_prayer_team_avatar_images_image_idx" ON "payload"."prayer_page_prayer_team_avatar_images" USING btree ("image_id");
  CREATE INDEX "prayer_page_hero_hero_image_idx" ON "payload"."prayer_page" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "prayer_page_locales_locale_parent_id_unique" ON "payload"."prayer_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "rota_page_locales_locale_parent_id_unique" ON "payload"."rota_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "volunteer_page_areas_order_idx" ON "payload"."volunteer_page_areas" USING btree ("_order");
  CREATE INDEX "volunteer_page_areas_parent_id_idx" ON "payload"."volunteer_page_areas" USING btree ("_parent_id");
  CREATE INDEX "volunteer_page_areas_image_idx" ON "payload"."volunteer_page_areas" USING btree ("image_id");
  CREATE UNIQUE INDEX "volunteer_page_areas_locales_locale_parent_id_unique" ON "payload"."volunteer_page_areas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "volunteer_page_hero_hero_background_image_idx" ON "payload"."volunteer_page" USING btree ("hero_background_image_id");
  CREATE UNIQUE INDEX "volunteer_page_locales_locale_parent_id_unique" ON "payload"."volunteer_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "groups_page_hero_hero_background_image_idx" ON "payload"."groups_page" USING btree ("hero_background_image_id");
  CREATE UNIQUE INDEX "groups_page_locales_locale_parent_id_unique" ON "payload"."groups_page_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."users_sessions" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."ministries_categories" CASCADE;
  DROP TABLE "payload"."ministries" CASCADE;
  DROP TABLE "payload"."ministries_locales" CASCADE;
  DROP TABLE "payload"."leadership" CASCADE;
  DROP TABLE "payload"."leadership_locales" CASCADE;
  DROP TABLE "payload"."sermons" CASCADE;
  DROP TABLE "payload"."sermons_locales" CASCADE;
  DROP TABLE "payload"."events_actions" CASCADE;
  DROP TABLE "payload"."events_actions_locales" CASCADE;
  DROP TABLE "payload"."events" CASCADE;
  DROP TABLE "payload"."events_locales" CASCADE;
  DROP TABLE "payload"."members_sessions" CASCADE;
  DROP TABLE "payload"."members" CASCADE;
  DROP TABLE "payload"."members_rels" CASCADE;
  DROP TABLE "payload"."worship_rota_worship_team_members" CASCADE;
  DROP TABLE "payload"."worship_rota_special_items" CASCADE;
  DROP TABLE "payload"."worship_rota" CASCADE;
  DROP TABLE "payload"."worship_rota_rels" CASCADE;
  DROP TABLE "payload"."groups" CASCADE;
  DROP TABLE "payload"."groups_locales" CASCADE;
  DROP TABLE "payload"."groups_rels" CASCADE;
  DROP TABLE "payload"."contact_submissions" CASCADE;
  DROP TABLE "payload"."prayer_requests" CASCADE;
  DROP TABLE "payload"."visit_plans" CASCADE;
  DROP TABLE "payload"."volunteer_interests" CASCADE;
  DROP TABLE "payload"."leadership_interests" CASCADE;
  DROP TABLE "payload"."event_registrations" CASCADE;
  DROP TABLE "payload"."join_requests" CASCADE;
  DROP TABLE "payload"."join_requests_rels" CASCADE;
  DROP TABLE "payload"."donations" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TABLE "payload"."homepage_quick_links" CASCADE;
  DROP TABLE "payload"."homepage_quick_links_locales" CASCADE;
  DROP TABLE "payload"."homepage_service_times" CASCADE;
  DROP TABLE "payload"."homepage_service_times_locales" CASCADE;
  DROP TABLE "payload"."homepage_giving_breakdown" CASCADE;
  DROP TABLE "payload"."homepage_giving_breakdown_locales" CASCADE;
  DROP TABLE "payload"."homepage" CASCADE;
  DROP TABLE "payload"."homepage_locales" CASCADE;
  DROP TABLE "payload"."site_settings_address" CASCADE;
  DROP TABLE "payload"."site_settings_office_hours" CASCADE;
  DROP TABLE "payload"."site_settings_office_hours_locales" CASCADE;
  DROP TABLE "payload"."site_settings" CASCADE;
  DROP TABLE "payload"."site_settings_locales" CASCADE;
  DROP TABLE "payload"."ministries_page_small_groups_features" CASCADE;
  DROP TABLE "payload"."ministries_page_small_groups_features_locales" CASCADE;
  DROP TABLE "payload"."ministries_page_area_of_interest_options" CASCADE;
  DROP TABLE "payload"."ministries_page_area_of_interest_options_locales" CASCADE;
  DROP TABLE "payload"."ministries_page" CASCADE;
  DROP TABLE "payload"."ministries_page_locales" CASCADE;
  DROP TABLE "payload"."about_page_core_values" CASCADE;
  DROP TABLE "payload"."about_page_core_values_locales" CASCADE;
  DROP TABLE "payload"."about_page_journey" CASCADE;
  DROP TABLE "payload"."about_page_journey_locales" CASCADE;
  DROP TABLE "payload"."about_page" CASCADE;
  DROP TABLE "payload"."about_page_locales" CASCADE;
  DROP TABLE "payload"."contact_page_subject_options" CASCADE;
  DROP TABLE "payload"."contact_page_subject_options_locales" CASCADE;
  DROP TABLE "payload"."contact_page" CASCADE;
  DROP TABLE "payload"."contact_page_locales" CASCADE;
  DROP TABLE "payload"."sermons_page_podcast_cta_links" CASCADE;
  DROP TABLE "payload"."sermons_page_podcast_cta_links_locales" CASCADE;
  DROP TABLE "payload"."sermons_page" CASCADE;
  DROP TABLE "payload"."sermons_page_locales" CASCADE;
  DROP TABLE "payload"."events_page_community_focus" CASCADE;
  DROP TABLE "payload"."events_page_community_focus_locales" CASCADE;
  DROP TABLE "payload"."events_page" CASCADE;
  DROP TABLE "payload"."events_page_locales" CASCADE;
  DROP TABLE "payload"."schedule_page_weekly_services" CASCADE;
  DROP TABLE "payload"."schedule_page_weekly_services_locales" CASCADE;
  DROP TABLE "payload"."schedule_page_special_services" CASCADE;
  DROP TABLE "payload"."schedule_page_special_services_locales" CASCADE;
  DROP TABLE "payload"."schedule_page" CASCADE;
  DROP TABLE "payload"."schedule_page_locales" CASCADE;
  DROP TABLE "payload"."live_page_in_person_service_times" CASCADE;
  DROP TABLE "payload"."live_page_in_person_service_times_locales" CASCADE;
  DROP TABLE "payload"."live_page" CASCADE;
  DROP TABLE "payload"."live_page_locales" CASCADE;
  DROP TABLE "payload"."visit_page_what_to_expect" CASCADE;
  DROP TABLE "payload"."visit_page_what_to_expect_locales" CASCADE;
  DROP TABLE "payload"."visit_page_service_times" CASCADE;
  DROP TABLE "payload"."visit_page_service_times_locales" CASCADE;
  DROP TABLE "payload"."visit_page" CASCADE;
  DROP TABLE "payload"."visit_page_locales" CASCADE;
  DROP TABLE "payload"."directions_page_service_times" CASCADE;
  DROP TABLE "payload"."directions_page_service_times_locales" CASCADE;
  DROP TABLE "payload"."directions_page_driving_directions" CASCADE;
  DROP TABLE "payload"."directions_page_driving_directions_locales" CASCADE;
  DROP TABLE "payload"."directions_page_parking_items" CASCADE;
  DROP TABLE "payload"."directions_page_parking_items_locales" CASCADE;
  DROP TABLE "payload"."directions_page" CASCADE;
  DROP TABLE "payload"."directions_page_locales" CASCADE;
  DROP TABLE "payload"."prayer_page_prayer_team_avatar_images" CASCADE;
  DROP TABLE "payload"."prayer_page" CASCADE;
  DROP TABLE "payload"."prayer_page_locales" CASCADE;
  DROP TABLE "payload"."rota_page" CASCADE;
  DROP TABLE "payload"."rota_page_locales" CASCADE;
  DROP TABLE "payload"."volunteer_page_areas" CASCADE;
  DROP TABLE "payload"."volunteer_page_areas_locales" CASCADE;
  DROP TABLE "payload"."volunteer_page" CASCADE;
  DROP TABLE "payload"."volunteer_page_locales" CASCADE;
  DROP TABLE "payload"."groups_page" CASCADE;
  DROP TABLE "payload"."groups_page_locales" CASCADE;
  DROP TYPE "payload"."_locales";
  DROP TYPE "payload"."enum_ministries_categories";
  DROP TYPE "payload"."enum_ministries_icon";
  DROP TYPE "payload"."enum_leadership_variant";
  DROP TYPE "payload"."enum_events_actions_variant";
  DROP TYPE "payload"."enum_events_category";
  DROP TYPE "payload"."enum_groups_category";
  DROP TYPE "payload"."enum_contact_submissions_status";
  DROP TYPE "payload"."enum_prayer_requests_status";
  DROP TYPE "payload"."enum_visit_plans_status";
  DROP TYPE "payload"."enum_volunteer_interests_status";
  DROP TYPE "payload"."enum_leadership_interests_status";
  DROP TYPE "payload"."enum_event_registrations_number_of_attendees";
  DROP TYPE "payload"."enum_event_registrations_status";
  DROP TYPE "payload"."enum_join_requests_status";
  DROP TYPE "payload"."enum_homepage_quick_links_icon";
  DROP TYPE "payload"."enum_ministries_page_small_groups_features_icon";
  DROP TYPE "payload"."enum_about_page_core_values_icon";
  DROP TYPE "payload"."enum_about_page_core_values_accent";
  DROP TYPE "payload"."enum_about_page_journey_dot_accent";
  DROP TYPE "payload"."enum_sermons_page_podcast_cta_links_icon";
  DROP TYPE "payload"."enum_schedule_page_weekly_services_badge_label";
  DROP TYPE "payload"."enum_visit_page_what_to_expect_icon";
  DROP TYPE "payload"."enum_directions_page_parking_items_icon";
  DROP TYPE "payload"."enum_volunteer_page_areas_variant";
  DROP TYPE "payload"."enum_volunteer_page_areas_icon";`)
}
