import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/server/supabase';
import { designRowToDesign, DesignRow, DesignStatus } from '@/features/designs/types';
import { TemplateChannel } from '@/features/templates/types';

/**
 * GET /api/designs/[id]
 * Returns a single design by id or 404
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(
          { error: 'Design not found' },
          { status: 404 }
        );
      }

      console.error('Error fetching design:', error);
      return NextResponse.json(
        { error: 'Failed to fetch design', details: error.message },
        { status: 500 }
      );
    }

    // Convert database row to Design object
    const design = designRowToDesign(data as DesignRow);

    return NextResponse.json(design, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in GET /api/designs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/designs/[id]
 * Updates a design
 * Body: Partial<{ name, channel, status, templateId, canvas }>
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
      const validStatuses: DesignStatus[] = ['draft', 'active', 'archived'];
      if (!validStatuses.includes(body.status as DesignStatus)) {
        return NextResponse.json(
          { error: `Field "status" must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
    }

    const supabase = await createSupabaseServerClient();

    // Prepare update data - convert from camelCase to snake_case
    const updateData: Partial<DesignRow> = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.channel !== undefined) updateData.channel = body.channel;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.templateId !== undefined) updateData.template_id = body.templateId;
    if (body.canvas !== undefined) updateData.canvas = body.canvas;

    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('designs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(
          { error: 'Design not found' },
          { status: 404 }
        );
      }

      console.error('Error updating design:', error);
      return NextResponse.json(
        { error: 'Failed to update design', details: error.message },
        { status: 500 }
      );
    }

    // Convert database row to Design object
    const design = designRowToDesign(data as DesignRow);

    return NextResponse.json(design, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in PUT /api/designs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/designs/[id]
 * Deletes a design
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting design:', error);
      return NextResponse.json(
        { error: 'Failed to delete design', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/designs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

