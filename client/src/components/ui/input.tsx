import * as React from "react";
import {
  Platform,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { cn } from "@/lib/utils";

export interface InputProps extends TextInputProps {
  className?: string;
  containerClassName?: string;
  placeholderClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    {
      className,
      containerClassName,
      placeholderClassName,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    if (leftIcon || rightIcon) {
      return (
        <View
          className={cn(
            "h-12 w-full flex-row items-center rounded-2xl border border-border bg-card px-4 shadow-xs",
            props.editable === false && "opacity-50",
            containerClassName
          )}
        >
          {leftIcon && <View className="mr-3">{leftIcon}</View>}
          <TextInput
            ref={ref}
            className={cn(
              "flex-1 text-base text-foreground",
              Platform.select({
                web: "outline-none",
              }),
              className
            )}
            placeholderClassName={cn(
              "text-muted-foreground",
              placeholderClassName
            )}
            placeholderTextColor="#9CA3AF"
            {...props}
          />
          {rightIcon && <View className="ml-3">{rightIcon}</View>}
        </View>
      );
    }

    return (
      <TextInput
        ref={ref}
        className={cn(
          "h-12 w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground shadow-xs",
          Platform.select({
            web: "focus-visible:border-primary focus-visible:ring-primary/20 outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed",
          }),
          props.editable === false && "opacity-50",
          className
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };

