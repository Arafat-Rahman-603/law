import { GoogleGenAI } from '@google/genai';

export interface ProviderConfig {
  id: string;
  apiKey: string;
  model: string;
  priority: number;
  enabled: boolean;
}

export class GeminiProviderPool {
  private providers: ProviderConfig[] = [];
  private failCounts: Record<string, number> = {};
  private MAX_FAILURES = 3;

  constructor() {
    this.initializeFromEnv();
  }

  private initializeFromEnv() {
    // Read GEMINI_PROVIDER_X_KEY from env
    for (let i = 1; i <= 4; i++) {
      const key = process.env[`GEMINI_PROVIDER_${i}_KEY`];
      if (key) {
        this.providers.push({
          id: `provider-${i}`,
          apiKey: key,
          model: process.env[`GEMINI_PROVIDER_${i}_MODEL`] || 'gemini-2.5-flash',
          priority: i,
          enabled: true,
        });
      }
    }
    
    // Sort by priority
    this.providers.sort((a, b) => a.priority - b.priority);
  }

  public getAvailableProvider(): ProviderConfig | null {
    for (const provider of this.providers) {
      if (!provider.enabled) continue;
      const fails = this.failCounts[provider.id] || 0;
      if (fails < this.MAX_FAILURES) {
        return provider;
      }
    }
    
    // If all failed, reset counts and try the highest priority one again (Circuit Breaker half-open)
    if (this.providers.length > 0) {
      console.warn('All Gemini providers exhausted or failed. Resetting fail counts.');
      this.failCounts = {};
      return this.providers[0];
    }
    
    return null;
  }

  public reportFailure(providerId: string) {
    this.failCounts[providerId] = (this.failCounts[providerId] || 0) + 1;
    console.error(`Gemini provider ${providerId} failed. Fail count: ${this.failCounts[providerId]}`);
  }

  public reportSuccess(providerId: string) {
    if (this.failCounts[providerId] > 0) {
      this.failCounts[providerId] = 0; // Reset on success
    }
  }

  public async executeWithFallback<T>(operation: (ai: GoogleGenAI, model: string) => Promise<T>): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lastError: any = null;
    
    for (let attempt = 0; attempt < this.providers.length; attempt++) {
      const provider = this.getAvailableProvider();
      if (!provider) {
        throw new Error('No available Gemini providers.');
      }

      try {
        const ai = new GoogleGenAI({ apiKey: provider.apiKey });
        const result = await operation(ai, provider.model);
        this.reportSuccess(provider.id);
        return result;
      } catch (error) {
        lastError = error;
        this.reportFailure(provider.id);
        // Exponential backoff or simple delay could be added here
      }
    }

    throw new Error(`All Gemini providers failed. Last error: ${lastError?.message}`);
  }
}

// Singleton instance
export const aiProviderPool = new GeminiProviderPool();
