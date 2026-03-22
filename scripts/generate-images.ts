import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const images = [
  {
    prompt: 'Beautiful hero image of Jakarta Chinatown Pecinan Glodok with traditional red lanterns, Chinese architecture, vibrant street life, golden hour lighting, professional photography',
    filename: 'hero-banner.jpg',
    size: '1440x720' as const
  },
  {
    prompt: 'Traditional Chinatown Jakarta Glodok street view with red lanterns, Chinese temple, bustling street food vendors, colorful market, authentic atmosphere',
    filename: 'chinatown-main.jpg',
    size: '1344x768' as const
  },
  {
    prompt: 'Delicious Indonesian Chinese food spread, including bakmi, gado-gado, sate, traditional dishes, professional food photography, warm lighting',
    filename: 'food-culinary.jpg',
    size: '1344x768' as const
  },
  {
    prompt: 'Jakarta West Chinatown at night with glowing red lanterns, Chinese temple lights, vibrant street atmosphere, night photography',
    filename: 'chinatown-night.jpg',
    size: '1344x768' as const
  },
  {
    prompt: 'Close-up of legendary Indonesian street food, bakmi noodles with toppings, authentic presentation, food photography',
    filename: 'bakmi.jpg',
    size: '1024x1024' as const
  },
  {
    prompt: 'Traditional Indonesian gado-gado salad with peanut sauce, fresh vegetables, professional food photography',
    filename: 'gado-gado.jpg',
    size: '1024x1024' as const
  },
  {
    prompt: 'Indonesian sate skewers with peanut sauce, grilled meat, street food scene, warm lighting',
    filename: 'sate.jpg',
    size: '1024x1024' as const
  },
  {
    prompt: 'Chinese temple in Jakarta Glodok Chinatown, ornate architecture, red and gold colors, detailed carvings',
    filename: 'temple.jpg',
    size: '1024x1024' as const
  },
  {
    prompt: 'Vibrant traditional market in Chinatown Jakarta, colorful goods, vendors, authentic atmosphere',
    filename: 'market.jpg',
    size: '1024x1024' as const
  },
  {
    prompt: 'Modern Jakarta skyline with traditional Chinatown elements in foreground, cityscape, evening light',
    filename: 'jakarta-skyline.jpg',
    size: '1344x768' as const
  },
  {
    prompt: 'Beautiful Chinese gate entrance to Glodok Chinatown Jakarta, ornate design, vibrant colors',
    filename: 'chinatown-gate.jpg',
    size: '1344x768' as const
  },
  {
    prompt: 'Indonesian traditional tea house in Chinatown, cozy atmosphere, traditional decor',
    filename: 'tea-house.jpg',
    size: '1024x1024' as const
  }
];

async function generateImage(prompt: string, filename: string, size: string) {
  try {
    const zai = await ZAI.create();

    console.log(`Generating: ${filename}...`);

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

    console.log(`✓ Saved: ${filename}`);
    return { success: true, filename };
  } catch (error: any) {
    console.error(`✗ Failed: ${filename} - ${error.message}`);
    return { success: false, filename, error: error.message };
  }
}

async function generateAllImages() {
  console.log('Starting image generation for Jakarta West Tourism website...\n');

  const results = [];

  for (const image of images) {
    const result = await generateImage(image.prompt, image.filename, image.size);
    results.push(result);

    // Add a small delay between generations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n=== Generation Summary ===');
  const successCount = results.filter(r => r.success).length;
  console.log(`Successfully generated: ${successCount}/${images.length} images`);

  if (successCount < images.length) {
    console.log('\nFailed images:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.filename}: ${r.error}`);
    });
  }
}

generateAllImages().catch(console.error);
