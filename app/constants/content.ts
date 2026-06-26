import type { FaqItem, Review } from '~/types'

export const REVIEWS: Review[] = [
  { id: 'r1', name: 'Arjun Menon', location: 'Kochi, KL', rating: 5, title: 'Flew it on day one', body: 'The E88 drone arrived in two days and the camera quality is honestly better than I expected at this price. WhatsApp ordering was effortless.', date: '2026-05-02', product: 'e88-pro-4k-camera-drone' },
  { id: 'r2', name: 'Priya Nair', location: 'Bengaluru, KA', rating: 5, title: 'Smooth from cart to delivery', body: 'No annoying signup, no card details. I just sent my order on WhatsApp and paid cash on delivery. This is how shopping should be.', date: '2026-04-21' },
  { id: 'r3', name: 'Rahul Verma', location: 'Pune, MH', rating: 4, title: 'Great RC car, fast support', body: 'The off-road buggy is seriously quick. One wheel cap was loose — they replaced it within a day over WhatsApp.', date: '2026-04-15', product: 'storm-offroad-rc-buggy' },
  { id: 'r4', name: 'Sneha Pillai', location: 'Thiruvananthapuram, KL', rating: 5, title: 'Best price I found', body: 'I compared the same drone on three sites. BestDeal3z was the cheapest and delivery was free. Will buy again.', date: '2026-03-30' },
  { id: 'r5', name: 'Mohammed Asif', location: 'Hyderabad, TS', rating: 5, title: 'My son loves it', body: 'Bought the jet fighter RC plane for my son. Build quality feels solid and it survived a few rough landings already.', date: '2026-03-18', product: 'skyhawk-rc-jet-fighter' },
  { id: 'r6', name: 'Divya Krishnan', location: 'Chennai, TN', rating: 4, title: 'Quick and clear', body: 'Liked that the order summary on WhatsApp listed every item and the total. No confusion at all.', date: '2026-02-27' },
  { id: 'r7', name: 'Karan Singh', location: 'Delhi, DL', rating: 5, title: 'Packaging was premium', body: 'Did not expect this level of packaging at this price point. The gimbal stabiliser works great for my vlogs.', date: '2026-02-11', product: 'pro-handheld-gimbal-stabiliser' },
  { id: 'r8', name: 'Ananya Iyer', location: 'Mumbai, MH', rating: 5, title: 'Cash on delivery FTW', body: 'Trust matters when buying online. COD plus a real human on WhatsApp made me comfortable to order.', date: '2026-01-29' },
  { id: 'r9', name: 'Vishnu Prasad', location: 'Kozhikode, KL', rating: 4, title: 'Value for money', body: 'The LED stunt drone does 360 flips like the video shows. Battery life is short but you get two in the box.', date: '2026-01-12', product: 'nitro-360-stunt-drone' },
  { id: 'r10', name: 'Fatima Sheikh', location: 'Ahmedabad, GJ', rating: 5, title: 'Reordered for gifts', body: 'Bought three different gadgets as Diwali gifts. Everyone was thrilled. The whole process took five minutes.', date: '2025-12-20' },
]

export const FAQS: FaqItem[] = [
  { id: 'f1', question: 'How do I place an order?', answer: 'Add the products you want to your cart, head to checkout and fill in your delivery details. When you tap “Place Order on WhatsApp”, we generate a ready-to-send message with your full order and open WhatsApp. Send it to us and we confirm everything there.' },
  { id: 'f2', question: 'Do you accept Cash on Delivery?', answer: 'Yes. Cash on Delivery is available across most pincodes in India. You only pay when the product reaches your doorstep.' },
  { id: 'f3', question: 'Is there a payment gateway?', answer: 'No card or UPI gateway is needed to order. We confirm your order and arrange payment directly on WhatsApp — either Cash on Delivery or a UPI link our team shares with you.' },
  { id: 'f4', question: 'What are the shipping charges?', answer: 'Shipping is free on all orders above ₹999. For smaller orders, a flat ₹49 is added. Delivery usually takes 3–6 working days.' },
  { id: 'f5', question: 'Can I track my order?', answer: 'Absolutely. Once your order ships we send a tracking link on the same WhatsApp chat you ordered from. You can also use our Track Order page.' },
  { id: 'f6', question: 'What is your return policy?', answer: 'If a product arrives damaged or defective, message us within 48 hours of delivery with a photo or short video and we will arrange a free replacement or refund.' },
  { id: 'f8', question: 'How fast is delivery?', answer: 'Metro cities typically receive orders in 3–4 working days. Remote pincodes may take up to 6–7 working days. We share the exact timeline when confirming your order.' },
  { id: 'f9', question: 'Do you deliver across all of India?', answer: 'We deliver to almost every serviceable pincode in India. If we cannot deliver to your area, our team will let you know on WhatsApp before confirming.' },
  { id: 'f10', question: 'Can I change or cancel my order?', answer: 'Yes — as long as the order has not shipped. Just reply on the WhatsApp chat and we will update or cancel it for you free of charge.' },
]
