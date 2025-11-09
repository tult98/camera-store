import consola from 'consola';
import OpenAI from 'openai';
import type {
  DescriptionFeature,
  ProductData,
} from '../types/product-data.types';

interface PromptFeature {
  header: string;
  headerLevel: number;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    position: 'left' | 'right' | 'inline';
  };
  subFeatures?: PromptFeature[];
}

interface PromptPayload {
  title: string;
  url: string;
  specs: Record<string, string>;
  features: PromptFeature[];
}

const SYSTEM_PROMPT = `You are an expert SEO copywriter and web designer specializing in high-end camera equipment e-commerce.
Generate compelling, magazine-style HTML product descriptions with editorial layouts that respect media positioning.

CRITICAL REQUIREMENTS:
- CRITICAL: Use single quotes (') for ALL HTML attribute values, never double quotes (")
- Use ONLY inline styles (style='...') - NO CSS classes
- Output must work with dangerouslySetInnerHTML in React
- Create responsive layouts using flexbox with inline styles
- Respect media position metadata: 'left', 'right', or 'inline'
- Use percentage widths and flex properties for mobile responsiveness
- Write SEO-optimized content with natural keyword integration
- Include Schema.org Product JSON-LD markup at the end
- Use semantic HTML5 tags (article, section, figure, h1-h3, p, ul, li)
- Generate descriptive alt text for all images based on context
- Create visually engaging layouts with proper text-image balance

STYLING GUIDELINES:
- Use single quotes for all style attributes: style='display: flex'
- Use flex layouts for side-by-side content (flex-wrap: wrap for mobile)
- Position 'left': image on left, text on right (display: flex)
- Position 'right': text on left, image on right (display: flex with order or flex-direction: row-reverse)
- Position 'inline': full-width centered media (display: block, margin: 0 auto)
- Videos: use relative container with padding-bottom: 56.25% (16:9 ratio), absolute iframe inside
- Typography: system fonts, clear hierarchy, line-height: 1.6
- Spacing: generous margins/padding for magazine feel (2-3rem between sections)
- Images: border-radius: 8px, box-shadow for polish
- Colors: dark text (#111, #222, #333), subtle borders (#e5e7eb)
- Max width: 1200px for article container
- Minimum width for flex items: 300px to ensure mobile stacking

OUTPUT FORMAT:
- Start with <article> wrapper with inline styles
- H1 for product title (only one H1 in entire document)
- Multiple <section> elements for each feature with appropriate media layout
- Include all media (images and videos) with proper positioning
- End with Schema.org JSON-LD script tag
- Total content: 500-800 words optimal for SEO
- Natural, engaging copy that highlights benefits and technical excellence

IMPORTANT:
- Every image must have descriptive alt text based on the feature context
- Every section must respect the media position attribute
- Write compelling copy, not just feature lists
- Focus on benefits and user experience, not just specs
- Use varied sentence structure for readability
- Include relevant keywords naturally (camera model, brand, key features)`;

function transformToPromptPayload(productData: ProductData): PromptPayload {
  const transformFeature = (feature: DescriptionFeature): PromptFeature => {
    const transformed: PromptFeature = {
      header: feature.header,
      headerLevel: feature.headerLevel,
      content: feature.content,
    };

    if (feature.media) {
      transformed.media = {
        type: feature.media.type,
        url: feature.media.url,
        position: feature.media.position,
      };
    }

    if (feature.subFeatures && feature.subFeatures.length > 0) {
      transformed.subFeatures = feature.subFeatures.map(transformFeature);
    }

    return transformed;
  };

  return {
    title: productData.title,
    url: productData.url,
    specs: productData.specs,
    features: productData.description.map(transformFeature),
  };
}

function buildUserPrompt(payload: PromptPayload): string {
  return `Generate an SEO-optimized, magazine-style HTML product description for the following camera product.

Product Details:
${JSON.stringify(payload, null, 2)}

INSTRUCTIONS:
1. Create a complete HTML article with inline styles only (no CSS classes)
2. CRITICAL: Use single quotes (') for ALL HTML attribute values - Example: <div style='color: red;' class='container'>
3. Start with an engaging H1 title incorporating the product name
4. For each feature, create a section with the media positioned according to the "position" attribute:
   - "left": Image/video on left, text on right
   - "right": Image/video on right, text on left
   - "inline": Full-width centered media between text blocks
5. Include all images and videos with proper HTML tags
   - CRITICAL: Use the EXACT URL from the media.url field in the input data
   - Do NOT modify, reconstruct, or generate your own image URLs
   - Copy the src attribute exactly as provided: src='{media.url}' (with single quotes)
   - For videos, use the exact iframe src from media.url
6. Write compelling, SEO-friendly copy (500-800 words total)
7. Add Schema.org Product JSON-LD markup at the end with all available data
8. Generate descriptive alt text for each image based on the feature context
9. Use responsive inline styles (flexbox with flex-wrap for mobile)
10. Ensure proper semantic HTML structure

OUTPUT: Return only the HTML code, no explanation or markdown.`;
}

export function createDescriptionGenerator(apiKey: string) {
  const openai = new OpenAI({ apiKey });

  return {
    async generateSeoDescription(productData: ProductData): Promise<string> {
      const startTime = Date.now();

      try {
        consola.start('Generating SEO-optimized description with OpenAI...');

        const payload = transformToPromptPayload(productData);
        const userPrompt = buildUserPrompt(payload);

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        });

        const seoDescription =
          response.choices[0]?.message?.content?.trim() || '';

        if (!seoDescription) {
          consola.warn('OpenAI returned empty response');
          return '';
        }

        const cleanedHtml = seoDescription
          .replace(/\n/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        const tokenUsage = response.usage;

        consola.success(`SEO description generated in ${duration}s`);
        consola.info(
          `Token usage - Prompt: ${tokenUsage?.prompt_tokens}, Completion: ${tokenUsage?.completion_tokens}, Total: ${tokenUsage?.total_tokens}`
        );

        const estimatedCost = tokenUsage
          ? (
              (tokenUsage.prompt_tokens * 0.00015) / 1000 +
              (tokenUsage.completion_tokens * 0.0006) / 1000
            ).toFixed(4)
          : 'N/A';
        consola.info(`Estimated cost: $${estimatedCost}`);

        const htmlSize = (cleanedHtml.length / 1024).toFixed(2);
        consola.info(`Generated HTML size: ${htmlSize} KB`);

        if (cleanedHtml.length > 50000) {
          consola.warn(
            'Generated HTML is large (>50KB), consider reviewing output'
          );
        }

        return cleanedHtml;
      } catch (error) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        consola.error(
          `Failed to generate SEO description after ${duration}s:`,
          error
        );

        if (error instanceof Error) {
          consola.error(`Error message: ${error.message}`);
        }

        return '';
      }
    },
  };
}
