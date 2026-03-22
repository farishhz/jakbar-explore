import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { prompt, filename, size = '1344x768' } = await request.json();

    if (!prompt || !filename) {
      return NextResponse.json({ error: 'Prompt and filename are required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const response = await zai.images.generations.create({
      prompt: prompt,
      size: size
    });

    if (!response.data || !response.data[0] || !response.data[0].base64) {
      throw new Error('Invalid response from image generation API');
    }

    const imageBase64 = response.data[0].base64;
    const buffer = Buffer.from(imageBase64, 'base64');

    const outputDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, buffer);

    return NextResponse.json({
      success: true,
      imageUrl: `/images/${filename}`,
      filename: filename
    });
  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
