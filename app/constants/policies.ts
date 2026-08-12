export interface PolicySection {
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

export interface PolicyDocument {
  title: string
  slug: string
  description: string
  updatedAt: string
  order: number
  introduction: string[]
  sections: PolicySection[]
}

const updatedAt = '2026-08-12'

export const POLICIES: PolicyDocument[] = [
  {
    title: 'Shipping Policy',
    slug: 'shipping-policy',
    description: 'Where Cloud Scart ships, delivery estimates, charges, tracking, cancellations and delayed-delivery remedies.',
    updatedAt,
    order: 1,
    introduction: [
      'This policy explains how we process and deliver orders confirmed through WhatsApp. Delivery is available only to serviceable Indian pincodes.',
    ],
    sections: [
      {
        title: 'Charges and order total',
        bullets: [
          'Shipping is free when the merchandise subtotal is ₹999 or more.',
          'A flat ₹49 shipping charge applies below ₹999.',
          'The checkout summary shows the merchandise subtotal, shipping charge and final amount before you place the order.',
          'Any tax included in a product price or required on an invoice will be disclosed as applicable.',
        ],
      },
      {
        title: 'Processing and delivery estimates',
        paragraphs: ['We normally process confirmed orders within 1–2 working days. The estimated delivery windows below begin after dispatch and are not guarantees.'],
        bullets: [
          'Metro cities: usually 3–4 working days.',
          'Other serviceable locations: usually 5–6 working days.',
          'Remote pincodes: up to 7 working days or the estimate confirmed on WhatsApp.',
        ],
      },
      {
        title: 'Tracking and delivery',
        paragraphs: [
          'We send the courier name and tracking link in the WhatsApp conversation used for the order. Please provide a complete address and reachable phone number. If a courier cannot deliver because the address is incomplete or nobody is available, we will help arrange another attempt where the courier permits it; additional carrier charges may apply only when clearly disclosed and accepted.',
        ],
      },
      {
        title: 'Delays, loss and late delivery',
        paragraphs: [
          'Weather, transport disruption, public restrictions and other events outside our reasonable control can delay delivery. We will help investigate a delayed or lost shipment. If an order is delivered later than the delivery schedule we specifically confirmed, you may request cancellation and a refund unless the delay resulted from force majeure or you accepted a revised date.',
        ],
      },
      {
        title: 'Cash on delivery and cancellation',
        paragraphs: [
          'Cash on Delivery is available only at eligible pincodes. You may cancel without charge before dispatch by messaging us on WhatsApp. If the order has already shipped, contact us promptly; your rights for defective, wrong, spurious, misdescribed or qualifying late-delivered goods are not reduced by shipment or by choosing Cash on Delivery.',
        ],
      },
    ],
  },
  {
    title: 'Return & Refund Policy',
    slug: 'refund-policy',
    description: 'Cloud Scart returns, replacements, refunds, evidence, timelines and return-shipping rules.',
    updatedAt,
    order: 2,
    introduction: [
      'We want delivered products to match their description and arrive complete and usable. This policy is in addition to, and does not limit, rights available under applicable consumer law.',
    ],
    sections: [
      {
        title: 'When we accept a return or remedy',
        bullets: [
          'The product is damaged in transit, defective, deficient, spurious or unsafe.',
          'You receive the wrong product, quantity or a package with missing items.',
          'The product materially differs from the description, features or characteristics agreed at purchase.',
          'Delivery is later than the specifically confirmed schedule, except where the delay is caused by force majeure or you accepted a revised date.',
          'Any other circumstance where return, replacement, repair or refund is required by law or an applicable warranty.',
        ],
      },
      {
        title: 'How and when to report a problem',
        paragraphs: [
          'Contact us on WhatsApp or email as soon as reasonably possible, preferably within 48 hours for visible transit damage, missing items or a wrong product. For a defect discovered later, contact us within the applicable warranty period or a reasonable period after discovery.',
          'Include the order reference, a description of the issue, and available photographs or video. An uninterrupted unboxing video is strongly recommended because it can speed up verification, but the absence of a video does not automatically remove a statutory remedy. We will consider other reasonable evidence.',
        ],
      },
      {
        title: 'Return condition and shipping cost',
        paragraphs: [
          'Keep the product, accessories, labels and packaging reasonably intact while a claim is reviewed. Do not attempt unauthorised repair or modification. If we approve a return because goods are defective, damaged, wrong, spurious, misdescribed or otherwise non-conforming, Cloud Scart will bear reasonable return-shipping cost or arrange pickup where available. For any discretionary change-of-mind return we expressly approve, the customer may have to pay the disclosed return cost.',
        ],
      },
      {
        title: 'Resolution and refund timing',
        paragraphs: [
          'After verification, we will offer the legally appropriate remedy, which may be replacement, repair or refund. We will not substitute store credit unless you agree. Approved refunds are initiated within 5–7 working days and no later than 14 days after acceptance of the refund request. Bank, UPI or card processing may take additional time outside our control.',
          'Prepaid refunds go to the original payment method where possible. Cash-on-delivery refunds are sent to the bank or UPI account you securely provide. We never ask for a UPI PIN, card PIN, OTP or banking password.',
        ],
      },
      {
        title: 'Items not eligible for a discretionary return',
        paragraphs: ['A return may be declined when there is no product defect or legal basis and the item was damaged after delivery through misuse, accident, unauthorised repair or modification. This limitation never overrides a mandatory consumer right.'],
      },
    ],
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    description: 'How Cloud Scart handles personal data for its website and WhatsApp-first ordering service.',
    updatedAt,
    order: 3,
    introduction: [
      'Cloud Scart is responsible for personal data processed through this storefront and its order operations. This notice explains in clear terms what we collect, why we use it, who receives it and how you can exercise your choices.',
    ],
    sections: [
      {
        title: 'Data we collect',
        bullets: [
          'Order and delivery data: name, phone and WhatsApp numbers, address, city, state, pincode, selected products, order notes, amount and payment method.',
          'Communications: messages, email, support records, complaint evidence and any photographs or unboxing videos you choose to provide.',
          'Technical data needed to operate and secure the service, such as standard server logs, browser or device information and pages requested.',
          'Cart contents saved in your browser local storage so the cart can survive a refresh. Delivery details stay only in page memory until you submit checkout. The most recent WhatsApp order link is kept in session storage so you can reopen it during the same browser session.',
        ],
      },
      {
        title: 'Why we use data',
        bullets: [
          'To prepare, confirm, fulfil, deliver, support, cancel and refund an order you request.',
          'To communicate availability, payment instructions, tracking and service updates on WhatsApp, phone or email.',
          'To prevent fraud, secure the service, keep business records and comply with legal, tax, accounting and consumer-protection duties.',
          'To investigate complaints and improve products or service using proportionate, relevant information.',
        ],
      },
      {
        title: 'WhatsApp-first ordering and service providers',
        paragraphs: [
          'Pressing the WhatsApp order button opens a pre-filled message addressed to our business number. Your message is sent only after you choose to send it in WhatsApp. WhatsApp and its provider, Meta, process that communication under their own terms and privacy notice.',
          'We use Supabase for store and order records, hosting providers to deliver the website, and courier or logistics providers to deliver orders. We share only the information reasonably needed for each service. Providers may process data on infrastructure outside India subject to their safeguards and applicable law. We do not sell personal data.',
        ],
      },
      {
        title: 'Payment safety',
        paragraphs: [
          'This website has no embedded card gateway. If you choose prepaid UPI, payment instructions are confirmed in the official WhatsApp chat. We do not need and will never ask for your UPI PIN, card PIN, OTP, full card number or banking password.',
        ],
      },
      {
        title: 'Retention and security',
        paragraphs: [
          'We retain order and transaction records only for fulfilment, support, fraud prevention and the period required by applicable tax, accounting or consumer law. Complaint evidence is removed when no longer needed for the claim or legal record. Browser-stored cart contents remain until you remove them or clear site data; the recent WhatsApp order link expires with the browser session. We use access controls, encrypted connections and restricted administrator access, but no internet service can promise absolute security.',
        ],
      },
      {
        title: 'Your choices and rights',
        paragraphs: [
          'You may ask for a summary of your personal data, correction, completion, erasure where retention is no longer required, withdrawal of consent for optional processing, or grievance redressal. Withdrawal does not affect processing already lawfully completed and may prevent an unfinished order from being fulfilled. We may verify your identity before acting. Where applicable, you may also nominate another individual and complain to the Data Protection Board of India after using our grievance process.',
        ],
      },
      {
        title: 'Children',
        paragraphs: [
          'The store and checkout are intended for adults. A parent or lawful guardian must place an order involving a child. We do not knowingly seek personal data directly from children.',
        ],
      },
      {
        title: 'Changes to this notice',
        paragraphs: ['We may update this notice when our practices or legal obligations change. The current version and effective date will remain available on this page. Material changes will be highlighted where reasonably possible.'],
      },
    ],
  },
  {
    title: 'Terms of Service',
    slug: 'terms-of-service',
    description: 'Terms governing the Cloud Scart website, WhatsApp orders, payments, product information and customer support.',
    updatedAt,
    order: 4,
    introduction: [
      'These terms govern use of the Cloud Scart website and orders placed through our WhatsApp-first checkout. They must be read with the Shipping, Return & Refund and Privacy policies. Nothing in these terms excludes a right or remedy that applicable law does not allow us to exclude.',
    ],
    sections: [
      {
        title: 'Store and eligibility',
        paragraphs: ['Cloud Scart sells drones, remote-control products and gadgets in India. You must be legally capable of entering a contract and provide accurate contact and delivery details. A parent or guardian must place orders for minors.'],
      },
      {
        title: 'How a WhatsApp order is formed',
        paragraphs: [
          'The website creates a pre-filled WhatsApp message from your cart. Pressing the checkout button does not itself send the message or complete a purchase. Send the message in WhatsApp, and we will confirm stock, seller details, final price, charges, payment method and delivery estimate. A binding order is formed only when we expressly accept it in the chat.',
        ],
      },
      {
        title: 'Prices, product information and availability',
        paragraphs: [
          'Prices are in Indian rupees. The checkout displays the final website total and shipping charge. We aim to keep descriptions, images, stock and prices accurate, but may correct a genuine error before accepting an order. Product colour can vary slightly by screen. Applicable manufacturer, importer, country-of-origin, warranty, safety and packaged-commodity information must be reviewed on the listing, packaging or confirmation before purchase; ask us on WhatsApp if anything required is missing.',
        ],
      },
      {
        title: 'Payment and fraud prevention',
        paragraphs: [
          'Eligible orders may use Cash on Delivery or prepaid UPI instructions confirmed through our official WhatsApp number. Never disclose a UPI PIN, card PIN, OTP or banking password. We may decline or pause an order for unavailable stock, an obvious pricing error, an unserviceable address or reasonable fraud and safety concerns.',
        ],
      },
      {
        title: 'Drones, toys and safe use',
        paragraphs: [
          'Use every product only as instructed, with age-appropriate supervision and required protective measures. Drone owners and operators are responsible for checking and following the current Drone Rules, airspace restrictions, registration, certification, remote-pilot and local requirements that apply to their aircraft and intended use. Never operate a drone unlawfully, unsafely or in a restricted area.',
        ],
      },
      {
        title: 'Intellectual property and acceptable use',
        paragraphs: [
          'Cloud Scart owns or lawfully uses the site software, original text, branding and media it publishes. Product and third-party names remain the property of their respective owners and are used only to identify compatible or genuine goods. You may not scrape, republish, impersonate, disrupt or misuse the service, or submit unlawful or infringing material.',
        ],
      },
      {
        title: 'Liability',
        paragraphs: [
          'To the maximum extent allowed by law, neither party is liable for indirect or consequential loss that was not reasonably foreseeable. Cloud Scart remains responsible where liability cannot lawfully be limited, including applicable liability for defective, unsafe, wrong, spurious or misdescribed goods and for fraud, wilful misconduct or negligence as provided by law.',
        ],
      },
      {
        title: 'Complaints, governing law and disputes',
        paragraphs: [
          'Indian law governs these terms. Contact our grievance officer first so we can acknowledge the complaint within 48 hours and aim to resolve it within one month. These terms do not prevent you from using the National Consumer Helpline, a Consumer Commission, the Data Protection Board of India where applicable, or any other forum available under law. Consumer jurisdiction is not restricted by an exclusive-forum clause.',
        ],
      },
      {
        title: 'Changes',
        paragraphs: ['We may update these terms prospectively. The version that applied when an order was accepted continues to govern that order unless a mandatory legal change applies.'],
      },
    ],
  },
]

export const POLICY_SLUGS = POLICIES.map((policy) => policy.slug)

export function getPolicy(slug: string): PolicyDocument | undefined {
  return POLICIES.find((policy) => policy.slug === slug)
}
