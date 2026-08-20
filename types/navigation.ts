// Navigation Types
export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  'request-details': { requestId: number };
  'submit-waste': undefined;
  'payment': { requestId: number };
};

export type AuthStackParamList = {
  'login': undefined;
  'register': undefined;
  'forgot-password': undefined;
};

export type TabParamList = {
  'home': undefined;
  'requests': undefined;
  'submit': undefined;
  'payments': undefined;
  'profile': undefined;
};
