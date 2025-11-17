import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/server/supabase';
import { templateRowToTemplate, TemplateRow, TemplateChannel, TemplateStatus } from '@/features/templates/types';

/**
 * GET /api/templates/[id]
 * Returns a single template by id or 404
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }

      console.error('Error fetching template:', error);
      return NextResponse.json(
        { error: 'Failed to fetch template', details: error.message },
        { status: 500 }
      );
    }

    // Convert database row to Template object
    const template = templateRowToTemplate(data as TemplateRow);

    return NextResponse.json(template, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in GET /api/templates/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/templates/[id]
 * Updates a template
 * Body: Partial<{ name, channel, status, canvas }>
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate fields if provided
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim() === '') {
        return NextResponse.json(
          { error: 'Field "name" must be a non-empty string' },
          { status: 400 }
        );
      }
    }

    if (body.channel !== undefined) {
      const validChannels: TemplateChannel[] = ['facebook', 'instagram', 'linkedin', 'display'];
      if (!validChannels.includes(body.channel as TemplateChannel)) {
        return NextResponse.json(
          { error: `Field "channel" must be one of: ${validChannels.join(', ')}` },
          { status: 400 }
        );
      }
    }

    if (body.status !== undefined) {
      const validStatuses: TemplateStatus[] = ['draft', 'active', 'archived'];
      if (!validStatuses.includes(body.status as TemplateStatus)) {
        return NextResponse.json(
          { error: `Field "status" must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
    }

    const supabase = await createSupabaseServerClient();

    // Prepare update data - convert from camelCase to snake_case
    const updateData: Partial<TemplateRow> = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.channel !== undefined) updateData.channel = body.channel;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.canvas !== undefined) updateData.canvas = body.canvas;

    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }

      console.error('Error updating template:', error);
      return NextResponse.json(
        { error: 'Failed to update template', details: error.message },
        { status: 500 }
      );
    }

    // Convert database row to Template object
    const template = templateRowToTemplate(data as TemplateRow);

    return NextResponse.json(template, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in PUT /api/templates/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

