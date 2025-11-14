# Database Schema Implementation Notes

This document contains notes for updating the main README with database schema information.

## Database Schema Overview

The Creative Templates App uses PostgreSQL (via Supabase) with the following schema:

### Tables

#### `templates`
Stores reusable template definitions for different social media channels.

**Columns:**
- `id` (UUID, Primary Key) - Auto-generated unique identifier
- `name` (TEXT, NOT NULL) - Template name
- `channel` (TEXT, NOT NULL) - Social media channel: `facebook`, `instagram`, `linkedin`, or `display`
- `status` (TEXT, NOT NULL, DEFAULT 'draft') - Template status: `draft`, `active`, or `archived`
- `canvas` (JSONB) - Full canvas state stored as JSON
- `created_at` (TIMESTAMPTZ, DEFAULT NOW()) - Creation timestamp
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW()) - Last update timestamp (auto-updated via trigger)

**Indexes:**
- `idx_templates_channel` - On `channel` for faster filtering
- `idx_templates_status` - On `status` for faster filtering
- `idx_templates_created_at` - On `created_at DESC` for sorting

#### `designs`
Stores individual designs created from templates or from scratch.

**Columns:**
- `id` (UUID, Primary Key) - Auto-generated unique identifier
- `template_id` (UUID, NULLABLE) - Foreign key to `templates.id` (ON DELETE SET NULL)
- `name` (TEXT, NOT NULL) - Design name
- `channel` (TEXT, NOT NULL) - Social media channel: `facebook`, `instagram`, `linkedin`, or `display`
- `status` (TEXT, NOT NULL, DEFAULT 'draft') - Design status: `draft`, `active`, or `archived`
- `canvas` (JSONB) - Full canvas state stored as JSON
- `created_at` (TIMESTAMPTZ, DEFAULT NOW()) - Creation timestamp
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW()) - Last update timestamp (auto-updated via trigger)

**Indexes:**
- `idx_designs_template_id` - On `template_id` for faster lookups
- `idx_designs_channel` - On `channel` for faster filtering
- `idx_designs_status` - On `status` for faster filtering
- `idx_designs_created_at` - On `created_at DESC` for sorting

### Automatic Timestamp Updates

Both tables use database triggers to automatically update the `updated_at` column whenever a row is modified. This ensures timestamps are always accurate without requiring application code to manage them.

### TypeScript Type Alignment

The TypeScript types in the application are aligned with the database schema:

**Template Types** (`src/features/templates/types.ts`):
- `TemplateChannel` - Union type for channel values
- `TemplateStatus` - Union type for status values
- `Template` - Interface matching the database schema (camelCase)
- `TemplateRow` - Interface for database rows (snake_case)
- Helper functions: `templateRowToTemplate()`, `templateToTemplateRow()`

**Design Types** (`src/features/designs/types.ts`):
- `DesignStatus` - Union type for status values
- `Design` - Interface matching the database schema (camelCase)
- `DesignRow` - Interface for database rows (snake_case)
- Helper functions: `designRowToDesign()`, `designToDesignRow()`

### Migration Files

Database migrations are located in `supabase/migrations/`:
- `001_init_schema.sql` - Initial schema with `templates` and `designs` tables

See `supabase/README.md` for instructions on applying migrations.

## Key Design Decisions

1. **UUID Primary Keys**: Using UUIDs instead of auto-incrementing integers for better scalability and distributed systems support.

2. **JSONB for Canvas State**: The `canvas` column uses JSONB to store the full canvas state, providing flexibility for complex nested data structures while still allowing PostgreSQL to query and index the JSON content if needed.

3. **Soft References**: The `designs.template_id` foreign key uses `ON DELETE SET NULL` to preserve designs even when their parent template is deleted. This prevents data loss and maintains design history.

4. **Database-Level Constraints**: Channel and status values are enforced at the database level using CHECK constraints, ensuring data integrity even if accessed outside the application.

5. **Automatic Timestamps**: Using database triggers for `updated_at` ensures consistency and removes the burden from application code.

6. **Indexes for Performance**: Strategic indexes on commonly queried columns (channel, status, created_at) improve query performance for filtering and sorting operations.

7. **Snake Case vs Camel Case**: Database uses snake_case (PostgreSQL convention), while TypeScript uses camelCase (JavaScript convention). Helper functions handle the conversion between the two formats.

## Future Considerations

- **Row Level Security (RLS)**: Currently not implemented. Should be added when multi-user authentication is fully integrated.
- **Full-Text Search**: Consider adding full-text search indexes on `name` columns if search functionality is needed.
- **Canvas Versioning**: Consider adding a version history table for canvas states to enable undo/redo across sessions.
- **Soft Deletes**: Consider adding a `deleted_at` column instead of hard deletes for audit trails.
- **User Association**: Add `user_id` or `created_by` columns when user management is implemented.

## Testing the Schema

To test the schema with sample data, uncomment the sample data section at the bottom of `001_init_schema.sql` before running the migration.

## Related Documentation

- `supabase/README.md` - Migration instructions and database setup
- `AUTH_SETUP.md` - Authentication setup (for future RLS implementation)
- `SUPABASE_SETUP.md` - Supabase project configuration

