import type { InquiryConfig } from '../inquiry/types';
import { practicePalsConfig } from './practice-pals';
import { contactConfig } from './contact';
import { violinKickstartConfig } from './violin-kickstart';

const registry: Record<string, InquiryConfig> = {
  [practicePalsConfig.slug]: practicePalsConfig,
  [contactConfig.slug]: contactConfig,
  [violinKickstartConfig.slug]: violinKickstartConfig,
};

export function getInquiryConfig(slug: string): InquiryConfig | null {
  return registry[slug] ?? null;
}
