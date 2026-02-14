import { ERROR_MESSAGES } from './error-handlers/error-messages';

/**
 * Configuration state management
 */
export interface ConfigState<TConfig> {
  config: TConfig | null;
  initialized: boolean;
}

/**
 * Configurable service interface
 */
export interface IConfigurableService<TConfig> {
  configure(config: TConfig): void;
  isConfigured(): boolean;
  getConfig(): TConfig | null;
  reset(): void;
}

/**
 * Base class for configurable services
 * Provides configuration management pattern
 */
export class ConfigurableService<TConfig = unknown> implements IConfigurableService<TConfig> {
  protected configState: ConfigState<TConfig>;
  private customValidator?: (config: TConfig) => boolean;

  constructor(validator?: (config: TConfig) => boolean) {
    this.configState = {
      config: null,
      initialized: false,
    };
    this.customValidator = validator;
  }

  /**
   * Configure the service
   */
  configure(config: TConfig): void {
    this.configState.config = config;
    this.configState.initialized = this.isValidConfig(config);
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return this.configState.initialized && this.configState.config !== null;
  }

  /**
   * Get current configuration
   */
  getConfig(): TConfig | null {
    return this.configState.config;
  }

  /**
   * Reset configuration
   */
  reset(): void {
    this.configState.config = null;
    this.configState.initialized = false;
  }

  /**
   * Validate configuration - can be overridden by custom validator
   */
  protected isValidConfig(config: TConfig): boolean {
    if (this.customValidator) {
      return this.customValidator(config);
    }
    return true;
  }

  protected requireConfig(): TConfig {
    if (!this.configState.config) {
      throw new Error(ERROR_MESSAGES.SERVICE.NOT_CONFIGURED);
    }
    return this.configState.config;
  }
}

/**
 * Create a configurable service instance
 */
export function createConfigurableService<TConfig>(
  validator?: (config: TConfig) => boolean
): ConfigurableService<TConfig> {
  return new ConfigurableService<TConfig>(validator);
}
