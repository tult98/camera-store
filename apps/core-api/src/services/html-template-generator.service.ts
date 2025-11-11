import type {
  DescriptionFeature,
  MediaContent,
  ProductData,
} from '../types/product-data.types';

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const renderMedia = (media: MediaContent): string => {
  if (media.type === 'image') {
    return `<figure class='product-description-media-wrapper'>
  <img
    src='${escapeHtml(media.url)}'
    alt='Product feature'
    class='product-description-media'
  />
</figure>`;
  } else if (media.type === 'video') {
    return `<figure class='product-description-media-wrapper'>
  <div class='product-description-video'>
    <iframe
      src='${escapeHtml(media.url)}'
      title='Product video'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowfullscreen
    ></iframe>
  </div>
</figure>`;
  }
  return '';
};

const renderFeature = (feature: DescriptionFeature): string => {
  const headingTag = `h${feature.headerLevel}`;
  const headerClass =
    feature.headerLevel === 2
      ? 'product-description-header'
      : 'product-description-subheader';

  const contentClass = feature.media
    ? `product-description-content-${feature.media.position}`
    : 'product-description-content-inline';

  const mediaHtml = feature.media ? renderMedia(feature.media) : '';

  const headerHtml = feature.header
    ? `<${headingTag} class='${headerClass}'>
  ${escapeHtml(feature.header)}
</${headingTag}>`
    : '';

  const headerInText = feature.media && feature.header ? headerHtml : '';
  const contentInText = feature.content
    ? `<div>
    ${feature.content}
  </div>`
    : '';

  const textHtml =
    headerInText || contentInText
      ? `<div class='product-description-text'>
  ${headerInText}
  ${contentInText}
</div>`
      : '';

  const contentHtml = `<div class='${contentClass}'>
  ${textHtml}
  ${mediaHtml}
</div>`;

  const subFeaturesHtml =
    feature.subFeatures && feature.subFeatures.length > 0
      ? `<div class='product-description-subfeature'>
  ${feature.subFeatures.map(renderFeature).join('\n')}
</div>`
      : '';

  return `<section class='product-description-section'>
  ${!feature.media && feature.header ? headerHtml : ''}
  ${contentHtml}
  ${subFeaturesHtml}
</section>`;
};

export const generateHtmlDescription = (productData: ProductData): string => {
  const featuresHtml = productData.description.map(renderFeature).join('\n');

  return `<article class='product-description'>
  ${featuresHtml}
</article>`;
};
