import type { FaqItem } from '~/types'

export const FAQS: FaqItem[] = [
  { id: 'f1', question: 'How do I place an order?', answer: 'Add the products you want to your cart, head to checkout and fill in your delivery details. When you tap “Place Order on WhatsApp”, we generate a ready-to-send message with your full order and open WhatsApp. Send it to us and we confirm everything there.' },
  { id: 'f2', question: 'Do you accept Cash on Delivery?', answer: 'Yes. Cash on Delivery is available across most pincodes in India. You only pay when the product reaches your doorstep.' },
  { id: 'f3', question: 'Is there a payment gateway?', answer: 'No card or UPI gateway is needed to order. We confirm your order and arrange payment directly on WhatsApp — either Cash on Delivery or a UPI link our team shares with you.' },
  { id: 'f4', question: 'What are the shipping charges?', answer: 'Shipping is free on all orders above ₹999. For smaller orders, a flat ₹49 is added. Delivery usually takes 3–6 working days.' },
  { id: 'f5', question: 'Can I track my order?', answer: 'Absolutely. Once your order ships we send a tracking link on the same WhatsApp chat you ordered from. You can also use our Track Order page.' },
  { id: 'f6', question: 'What is your return policy?', answer: 'If an item is damaged, defective, wrong or materially different from its listing, message us promptly with your order reference and any available photo or video. We will review it and provide the legally appropriate replacement, repair or refund. An unboxing video is recommended but is not the only evidence we accept.' },
  { id: 'f8', question: 'How fast is delivery?', answer: 'Metro cities typically receive orders in 3–4 working days. Remote pincodes may take up to 6–7 working days. We share the exact timeline when confirming your order.' },
  { id: 'f9', question: 'Do you deliver across all of India?', answer: 'We deliver to almost every serviceable pincode in India. If we cannot deliver to your area, our team will let you know on WhatsApp before confirming.' },
  { id: 'f10', question: 'Can I change or cancel my order?', answer: 'Yes — as long as the order has not shipped. Just reply on the WhatsApp chat and we will update or cancel it for you free of charge.' },
]
