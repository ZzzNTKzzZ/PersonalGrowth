import { cn } from '@/lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';

const textVariants = cva(
  cn(
    'text-foreground font-normal text-base',
    Platform.select({
      web: 'select-text',
    })
  ),
  {
    variants: {
      variant: {
        default: 'text-base text-foreground font-normal',
        h1: cn(
          'text-3xl font-extrabold tracking-tight text-foreground',
          Platform.select({ web: 'scroll-m-20' })
        ),
        h2: cn(
          'text-2xl font-bold tracking-tight text-foreground',
          Platform.select({ web: 'scroll-m-20' })
        ),
        h3: cn(
          'text-xl font-bold tracking-tight text-foreground',
          Platform.select({ web: 'scroll-m-20' })
        ),
        h4: cn(
          'text-lg font-semibold tracking-tight text-foreground',
          Platform.select({ web: 'scroll-m-20' })
        ),
        p: 'text-base text-foreground font-normal leading-normal',
        lead: 'text-lg text-muted-foreground font-normal leading-relaxed',
        large: 'text-lg font-semibold text-foreground',
        medium: 'text-base font-medium text-foreground',
        small: 'text-sm font-medium text-foreground',
        caption: 'text-xs font-normal text-muted-foreground',
        muted: 'text-sm text-muted-foreground font-normal',
        label: 'text-xs font-bold uppercase tracking-wider text-muted-foreground',
        subtle: 'text-xs font-medium text-muted-foreground/80',
        blockquote: 'border-l-2 border-primary pl-3 italic text-muted-foreground',
        code: 'bg-muted rounded px-1.5 py-0.5 font-mono text-sm font-medium text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext };
