/**
 * Seed script — generates Nuxt Content markdown + themed placeholder images.
 *
 *   node scripts/generate-content.mjs
 *
 * Re-runnable and idempotent. Real product photos can later replace the SVGs
 * in /public/products without touching the markdown (same file names).
 */
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const p = (...s) => resolve(ROOT, ...s)

const M_BLUE_LIGHT = '#0066b1'
const M_BLUE_DARK = '#1c69d4'
const M_RED = '#e22718'

/* ------------------------------------------------------------------ *
 * 1. SVG placeholder generator (dark, motorsport-engineered look).
 * ------------------------------------------------------------------ */

const ICONS = {
  drone: `<g stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="600" cy="600" r="70"/>
    <path d="M600 530v-40M600 670v40M530 600h-40M670 600h40"/>
    <line x1="495" y1="495" x2="705" y2="705"/><line x1="705" y1="495" x2="495" y2="705"/>
    <circle cx="430" cy="430" r="60"/><circle cx="770" cy="430" r="60"/>
    <circle cx="430" cy="770" r="60"/><circle cx="770" cy="770" r="60"/></g>`,
  car: `<g stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M420 640l50-110a40 40 0 0 1 36-24h188a40 40 0 0 1 36 24l50 110"/>
    <path d="M400 640h400v60a30 30 0 0 1-30 30h-40"/>
    <path d="M430 730h-30a30 30 0 0 1-30-30v-60"/>
    <circle cx="500" cy="730" r="48"/><circle cx="700" cy="730" r="48"/></g>`,
  plane: `<g stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M600 420l40 220 130 70-10 40-160-50-160 50-10-40 130-70z"/>
    <path d="M600 760v40l-40 30h80l-40-30z"/></g>`,
  heli: `<g stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <line x1="380" y1="470" x2="820" y2="470"/><line x1="600" y1="470" x2="600" y2="520"/>
    <path d="M520 520h140a40 40 0 0 1 40 40v60a40 40 0 0 1-40 40h-90l-50 60v-200z"/>
    <line x1="660" y1="660" x2="780" y2="660"/></g>`,
  boat: `<g stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M430 640h340l-40 90a40 40 0 0 1-36 24h-188a40 40 0 0 1-36-24z"/>
    <path d="M600 620V470l140 90z"/><path d="M380 760q60 40 120 0t120 0 120 0"/></g>`,
  gimbal: `<g stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="520" y="430" width="160" height="110" rx="10"/><circle cx="600" cy="485" r="34"/>
    <path d="M600 540v80M560 620h80"/><rect x="555" y="690" width="90" height="90" rx="8"/></g>`,
  blaster: `<g stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M420 500h280v70H560l-20 90h-70l10-90h-60z"/>
    <path d="M560 570v90M700 500h80v50h-80z"/></g>`,
  robot: `<g stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="500" y="470" width="200" height="180" rx="16"/>
    <circle cx="555" cy="540" r="20"/><circle cx="645" cy="540" r="20"/><path d="M560 600h80"/>
    <path d="M600 470v-40M470 560h30M700 560h30M540 650v90M660 650v90"/></g>`,
  battery: `<g stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="460" y="520" width="260" height="160" rx="14"/><rect x="720" y="565" width="30" height="70" rx="6"/>
    <path d="M560 560l-30 60h50l-30 60" stroke-width="16"/></g>`,
  generic: `<g stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="470" y="470" width="260" height="260" rx="12"/><path d="M470 560h260M560 470v260"/></g>`,
}

/** Build one 1200×1200 placeholder SVG. */
function buildSvg({ title, kicker, icon = 'generic', accent = M_RED, tone = '#000000', index = 1 }) {
  const glyph = ICONS[icon] || ICONS.generic
  const safe = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200" role="img" aria-label="${safe(title)}">
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0V60" fill="none" stroke="#141414" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="50%" cy="42%" r="55%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${tone}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="1200" fill="${tone}"/>
  <rect width="1200" height="1200" fill="url(#grid)"/>
  <rect width="1200" height="1200" fill="url(#glow)"/>
  <circle cx="600" cy="560" r="300" fill="none" stroke="${accent}" stroke-width="2" stroke-opacity="0.5"/>
  <g color="#ffffff">${glyph}</g>
  <text x="80" y="110" fill="#7e7e7e" font-family="Inter,sans-serif" font-size="26" font-weight="700" letter-spacing="3">BESTDEAL3z</text>
  <text x="1120" y="110" text-anchor="end" fill="#7e7e7e" font-family="Inter,sans-serif" font-size="24" font-weight="400" letter-spacing="2">${safe(kicker || '').toUpperCase()}</text>
  <text x="80" y="1010" fill="#ffffff" font-family="Inter,sans-serif" font-size="58" font-weight="700" letter-spacing="-1">${safe(title).slice(0, 26).toUpperCase()}</text>
  <text x="1120" y="1010" text-anchor="end" fill="#3c3c3c" font-family="Inter,sans-serif" font-size="120" font-weight="700">0${index}</text>
  <g>
    <rect x="80" y="1060" width="120" height="6" fill="${M_BLUE_LIGHT}"/>
    <rect x="200" y="1060" width="120" height="6" fill="${M_BLUE_DARK}"/>
    <rect x="320" y="1060" width="120" height="6" fill="${M_RED}"/>
  </g>
</svg>`
}

async function writeSvg(path, svg) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, svg.replace(/\n\s+/g, '\n'), 'utf8')
}

/* ------------------------------------------------------------------ *
 * 2. Data — 10 categories.
 * ------------------------------------------------------------------ */

const categories = [
  { name: 'Camera Drones', slug: 'drones', icon: 'drone', desc: 'Foldable GPS and 4K camera drones for aerial photography and pure flying fun.' },
  { name: 'RC Cars', slug: 'rc-cars', icon: 'car', desc: 'Off-road buggies, drift racers and monster trucks built for speed and abuse.' },
  { name: 'RC Planes', slug: 'rc-planes', icon: 'plane', desc: 'Jet fighters and gliders engineered for stable, beginner-friendly flight.' },
  { name: 'RC Helicopters', slug: 'rc-helicopters', icon: 'heli', desc: 'Indoor and outdoor helicopters with gyro stabilisation and one-key control.' },
  { name: 'Boats & Subs', slug: 'rc-boats', icon: 'boat', desc: 'High-speed RC boats and dive-ready submarines for the water.' },
  { name: 'Stunt Drones', slug: 'stunt-drones', icon: 'drone', desc: 'Mini and stunt drones that flip, roll and light up the night.' },
  { name: 'Gimbals', slug: 'gimbals', icon: 'gimbal', desc: '3-axis stabilisers that turn any phone or action cam into a cinema rig.' },
  { name: 'Toy Blasters', slug: 'blasters', icon: 'blaster', desc: 'RGB foam and gel blasters with smoke effects for backyard battles.' },
  { name: 'Robotics & STEM', slug: 'robotics', icon: 'robot', desc: 'Programmable robots and DIY kits that make learning to code addictive.' },
  { name: 'Accessories', slug: 'accessories', icon: 'battery', desc: 'Batteries, props, controllers and cases to keep your machines running.' },
]

/* ------------------------------------------------------------------ *
 * 3. Data — 30 products.
 * ------------------------------------------------------------------ */

const F = { featured: 'featured', best: 'bestSeller', trend: 'trending' }

const products = [
  { t: 'E88 Pro 4K Camera Drone', c: 'drones', i: 'drone', price: 2399, sale: 1799, stock: 42, flags: [F.featured, F.best], rating: 4.7, reviews: 214, short: 'Foldable drone with a stabilised 4K front camera and 18-minute flight time.', features: ['Dual 4K + 720p cameras with app live-view', 'One-key take-off, landing and return', 'Foldable arms fit in a jacket pocket', '2.4 GHz control up to 100 m'], variants: [{ name: 'Bundle', options: ['Single Battery', 'Dual Battery', 'Triple Battery'] }] },
  { t: 'SkyVision Foldable GPS Drone', c: 'drones', i: 'drone', price: 4999, sale: 3799, stock: 18, flags: [F.featured, F.trend], rating: 4.8, reviews: 156, short: 'GPS-assisted drone with auto-return and follow-me intelligent flight.', features: ['GPS + GLONASS positioning and auto-return', 'Brushless motors for quiet, stable flight', '25-minute flight time per charge', 'Follow-me and waypoint modes'], variants: [{ name: 'Bundle', options: ['Standard', 'Combo with Case'] }] },
  { t: 'ThunderJet Brushless Drone', c: 'drones', i: 'drone', price: 3499, sale: 2799, stock: 26, flags: [F.best], rating: 4.5, reviews: 98, short: 'Brushless-motor drone tuned for windy outdoor conditions and long range.', features: ['Brushless motors rated for 300+ flights', 'Wind-resistant up to level 5', '5 GHz FPV transmission', 'Optical-flow indoor hover'], variants: [] },
  { t: 'Nano FPV Racing Drone', c: 'drones', i: 'drone', price: 1999, sale: null, stock: 50, flags: [F.trend], rating: 4.3, reviews: 73, short: 'Palm-sized FPV racer with goggles-ready video and acro flight mode.', features: ['Sub-50 g whoop-class frame', 'Analog FPV out to your goggles', 'Acro + self-level modes', 'Prop guards included'], variants: [] },
  { t: 'AeroMax Dual-Camera Drone', c: 'drones', i: 'drone', price: 2899, sale: 2299, stock: 31, flags: [], rating: 4.4, reviews: 64, short: 'Adjustable dual-camera drone with gesture selfies and gravity control.', features: ['90° adjustable main camera', 'Gesture photo + video capture', 'Tilt-to-steer gravity control', 'Trajectory flight path drawing'], variants: [] },
  { t: 'Storm Off-Road RC Buggy', c: 'rc-cars', i: 'car', price: 2299, sale: 1699, stock: 38, flags: [F.featured, F.best], rating: 4.6, reviews: 187, short: '1:16 four-wheel-drive buggy that hits 35 km/h on dirt, grass or gravel.', features: ['4WD with independent oil-filled shocks', 'Up to 35 km/h top speed', 'Waterproof electronics', '40-minute runtime, two battery packs'], variants: [{ name: 'Colour', options: ['Red', 'Blue', 'Green'] }] },
  { t: 'Velocity 4WD Drift Racer', c: 'rc-cars', i: 'car', price: 2799, sale: 2199, stock: 22, flags: [F.trend], rating: 4.5, reviews: 91, short: 'On-road drift car with slick tyres, LED underglow and proportional steering.', features: ['Drift-tuned slick tyres + spare grip set', 'RGB underglow lighting', 'Proportional throttle and steering', '2.4 GHz anti-interference radio'], variants: [{ name: 'Colour', options: ['White', 'Black'] }] },
  { t: 'Rock Crawler Monster Truck', c: 'rc-cars', i: 'car', price: 3299, sale: 2499, stock: 19, flags: [F.best], rating: 4.7, reviews: 142, short: 'Big-wheel 1:10 crawler that climbs rocks, stairs and steep inclines.', features: ['Articulated suspension for 45° climbs', 'Oversized treaded tyres', 'Metal drive shafts', '100 m control range'], variants: [] },
  { t: 'Mini Pocket Racer', c: 'rc-cars', i: 'car', price: 699, sale: 499, stock: 80, flags: [], rating: 4.1, reviews: 56, short: 'Tiny high-speed racer that fits in your palm — perfect desk-to-floor fun.', features: ['Palm-sized 1:32 scale', 'USB fast charging', '15-minute runtime', 'Trim dial for straight-line tracking'], variants: [{ name: 'Colour', options: ['Yellow', 'Red', 'Blue'] }] },
  { t: 'SkyHawk RC Jet Fighter', c: 'rc-planes', i: 'plane', price: 2499, sale: 1499, stock: 27, flags: [F.featured], rating: 4.4, reviews: 119, short: '2.4 GHz EPP-foam jet fighter built to survive beginner crash landings.', features: ['Crash-resistant EPP foam airframe', 'One-key aerobatics and U-turn', 'Dual brushless ducted fans', '6-axis gyro auto-stabilisation'], variants: [] },
  { t: 'Glider Pro RC Plane', c: 'rc-planes', i: 'plane', price: 1799, sale: null, stock: 34, flags: [], rating: 4.2, reviews: 47, short: 'Wide-wing glider tuned for long, lazy, beginner-friendly flights.', features: ['760 mm wingspan for stable lift', 'Throw-and-go hand launch', '20-minute flight time', 'Modular wings for easy transport'], variants: [] },
  { t: 'Falcon 3.5CH RC Helicopter', c: 'rc-helicopters', i: 'heli', price: 1599, sale: 1199, stock: 44, flags: [F.best], rating: 4.3, reviews: 103, short: 'Gyro-stabilised 3.5-channel helicopter for confident indoor flying.', features: ['Built-in gyro for rock-steady hover', 'Alloy body resists crashes', 'LED navigation lights', 'USB charging, 8-minute flights'], variants: [{ name: 'Colour', options: ['Silver', 'Gold'] }] },
  { t: 'Micro Indoor Heli', c: 'rc-helicopters', i: 'heli', price: 899, sale: 649, stock: 60, flags: [], rating: 4.0, reviews: 38, short: 'Ultra-light indoor helicopter sized for living rooms and offices.', features: ['Featherweight infrared control', 'Auto-stable single rotor', 'Charge via controller', 'Crash-friendly flexible blades'], variants: [] },
  { t: 'WaveRunner High-Speed RC Boat', c: 'rc-boats', i: 'boat', price: 2999, sale: 2299, stock: 21, flags: [F.trend], rating: 4.5, reviews: 87, short: 'Twin-motor racing boat that tops 25 km/h with auto-flip recovery.', features: ['Twin water-cooled motors', 'Up to 25 km/h on water', 'Auto-flip righting if capsized', 'Low-battery + out-of-range alarms'], variants: [] },
  { t: 'DeepDive RC Submarine', c: 'rc-boats', i: 'boat', price: 1699, sale: 1299, stock: 29, flags: [], rating: 4.1, reviews: 41, short: 'Six-way RC submarine that dives, surfaces and cruises your aquarium or pool.', features: ['6-direction underwater control', 'Ballast dive + surface system', 'Bright forward LED', 'Sealed waterproof hull'], variants: [] },
  { t: 'Nitro 360 Stunt Drone', c: 'stunt-drones', i: 'drone', price: 1499, sale: 999, stock: 55, flags: [F.trend, F.best], rating: 4.4, reviews: 165, short: 'Headless-mode stunt drone that does one-key 360° flips with LED trails.', features: ['One-key 360° barrel rolls', 'Headless mode for easy steering', 'Colour LED light show', 'Two batteries for 16 min flight'], variants: [{ name: 'Colour', options: ['Black', 'White'] }] },
  { t: 'Mini Pocket Drone for Kids', c: 'stunt-drones', i: 'drone', price: 999, sale: 749, stock: 70, flags: [F.featured], rating: 4.2, reviews: 88, short: 'Beginner-safe mini drone with full prop guards and altitude hold.', features: ['Full 360° propeller guards', 'Altitude hold for steady hover', '3-speed modes grow with skill', 'Throw-to-go auto take-off'], variants: [{ name: 'Colour', options: ['Blue', 'Pink', 'Green'] }] },
  { t: 'Pro Handheld Gimbal Stabiliser', c: 'gimbals', i: 'gimbal', price: 3499, sale: 2799, stock: 24, flags: [F.featured], rating: 4.6, reviews: 132, short: '3-axis smartphone gimbal with face tracking and gesture control.', features: ['3-axis brushless stabilisation', 'AI face + object tracking', 'Gesture-triggered photos', '12-hour battery, foldable design'], variants: [] },
  { t: 'Smartphone 3-Axis Gimbal', c: 'gimbals', i: 'gimbal', price: 2599, sale: 1999, stock: 33, flags: [], rating: 4.4, reviews: 76, short: 'Compact phone gimbal with one-tap modes for vlogs and timelapses.', features: ['One-tap portrait/landscape flip', 'Inception spin + timelapse modes', 'Phones up to 6.7 inches', 'USB-C fast charge'], variants: [] },
  { t: 'Vortex RGB Blaster with Smoke', c: 'blasters', i: 'blaster', price: 1499, sale: 1099, stock: 47, flags: [F.trend], rating: 4.3, reviews: 94, short: 'Light-and-sound blaster with RGB suppressor glow and harmless smoke vapour.', features: ['RGB suppressor light effects', 'Realistic recoil sound', 'Water-vapour smoke puff', 'USB rechargeable'], variants: [] },
  { t: 'Tactical Foam Dart Blaster', c: 'blasters', i: 'blaster', price: 899, sale: 649, stock: 65, flags: [], rating: 4.1, reviews: 52, short: 'Rapid-fire foam dart blaster with a 20-round clip and 12 m range.', features: ['20-dart quick-load clip', 'Up to 12 m firing range', 'Soft-tip safe foam darts', 'Tactical rail accessories'], variants: [{ name: 'Pack', options: ['20 Darts', '40 Darts'] }] },
  { t: 'Electric Gel Blaster Pro', c: 'blasters', i: 'blaster', price: 1899, sale: 1399, stock: 36, flags: [], rating: 4.2, reviews: 61, short: 'Auto gel-ball blaster with electric drive and 11 m effective range.', features: ['Full-auto electric firing', '11 m effective range', '40,000 gel balls included', 'Rechargeable Li-ion pack'], variants: [] },
  { t: 'CodeBot Programmable Robot', c: 'robotics', i: 'robot', price: 2999, sale: 2399, stock: 23, flags: [F.featured], rating: 4.7, reviews: 108, short: 'App-programmable robot that teaches kids block coding through play.', features: ['Drag-and-drop block coding app', 'Line-follow + obstacle-avoid sensors', 'Expression LED face', 'Rechargeable, 90-min play'], variants: [] },
  { t: 'Solar DIY Robot Kit', c: 'robotics', i: 'robot', price: 1299, sale: 899, stock: 48, flags: [], rating: 4.3, reviews: 67, short: '14-in-1 solar robot building kit — no batteries, pure STEM fun.', features: ['Build 14 different robots', 'Solar powered, no batteries', '190+ snap-together parts', 'Illustrated instruction manual'], variants: [] },
  { t: 'RC Transforming Robot Car', c: 'robotics', i: 'robot', price: 1799, sale: 1299, stock: 39, flags: [F.trend], rating: 4.4, reviews: 84, short: 'One-key transforming RC car that stands up into a dancing robot.', features: ['One-key car-to-robot transform', 'Dance, demo and drift modes', 'Music and light show', 'Gesture / controller dual control'], variants: [{ name: 'Colour', options: ['Red', 'Blue'] }] },
  { t: '7.4V LiPo Battery Pack (2-Pack)', c: 'accessories', i: 'battery', price: 999, sale: 749, stock: 90, flags: [F.best], rating: 4.5, reviews: 121, short: 'Spare 7.4V 1200mAh LiPo packs — double your flight or drive time.', features: ['2 × 1200mAh 7.4V LiPo', 'Universal JST connector', 'Overcharge protection', 'Fits most mid-size drones & cars'], variants: [] },
  { t: 'Drone Propeller Guard Set', c: 'accessories', i: 'generic', price: 399, sale: 299, stock: 120, flags: [], rating: 4.2, reviews: 44, short: 'Snap-on propeller guards plus 8 spare props for crash protection.', features: ['Full 360° prop protection', '8 spare propellers included', 'Tool-free snap fit', 'Lightweight ABS'], variants: [] },
  { t: 'Universal RC Controller', c: 'accessories', i: 'generic', price: 1299, sale: 999, stock: 40, flags: [], rating: 4.3, reviews: 33, short: '2.4 GHz universal transmitter with trims for cars, boats and planes.', features: ['2.4 GHz anti-interference', 'Dual trims + dual rates', 'Ergonomic textured grips', 'Low-battery indicator'], variants: [] },
  { t: 'Fast Charging Hub', c: 'accessories', i: 'battery', price: 799, sale: 599, stock: 75, flags: [], rating: 4.4, reviews: 58, short: 'Charge up to six batteries at once with smart per-port cutoff.', features: ['6-port simultaneous charging', 'Per-port auto cutoff', 'LED charge status', 'Short-circuit protection'], variants: [] },
  { t: 'Carry Case for Drones', c: 'accessories', i: 'generic', price: 1099, sale: 849, stock: 52, flags: [], rating: 4.5, reviews: 49, short: 'Hard-shell water-resistant case with custom foam for drone + accessories.', features: ['EVA hard shell, water-resistant', 'Custom-cut protective foam', 'Fits drone, props, batteries', 'Padded carry handle'], variants: [] },
]

/* ------------------------------------------------------------------ *
 * 4. Banners.
 * ------------------------------------------------------------------ */

const banners = [
  { title: 'THE ULTIMATE FLYING MACHINE', subtitle: 'E88 Pro 4K Camera Drone — now 25% off, free shipping & cash on delivery.', icon: 'drone', accent: M_RED, button: 'Shop Drones', link: '/category/drones' },
  { title: 'BUILT FOR THE DIRT', subtitle: '4WD off-road buggies that hit 35 km/h. Engineered to take a beating.', icon: 'car', accent: M_BLUE_DARK, button: 'Shop RC Cars', link: '/category/rc-cars' },
  { title: 'OWN THE NIGHT SKY', subtitle: 'Stunt drones with 360° flips and full LED light shows from ₹999.', icon: 'drone', accent: M_BLUE_LIGHT, button: 'Shop Stunt Drones', link: '/category/stunt-drones' },
  { title: 'CINEMA IN YOUR HAND', subtitle: '3-axis gimbals with AI tracking. Turn any phone into a movie rig.', icon: 'gimbal', accent: M_RED, button: 'Shop Gimbals', link: '/category/gimbals' },
  { title: 'DEALS THAT MOVE FAST', subtitle: 'Up to 40% off across drones, RC machines and gadgets. While stocks last.', icon: 'generic', accent: M_BLUE_DARK, button: 'Shop All Deals', link: '/shop' },
]

/* ------------------------------------------------------------------ *
 * 5. Markdown writers.
 * ------------------------------------------------------------------ */

const yamlList = (arr) => arr.map((x) => `  - ${JSON.stringify(x)}`).join('\n')

function productMarkdown(prod, slug, images) {
  const flags = new Set(prod.flags)
  const variantsYaml = prod.variants.length
    ? `variants:\n${prod.variants.map((v) => `  - name: ${JSON.stringify(v.name)}\n    options:\n${v.options.map((o) => `      - ${JSON.stringify(o)}`).join('\n')}`).join('\n')}`
    : 'variants: []'

  const body = [
    `## About the ${prod.t}`,
    '',
    `The **${prod.t}** is part of the BestDeal3z performance line — ${prod.short.charAt(0).toLowerCase()}${prod.short.slice(1)}`,
    '',
    '### Key features',
    '',
    ...prod.features.map((f) => `- ${f}`),
    '',
    "### What's in the box",
    '',
    `- 1 × ${prod.t}`,
    '- 1 × Remote controller / control unit',
    '- 1 × USB charging cable',
    '- 1 × User manual & spare parts',
    '',
    '> Ships across India with free delivery over ₹999 and cash on delivery available. Order in seconds — checkout happens on WhatsApp.',
  ].join('\n')

  return `---
title: ${JSON.stringify(prod.t)}
slug: ${JSON.stringify(slug)}
category: ${JSON.stringify(prod.c)}
shortDescription: ${JSON.stringify(prod.short)}
description: ${JSON.stringify(prod.short)}
price: ${prod.price}
salePrice: ${prod.sale === null ? 'null' : prod.sale}
stock: ${prod.stock}
featured: ${flags.has(F.featured)}
bestSeller: ${flags.has(F.best)}
trending: ${flags.has(F.trend)}
rating: ${prod.rating}
reviewCount: ${prod.reviews}
images:
${yamlList(images)}
${variantsYaml}
createdAt: ${JSON.stringify(prod.createdAt)}
---

${body}
`
}

function categoryMarkdown(cat, order, image) {
  return `---
name: ${JSON.stringify(cat.name)}
slug: ${JSON.stringify(cat.slug)}
image: ${JSON.stringify(image)}
description: ${JSON.stringify(cat.desc)}
order: ${order}
---
`
}

function bannerMarkdown(b, order, image, slug) {
  return `---
title: ${JSON.stringify(b.title)}
subtitle: ${JSON.stringify(b.subtitle)}
image: ${JSON.stringify(image)}
buttonText: ${JSON.stringify(b.button)}
buttonLink: ${JSON.stringify(b.link)}
order: ${order}
---
`
}

/* ------------------------------------------------------------------ *
 * 6. Run.
 * ------------------------------------------------------------------ */

async function run() {
  // Clean generated dirs so re-runs stay idempotent.
  for (const d of ['content/products', 'content/categories', 'content/banners', 'public/products', 'public/categories', 'public/banners']) {
    await rm(p(d), { recursive: true, force: true })
    await mkdir(p(d), { recursive: true })
  }

  const accents = [M_RED, M_BLUE_DARK, M_BLUE_LIGHT]
  // Deterministic createdAt timeline so "newest" sorting is stable.
  const baseDate = new Date('2026-01-05T10:00:00.000Z').getTime()

  // Categories
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i]
    const img = `/categories/${cat.slug}.svg`
    await writeSvg(p('public' + img), buildSvg({ title: cat.name, kicker: 'Category', icon: cat.icon, accent: accents[i % 3], index: i + 1 }))
    await writeFile(p('content/categories', `${cat.slug}.md`), categoryMarkdown(cat, i, img), 'utf8')
  }

  // Products
  for (let i = 0; i < products.length; i++) {
    const prod = products[i]
    const slug = prod.t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '')
    prod.createdAt = new Date(baseDate + i * 36e5 * 12).toISOString()
    const imageCount = 3
    const images = []
    for (let j = 0; j < imageCount; j++) {
      const img = `/products/${slug}-${j + 1}.svg`
      images.push(img)
      await writeSvg(p('public' + img), buildSvg({
        title: prod.t,
        kicker: prod.c.replace(/-/g, ' '),
        icon: prod.i,
        accent: accents[(i + j) % 3],
        tone: j === 1 ? '#0d0d0d' : '#000000',
        index: i + 1,
      }))
    }
    await writeFile(p('content/products', `${slug}.md`), productMarkdown(prod, slug, images), 'utf8')
  }

  // Banners
  for (let i = 0; i < banners.length; i++) {
    const b = banners[i]
    const slug = `banner-${i + 1}`
    const img = `/banners/${slug}.svg`
    await writeSvg(p('public' + img), buildSvg({ title: b.title, kicker: 'Featured', icon: b.icon, accent: b.accent, index: i + 1 }))
    await writeFile(p('content/banners', `${slug}.md`), bannerMarkdown(b, i, img, slug), 'utf8')
  }

  // Favicon + OG fallback
  await writeSvg(p('public/favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="#000"/><rect x="8" y="44" width="14" height="6" fill="${M_BLUE_LIGHT}"/><rect x="22" y="44" width="14" height="6" fill="${M_BLUE_DARK}"/><rect x="36" y="44" width="14" height="6" fill="${M_RED}"/><text x="8" y="34" fill="#fff" font-family="Inter,sans-serif" font-size="30" font-weight="700">B3</text></svg>`)
  await writeSvg(p('public/og-image.svg'), buildSvg({ title: 'BestDeal3z', kicker: 'Engineered Deals', icon: 'drone', accent: M_RED, index: 1 }))

  console.info(`Generated ${categories.length} categories, ${products.length} products, ${banners.length} banners.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
