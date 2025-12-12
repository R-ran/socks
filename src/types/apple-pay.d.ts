// Apple Pay JS API Type Definitions

interface ApplePayPaymentRequest {
  countryCode: string;
  currencyCode: string;
  supportedNetworks: string[];
  merchantCapabilities: string[];
  total: {
    label: string;
    amount: string;
  };
  lineItems?: Array<{
    label: string;
    amount: string;
  }>;
}

interface ApplePayPayment {
  token: {
    paymentData: unknown;
    paymentMethod: {
      displayName: string;
      network: string;
      type: string;
    };
    transactionIdentifier: string;
  };
  billingContact?: unknown;
  shippingContact?: unknown;
}

interface ApplePayPaymentAuthorizedEvent {
  payment: ApplePayPayment;
}

interface ApplePayValidateMerchantEvent {
  validationURL: string;
}

declare class ApplePaySession {
  static STATUS_SUCCESS: number;
  static STATUS_FAILURE: number;
  static STATUS_INVALID_BILLING_POSTAL_ADDRESS: number;
  static STATUS_INVALID_SHIPPING_POSTAL_ADDRESS: number;
  static STATUS_INVALID_SHIPPING_CONTACT: number;
  static STATUS_PIN_REQUIRED: number;
  static STATUS_PIN_INCORRECT: number;
  static STATUS_PIN_LOCKOUT: number;

  static canMakePayments(): boolean;
  static canMakePaymentsWithActiveCard(merchantIdentifier: string): boolean;
  static supportsVersion(version: number): boolean;

  constructor(version: number, paymentRequest: ApplePayPaymentRequest);

  begin(): void;
  abort(): void;
  completeMerchantValidation(merchantSession: unknown): void;
  completePayment(status: number): void;
  completeShippingContactSelection(status: number, newShippingMethods: unknown[], newTotal: unknown): void;
  completeShippingMethodSelection(status: number, newTotal: unknown): void;

  onvalidatemerchant: (event: ApplePayValidateMerchantEvent) => void;
  onpaymentauthorized: (event: ApplePayPaymentAuthorizedEvent) => void;
  oncancel: () => void;
  onshippingcontactselected: (event: unknown) => void;
  onshippingmethodselected: (event: unknown) => void;
}

interface Window {
  ApplePaySession?: typeof ApplePaySession;
}

