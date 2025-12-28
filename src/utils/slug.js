/**
 * Slug generation utilities
 */

/**
 * Generate URL-friendly slug from text
 */
const generateSlug = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove accents/diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Ensure slug is unique by appending number if needed
 */
const ensureUniqueSlug = async (baseSlug, model, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const whereClause = { slug };

    // Exclude current record if updating
    if (excludeId) {
      whereClause.id = { [model.sequelize.Sequelize.Op.ne]: excludeId };
    }

    const existing = await model.findOne({ where: whereClause });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

/**
 * Generate slug from title with uniqueness check
 */
const generateUniqueSlug = async (title, model, excludeId = null) => {
  const baseSlug = generateSlug(title);

  if (!baseSlug) {
    // Fallback to random string if title doesn't produce valid slug
    return `post-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  return await ensureUniqueSlug(baseSlug, model, excludeId);
};

module.exports = {
  generateSlug,
  ensureUniqueSlug,
  generateUniqueSlug
};
