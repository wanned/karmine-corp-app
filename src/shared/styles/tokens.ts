type ColorString = `#${string}`;

export interface StyleTokens {
  colors: {
    background: ColorString;
    foreground: ColorString;
    accent: ColorString;
    subtleBackground: ColorString;
    subtleForeground: ColorString;
    subtleForeground2: ColorString;
    streaming: ColorString;
  };
  opacities: {
    priority1: number;
    priority2: number;
  };
  margins: {
    screenHorizontal: number;
    screenVertical: number;
  };
  spacing: {
    xsmall: number;
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  fonts: {
    default: string;
    number: string;
  };
  roundness: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
}

export const styleTokens: StyleTokens = {
  colors: {
    background: '#101E35',
    foreground: '#F3F3F3',
    accent: '#00CCFF',
    subtleBackground: '#1A2942',
    subtleForeground: '#6E7582',
    subtleForeground2: '#3E5670',
    streaming: '#EE5858',
  },
  opacities: {
    priority1: 1,
    priority2: 0.5,
  },
  margins: {
    screenHorizontal: 16,
    screenVertical: 16,
  },
  spacing: {
    xsmall: 2,
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
  },
  fonts: {
    default: 'Cairo',
    number: 'MonaspaceNeon',
  },
  roundness: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
  },
};
