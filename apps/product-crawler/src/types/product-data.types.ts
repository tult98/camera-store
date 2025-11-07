interface MediaContent {
  type: 'image' | 'video';
  url: string;
  position: 'left' | 'right' | 'inline';
}

interface DescriptionFeature {
  header: string;
  headerLevel: number;
  content: string;
  media: MediaContent | null;
  subFeatures: DescriptionFeature[];
}

export interface ProductData {
  url: string;
  title: string;
  description: DescriptionFeature[];
  specs: Record<string, string>;
}
