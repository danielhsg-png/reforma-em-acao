import * as React from "react"
import { IMaskInput } from "react-imask"
import { cn } from "@/lib/utils"

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value" | "max" | "min"> {
  value?: string | number;
  onChange?: (value: any) => void;
  onValueChange?: (value: string) => void;
  prefix?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, onValueChange, prefix = "R$ ", ...props }, ref) => {
    const handleAccept = (v: string) => {
      onValueChange?.(v);
      onChange?.(v);
    };

    return (
      <IMaskInput
        value={String(value ?? "")}
        mask={Number as any}
        scale={2}
        thousandsSeparator="."
        padFractionalZeros={true}
        normalizeZeros={true}
        radix=","
        mapToRadix={["."]}
        unmask={true}
        onAccept={handleAccept as any}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        inputRef={(el: HTMLInputElement) => {
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        placeholder={`${prefix}0,00`}
        {...props}
      />
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export default CurrencyInput
