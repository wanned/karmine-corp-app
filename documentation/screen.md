# Screen

## Create a screen

To create a screen you need to add a key to the `RootStackParamList` type in `src/shared/navigation/index.tsx`:

```ts
export type RootStackParamList = {
  // ...
  ScreenName: undefined;
};
```

Then you need to add a screen to the `Stack.Navigator` in `src/shared/navigation/index.tsx`:

```tsx
<Stack.Navigator>
  // ...
  <Stack.Screen name="ScreenName" component={ScreenName} />
</Stack.Navigator>
```

The screen component should be wrapped in a `DefaultLayout` component:

```tsx
import { DefaultLayout } from 'src/shared/components';

export const ScreenName = () => {
  return (
    <DefaultLayout>
      <Text>ScreenName</Text>
    </DefaultLayout>
  );
};
```
