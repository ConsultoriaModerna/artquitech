import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;

    if (!video) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    if (!video.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a video.' },
        { status: 400 }
      );
    }

    // TODO: Use Claude Vision API to analyze video frames
    // This is a placeholder response

    const mockAnalysis = {
      room_type: 'Living Room',
      dimensions: {
        width: 5.0,
        length: 4.0,
        height: 2.8,
      },
      windows: 2,
      doors: 1,
      water_points: 0,
      electrical: {
        outlets: 3,
        switches: 2,
        lights: 1,
      },
      flooring: 'Ceramic Tile',
      wall_condition: 'Good',
      floor_plan_svg: `
        <svg viewBox="0 0 500 400">
          <rect x="50" y="50" width="400" height="300" fill="#D4A574" stroke="#333" stroke-width="2"/>
          <rect x="50" y="50" width="400" height="8" fill="#666"/>
          <rect x="50" y="50" width="8" height="300" fill="#666"/>
          <rect x="442" y="50" width="8" height="300" fill="#666"/>
          <rect x="50" y="342" width="400" height="8" fill="#666"/>
          <circle cx="200" cy="350" r="25" fill="none" stroke="#999" stroke-width="2"/>
          <circle cx="400" cy="100" r="25" fill="none" stroke="#999" stroke-width="2"/>
          <rect x="70" y="50" width="80" height="8" fill="#87CEEB" stroke="#333" stroke-width="1"/>
          <rect x="350" y="50" width="80" height="8" fill="#87CEEB" stroke="#333" stroke-width="1"/>
          <circle cx="100" cy="120" r="8" fill="#FFD700"/>
          <circle cx="100" cy="200" r="8" fill="#FFD700"/>
          <circle cx="300" cy="150" r="8" fill="#FFD700"/>
          <circle cx="250" cy="150" r="12" fill="none" stroke="#FF6B6B" stroke-width="2"/>
        </svg>
      `,
    };

    return NextResponse.json(mockAnalysis, { status: 200 });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    );
  }
}
