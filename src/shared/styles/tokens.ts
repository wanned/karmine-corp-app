type ColorString = `#${string}`;

export interface StyleTokens {
  colors: {
    background: ColorString;
    foreground: ColorString;
    accent: ColorString;
    subtleBackground: ColorString;
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
}

export const styleTokens: StyleTokens = {
  colors: {
    background: '#101E35',
    foreground: '#F3F3F3',
    accent: '#00CCFF',
    subtleBackground: '#1A2942',
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
};
