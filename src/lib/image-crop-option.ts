/**
 * Name of the <Image>/getImage option that carries a letterbox crop
 * ("<top>,<bottom>" pixel rows of the original). Shared by the media registry
 * and the image service without making either import the other.
 * A `data-` name keeps it type-valid as an <img> attribute; the image service
 * strips it from the rendered HTML.
 */
export const LETTERBOX_OPTION = 'data-letterbox';
