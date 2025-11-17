import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/server/supabase';
import { templateRowToTemplate, TemplateRow, TemplateChannel, TemplateStatus } from '@/features/templates/types';
import { createEmptyCanvas } from '@/features/canvas/canvasTypes';

/**
 * GET /api/templates
 * Returns list of templates ordered by updated_at desc
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch templates', details: error.message },
        { status: 500 }
      );
    }

    // Convert database rows to Template objects
    const templates = (data as TemplateRow[]).map(templateRowToTemplate);

    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in GET /api/templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/templates
 * Creates a new template
 * Body: { name: string, channel: TemplateChannel, status?: TemplateStatus }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Field "name" is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!body.channel || typeof body.channel !== 'string') {
      return NextResponse.json(
        { error: 'Field "channel" is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate channel value
    const validChannels: TemplateChannel[] = ['facebook', 'instagram', 'linkedin', 'display'];
    if (!validChannels.includes(body.channel as TemplateChannel)) {
      return NextResponse.json(
        { error: `Field "channel" must be one of: ${validChannels.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (body.status) {
      const validStatuses: TemplateStatus[] = ['draft', 'active', 'archived'];
      if (!validStatuses.includes(body.status as TemplateStatus)) {
        return NextResponse.json(
          { error: `Field "status" must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
    }

    const supabase = await createSupabaseServerClient();

    // Prepare data for insertion
    const insertData = {
      name: body.name.trim(),
      channel: body.channel as TemplateChannel,
      status: (body.status as TemplateStatus) || 'draft',
      canvas: body.canvas || createEmptyCanvas(),
    };

    const { data, error } = await supabase
      .from('templates')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      return NextResponse.json(
        { error: 'Failed to create template', details: error.message },
        { status: 500 }
      );
    }

    // Convert database row to Template object
    const template = templateRowToTemplate(data as TemplateRow);

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

