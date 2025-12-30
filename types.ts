export enum MoldCategory {
  PLASTIC_INJECTION = '塑膠射出模具',
  PLASTIC_EXTRUSION = '塑膠擠型模具',
  PLASTIC_THERMOFORMING = '塑膠熱壓模具',
  ALUMINUM_DIE_CASTING = '鋁壓鑄模具',
  ALUMINUM_STAMPING = '鋁沖壓模具',
  ALUMINUM_EXTRUSION = '鋁擠型模具',
  METAL_STAMPING_OTHER = '其他金屬沖壓模具',
  SILICONE_DIE_CUT = '矽膠絕緣片刀模',
  CARTON_DIE_CUT = '紙箱刀模',
  STICKER_DIE_CUT = '貼紙刀模',
  SCREEN_PRINTING = '網印模版',
  OTHER = '其他'
}

export interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface QuoteData {
  id: string;
  category: MoldCategory;
  supplierName: string;
  contactPerson: string;
  email: string;
  phone: string;
  submissionDate: string;
  estimatedCost: number;
  currency: string;
  deliveryDate: string;
  specifications: Record<string, any>;
  remarks: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}
