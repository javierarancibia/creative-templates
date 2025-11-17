# Supabase Database Migrations

This folder contains SQL migration files for the Creative Templates App database schema.

## Applying Migrations

### Option 1: Supabase Dashboard (Recommended for Initial Setup)

1. Go to your [Supabase project dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the migration file (e.g., `001_init_schema.sql`)
5. Copy and paste the entire contents into the SQL editor
6. Click **Run** to execute the migration
7. Verify the tables were created in the **Table Editor**

### Option 2: Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link your local project to your Supabase project
supabase link --project-ref <your-project-ref>

# Apply all pending migrations
supabase db push
```

## Migration Files

- `001_init_schema.sql` - Initial database schema with `templates` and `designs` tables

## Database Schema Overview

### Tables

#### `templates`
Reusable template definitions for different social media channels.

- `id` - UUID primary key
- `name` - Template name
- `channel` - Social media channel (facebook, instagram, linkedin, display)
- `status` - Template status (draft, active, archived)
- `canvas` - Full canvas state as JSONB
- `created_at` - Timestamp when created
- `updated_at` - Timestamp when last updated (auto-updated via trigger)

#### `designs`
Individual designs created from templates or from scratch.

- `id` - UUID primary key
- `template_id` - Optional reference to parent template
- `name` - Design name
- `channel` - Social media channel (facebook, instagram, linkedin, display)
- `status` - Design status (draft, active, archived)
- `canvas` - Full canvas state as JSONB
- `created_at` - Timestamp when created
- `updated_at` - Timestamp when last updated (auto-updated via trigger)

## Notes

- The `updated_at` column is automatically updated via database triggers
- All tables use UUID primary keys for better scalability
- Indexes are created on commonly queried columns (channel, status, created_at)
- The `canvas` column stores the full canvas state as JSONB for flexibility
- Foreign key from `designs.template_id` to `templates.id` uses `ON DELETE SET NULL` to preserve designs when templates are deleted

## Future Migrations

When adding new migrations:
1. Create a new file with incrementing number: `002_description.sql`, `003_description.sql`, etc.
2. Include rollback instructions in comments if applicable
3. Test migrations on a development database before applying to production
4. Document any breaking changes or required application code updates

