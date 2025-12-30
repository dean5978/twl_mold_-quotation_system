import { MoldCategory, FormFieldConfig } from './types';
import { 
  Box, 
  Layers, 
  Thermometer, 
  Cpu, 
  Hammer, 
  Minimize, 
  Scissors, 
  FileText, 
  StickyNote, 
  Printer, 
  MoreHorizontal,
  Component
} from 'lucide-react';

export const CATEGORY_ICONS: Record<MoldCategory, any> = {
  [MoldCategory.PLASTIC_INJECTION]: Box,
  [MoldCategory.PLASTIC_EXTRUSION]: Layers,
  [MoldCategory.PLASTIC_THERMOFORMING]: Thermometer,
  [MoldCategory.ALUMINUM_DIE_CASTING]: Component,
  [MoldCategory.ALUMINUM_STAMPING]: Hammer,
  [MoldCategory.ALUMINUM_EXTRUSION]: Minimize,
  [MoldCategory.METAL_STAMPING_OTHER]: Cpu,
  [MoldCategory.SILICONE_DIE_CUT]: Scissors,
  [MoldCategory.CARTON_DIE_CUT]: Box, // Reusing Box conceptually
  [MoldCategory.STICKER_DIE_CUT]: StickyNote,
  [MoldCategory.SCREEN_PRINTING]: Printer,
  [MoldCategory.OTHER]: MoreHorizontal,
};

// Define specific fields for each category to generate dynamic forms
export const CATEGORY_FIELDS: Record<MoldCategory, FormFieldConfig[]> = {
  [MoldCategory.PLASTIC_INJECTION]: [
    { key: 'cavities', label: '模穴數 (Cavities)', type: 'number', required: true, placeholder: '例如: 1*4' },
    { key: 'material', label: '塑膠材質', type: 'text', required: true, placeholder: '例如: ABS, PP, PC' },
    { key: 'moldSteel', label: '模具鋼材', type: 'text', placeholder: '例如: NAK80, P20' },
    { key: 'surfaceFinish', label: '表面處理', type: 'select', options: ['SPI A1', 'SPI B1', 'VDI 3400', '咬花', '拋光'], required: true },
  ],
  [MoldCategory.PLASTIC_EXTRUSION]: [
    { key: 'profileWidth', label: '截面寬度 (mm)', type: 'number', required: true },
    { key: 'material', label: '擠型材質', type: 'text', required: true, placeholder: 'PVC, PE...' },
    { key: 'outputRate', label: '預估產能 (m/min)', type: 'number' },
  ],
  [MoldCategory.PLASTIC_THERMOFORMING]: [
    { key: 'sheetThickness', label: '片材厚度 (mm)', type: 'number', required: true },
    { key: 'moldMaterial', label: '模具材質', type: 'select', options: ['鋁模', '木模', '樹脂模'] },
  ],
  [MoldCategory.ALUMINUM_DIE_CASTING]: [
    { key: 'tonnage', label: '機台頓數 (Tons)', type: 'number', required: true },
    { key: 'alloy', label: '鋁合金牌號', type: 'text', placeholder: '例如: ADC12' },
    { key: 'postProcess', label: '後加工需求', type: 'text', placeholder: 'CNC, 烤漆...' },
  ],
  [MoldCategory.ALUMINUM_STAMPING]: [
    { key: 'materialThick', label: '材料厚度 (mm)', type: 'number', required: true },
    { key: 'stageCount', label: '工程數', type: 'number' },
  ],
  [MoldCategory.ALUMINUM_EXTRUSION]: [
    { key: 'circleSize', label: '外接圓直徑 (mm)', type: 'number', required: true },
    { key: 'alloy', label: '鋁合金牌號', type: 'text', placeholder: '6061, 6063' },
  ],
  [MoldCategory.METAL_STAMPING_OTHER]: [
    { key: 'metalType', label: '金屬種類', type: 'text', required: true, placeholder: '不鏽鋼, 銅...' },
    { key: 'thickness', label: '材料厚度 (mm)', type: 'number' },
  ],
  [MoldCategory.SILICONE_DIE_CUT]: [
    { key: 'hardness', label: '硬度 (Shore A)', type: 'number' },
    { key: 'adhesive', label: '背膠型號', type: 'text', placeholder: '3M 467MP...' },
  ],
  [MoldCategory.CARTON_DIE_CUT]: [
    { key: 'boardGrade', label: '紙板材質', type: 'text', required: true, placeholder: '瓦楞紙 A浪/B浪' },
    { key: 'totalLength', label: '刀線總長 (m)', type: 'number' },
  ],
  [MoldCategory.STICKER_DIE_CUT]: [
    { key: 'material', label: '貼紙材質', type: 'text', required: true },
    { key: 'shapeComplexity', label: '形狀複雜度', type: 'select', options: ['簡單幾何', '複雜曲線', '多重半斷'] },
  ],
  [MoldCategory.SCREEN_PRINTING]: [
    { key: 'meshCount', label: '網目數', type: 'number', required: true },
    { key: 'frameSize', label: '網框尺寸', type: 'text' },
  ],
  [MoldCategory.OTHER]: [
    { key: 'description', label: '模具描述', type: 'text', required: true },
    { key: 'requirement', label: '特殊需求', type: 'textarea' },
  ]
};

export const COMMON_FIELDS: FormFieldConfig[] = [
  { key: 'estimatedLife', label: '預估模具壽命 (Shots)', type: 'number', placeholder: '例如: 300,000' },
  { key: 'partWeight', label: '成品單重 (g)', type: 'number' },
];