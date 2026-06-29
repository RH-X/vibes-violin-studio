import type { InquiryConfig } from '../inquiry/types';
import { practicePalsConfig } from './practice-pals';
import { contactConfig } from './contact';

const registry: Record<string, InquiryConfig> = {
  [practicePalsConfig.slug]: practicePalsConfig,
  [contactConfig.slug]: contactConfig,
};

export function getInquiryConfig(slug: string): InquiryConfig | null {
  return registry[slug] ?? null;
}
