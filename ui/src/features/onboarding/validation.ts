import * as Yup from 'yup';

// Custom validation function that integrates with react-i18next
export const createStep1Schema = (t: (key: string) => string) => Yup.object({
  unitSystem: Yup.string().oneOf(['metric', 'imperial']).required(t('validation.required')),
  dateOfBirth: Yup.string()
    .required(t('validation.required'))
    .test('date-format', t('validation.invalidDate'), (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('date-range', t('validation.dateTooOld'), (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date >= new Date(1930, 0, 1);
    })
    .test('date-range', t('validation.dateTooYoung'), (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date <= new Date(new Date().getFullYear() - 8, 11, 31);
    }),
  gender: Yup.string().oneOf(['male', 'female', 'na']).required(t('validation.required')),
  activityLevel: Yup.string().oneOf(['sedentary', 'light', 'moderate', 'high', 'extreme']).required(t('validation.required')),
  heightUnit: Yup.string().oneOf(['cm', 'in', 'ft_in']).required(),
  heightRaw: Yup.string()
    .nullable()
    .optional()
    .test('height-range', t('validation.heightOutOfRange'), function (value) {
      if (!value) return true; // Optional field
      const numValue = Number(value);
      if (isNaN(numValue)) return false;
      return numValue >= 100 && numValue <= 230; // 100cm to 230cm (reasonable human height range)
    }),
  heightFtRaw: Yup.string()
    .nullable()
    .optional()
    .test('height-ft-range', t('validation.heightOutOfRangeImperial'), function (value) {
      if (!value) return true; // Optional field
      const numValue = Number(value);
      if (isNaN(numValue)) return false;
      return numValue >= 1 && numValue <= 10; // 1ft to 10ft (reasonable human height range)
    }),
  heightInRaw: Yup.string()
    .nullable()
    .optional()
    .test('height-in-range', t('validation.heightOutOfRange'), (value) => {
      if (!value) return true; // Optional field
      const numValue = Number(value);
      if (isNaN(numValue)) return false;
      return numValue >= 0 && numValue <= 11; // 0in to 11in (reasonable human height range)
    }),
  weightRaw: Yup.string()
    .nullable()
    .optional()
    .test('weight-range', t('validation.weightOutOfRange'), function (value) {
      if (!value) return true; // Optional field
      const numValue = Number(value);
      if (isNaN(numValue)) return false;
      return numValue >= 20 && numValue <= 500; // reasonable weight range (handles both kg and lb)
    }),
  weightUnit: Yup.string().oneOf(['kg', 'lb']).optional(),
  timezone: Yup.string().required(),
  language: Yup.string().required(),
});

export type Step1FormData = Yup.InferType<ReturnType<typeof createStep1Schema>>;

// Type for the processed data after form submission
export interface Step1ProcessedData extends Omit<Step1FormData, 'heightRaw' | 'heightFtRaw' | 'heightInRaw' | 'weightRaw' | 'dateOfBirth'> {
  heightRaw: number | null;
  heightFtRaw: number | null;
  heightInRaw: number | null;
  weightRaw: number | null;
  dateOfBirth: Date;
}

export const validateStep1 = async (data: unknown, t: (key: string) => string): Promise<Step1FormData> => {
  return await createStep1Schema(t).validate(data, { abortEarly: false });
};

export const createStep2Schema = (t: (key: string) => string) => Yup.object({
  experienceLevel: Yup.string().oneOf(['novice','intermediate','advanced','expert']).required(t('validation.required')),
  currentBuild: Yup.string().optional(),
  hasConsistentTraining: Yup.boolean().required(t('validation.required')),
  inactivityDuration: Yup.string().when('hasConsistentTraining', {
    is: false,
    then: (schema) => schema.required(t('validation.selectBreakLength')),
    otherwise: (schema) => schema.optional()
  }),
  consistencyIssueTags: Yup.array().of(
    Yup.string().oneOf(['injury','time','life_events','motivation','other'])
  ).optional(),
  consistencyIssuesText: Yup.string().max(250).optional()
}).test('other-tag-required', t('validation.addOtherTag'), function(value) {
  if (value.consistencyIssuesText && !value.consistencyIssueTags?.includes('other')) {
    return false;
  }
  return true;
});

export type Step2FormData = Yup.InferType<ReturnType<typeof createStep2Schema>>;

export const validateStep2 = async (data: unknown, t: (key: string) => string): Promise<Step2FormData> => {
  return await createStep2Schema(t).validate(data, { abortEarly: false });
};
