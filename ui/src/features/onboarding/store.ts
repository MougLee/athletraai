import { Step1FormData, Step2FormData } from './validation';

export interface OnboardingData {
  step1?: Step1FormData;
  step2?: Step2FormData;
  // Future steps will be added here
  // step3?: Step3FormData;
  // etc.
}

const ONBOARDING_STORAGE_KEY = 'onboarding';

export class OnboardingStore {
  private static getStorageKey(userId: string): string {
    return `${ONBOARDING_STORAGE_KEY}/v1/${userId}`;
  }

  static save(userId: string, data: Partial<OnboardingData>): void {
    try {
      const existing = this.load(userId);
      const merged = { ...existing, ...data };
      
      // Convert Date objects to ISO strings for localStorage
      const serializedData = JSON.stringify(merged, (_, value) => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      
      localStorage.setItem(this.getStorageKey(userId), serializedData);
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    }
  }

  static load(userId: string): OnboardingData {
    try {
      const stored = localStorage.getItem(this.getStorageKey(userId));
      if (!stored) return {};
      
      // Parse JSON and convert ISO date strings back to Date objects
      return JSON.parse(stored, (_, value) => {
        // Check if this looks like a date string (ISO format)
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
          return new Date(value);
        }
        return value;
      });
    } catch (error) {
      console.error('Failed to load onboarding data:', error);
      return {};
    }
  }

  static saveStep1(userId: string, step1Data: Step1FormData): void {
    this.save(userId, { step1: step1Data });
  }

  static getStep1(userId: string): Step1FormData | undefined {
    return this.load(userId).step1;
  }

  static saveStep2(userId: string, step2Data: Step2FormData): void {
    this.save(userId, { step2: step2Data });
  }

  static getStep2(userId: string): Step2FormData | undefined {
    return this.load(userId).step2;
  }

  static clear(userId: string): void {
    try {
      localStorage.removeItem(this.getStorageKey(userId));
    } catch (error) {
      console.error('Failed to clear onboarding data:', error);
    }
  }

  static hasData(userId: string): boolean {
    try {
      return localStorage.getItem(this.getStorageKey(userId)) !== null;
    } catch (error) {
      return false;
    }
  }
}
