/**
 * Local brand illustrations bundled in /public/images — used to keep the
 * UI visually alive before real jobsite photos are uploaded via the admin
 * dashboard's Cloudinary uploader. Fully local: no external image host,
 * no hotlinking, nothing that can break if a third-party CDN is
 * unreachable or blocked.
 *
 * Swap any of these out any time by dropping a same-named file into
 * /public/images (or by changing the path below to point elsewhere).
 */
export const STOCK_IMAGES = {
  heroRooftop: "/images/hero-solar.png",
  technicianInstalling: "/images/about-team.png",
  aerialSolarField: "/images/services-field.png",
  solarPanelCloseup: "/images/products-cells.png",
};
