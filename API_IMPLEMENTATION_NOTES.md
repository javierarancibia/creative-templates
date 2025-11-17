# API Implementation Notes

This document describes the API routes implementation for the Creative Templates app.

## API Routes Created

### 1. `/api/templates` (GET, POST)

**File:** `src/app/api/templates/route.ts`

#### GET /api/templates
- **Purpose:** Fetch all templates
- **Response:** Array of Template objects ordered by `updated_at` DESC
- **Status Codes:**
  - `200` - Success
  - `500` - Server error

#### POST /api/templates
- **Purpose:** Create a new template
- **Request Body:**
  ```json
  {
    "name": "string (required)",
    "channel": "facebook | instagram | linkedin | display (required)",
    "status": "draft | active | archived (optional, defaults to 'draft')",
    "canvas": "object (optional, defaults to initialCanvasState)"
  }
  ```
- **Validation:**
  - `name` must be a non-empty string
  - `channel` must be one of the valid channel values
  - `status` (if provided) must be one of the valid status values
- **Response:** Created Template object
- **Status Codes:**
  - `201` - Created successfully
  - `400` - Validation error
  - `500` - Server error

### 2. `/api/templates/[id]` (GET, PUT)

**File:** `src/app/api/templates/[id]/route.ts`

#### GET /api/templates/[id]
- **Purpose:** Fetch a single template by ID
- **Response:** Template object
- **Status Codes:**
  - `200` - Success
  - `404` - Template not found
  - `500` - Server error

#### PUT /api/templates/[id]
- **Purpose:** Update an existing template
- **Request Body:** Partial template object
  ```json
  {
    "name": "string (optional)",
    "channel": "facebook | instagram | linkedin | display (optional)",
    "status": "draft | active | archived (optional)",
    "canvas": "object (optional)"
  }
  ```
- **Validation:**
  - `name` (if provided) must be a non-empty string
  - `channel` (if provided) must be one of the valid channel values
  - `status` (if provided) must be one of the valid status values
- **Behavior:**
  - Automatically updates `updated_at` timestamp to current time
  - Only updates fields that are provided in the request body
- **Response:** Updated Template object
- **Status Codes:**
  - `200` - Updated successfully
  - `400` - Validation error
  - `404` - Template not found
  - `500` - Server error

## Frontend API Helpers

**File:** `src/features/templates/api.ts`

### Functions

#### `fetchTemplates(): Promise<Template[]>`
- Calls `GET /api/templates`
- Returns array of templates
- Throws error on failure

#### `fetchTemplate(id: string): Promise<Template>`
- Calls `GET /api/templates/[id]`
- Returns single template
- Throws error on failure or if not found

#### `createTemplate(payload): Promise<Template>`
- Calls `POST /api/templates`
- Payload: `{ name, channel, status?, canvas? }`
- Returns created template
- Throws error on validation failure or server error

#### `updateTemplate(id: string, payload): Promise<Template>`
- Calls `PUT /api/templates/[id]`
- Payload: Partial template object
- Returns updated template
- Throws error on failure or if not found

#### `deleteTemplate(id: string): Promise<void>`
- Placeholder for future DELETE endpoint
- Currently throws error

### Legacy Aliases
- `getTemplates` → `fetchTemplates`
- `getTemplate` → `fetchTemplate`

## Updated Pages

### 1. Templates List Page
**File:** `src/app/templates/page.tsx`

- Changed to client component (`'use client'`)
- Uses `useEffect` to fetch templates on mount
- Displays loading state while fetching
- Displays error state if fetch fails
- Shows templates list when loaded

### 2. New Template Page
**File:** `src/app/templates/new/page.tsx`

- Uses `createTemplate()` API helper
- Shows error message if creation fails
- Shows loading state while submitting
- Redirects to template detail page on success
- Handles errors gracefully

## Key Implementation Details

### Data Conversion
- **Database → TypeScript:** Uses `templateRowToTemplate()` to convert snake_case DB rows to camelCase Template objects
- **TypeScript → Database:** Manually converts camelCase to snake_case in API routes

### Error Handling
- All API routes have try-catch blocks
- Errors are logged to console for debugging
- User-friendly error messages returned in responses
- Frontend helpers throw errors with descriptive messages

### Validation
- Required fields validated in POST endpoint
- Optional fields validated if provided in PUT endpoint
- Channel and status values validated against allowed values
- Empty strings rejected for name field

### Default Values
- `status` defaults to `'draft'` if not provided
- `canvas` defaults to `initialCanvasState` if not provided
- `updated_at` automatically set to current time on updates

### Authentication
- Uses `createSupabaseServerClient()` which handles cookie-based sessions
- Authenticated user context automatically available in API routes
- Ready for Row Level Security (RLS) when enabled

## Testing the API

### Manual Testing with curl

**Create a template:**
```bash
curl -X POST http://localhost:3000/api/templates \
  -H "Content-Type: application/json" \
  -d '{"name":"My Template","channel":"instagram"}'
```

**Get all templates:**
```bash
curl http://localhost:3000/api/templates
```

**Get single template:**
```bash
curl http://localhost:3000/api/templates/{id}
```

**Update template:**
```bash
curl -X PUT http://localhost:3000/api/templates/{id} \
  -H "Content-Type: application/json" \
  -d '{"status":"active"}'
```

### Testing via UI
1. Start dev server: `npm run dev`
2. Navigate to `/templates/new`
3. Fill out the form and submit
4. Template should be created and you'll be redirected to detail page
5. Navigate to `/templates` to see the list

## Next Steps

- Implement DELETE endpoint for templates
- Add pagination for template list
- Add filtering/search capabilities
- Implement similar API routes for designs
- Add optimistic updates in frontend
- Add request caching/revalidation
- Implement Row Level Security (RLS) policies in Supabase

