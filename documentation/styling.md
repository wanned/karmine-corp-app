# Styling

The application is wrapped in a `ThemeContext` that provides the theme to all components. The tokens are defined in `src/shared/theme/tokens.ts`.

## Usage

```tsx
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

const Component = () => {
  const styles = useStyles(getStyles);

  return <div className={styles.container}>...</div>;
}

const getStyles = createStylesheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
}));
```
