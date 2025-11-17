import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/server/supabase';
import { designRowToDesign, DesignRow, DesignStatus } from '@/features/designs/types';
import { TemplateChannel } from '@/features/templates/types';
import { createEmptyCanvas } from '@/features/canvas/canvasTypes';

/**
 * GET /api/designs
 * Returns list of designs ordered by updated_at desc
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching designs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch designs', details: error.message },
        { status: 500 }
      );
    }

    // Convert database rows to Design objects
    const designs = (data as DesignRow[]).map(designRowToDesign);

    return NextResponse.json(designs, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in GET /api/designs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/designs
 * Creates a new design
 * Body: { name: string, channel: TemplateChannel, templateId?: string, status?: DesignStatus, canvas?: CanvasState }
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
      const validStatuses: DesignStatus[] = ['draft', 'active', 'archived'];
      if (!validStatuses.includes(body.status as DesignStatus)) {
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
      template_id: body.templateId || null,
      status: (body.status as DesignStatus) || 'draft',
      canvas: body.canvas || createEmptyCanvas(),
    };

    const { data, error } = await supabase
      .from('designs')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating design:', error);
      return NextResponse.json(
        { error: 'Failed to create design', details: error.message },
        { status: 500 }
      );
    }

    // Convert database row to Design object
    const design = designRowToDesign(data as DesignRow);

    return NextResponse.json(design, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/designs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

