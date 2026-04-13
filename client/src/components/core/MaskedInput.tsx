import * as React from "react"
import { IMaskInput } from "react-imask"
import { cn } from "@/lib/utils"

interface MaskedInputProps extends React.ComponentProps<"input"> {
  mask: string | any[] | RegExp | Function;
  onAccept?: (value: string, mask: any) => void;
  unmask?: boolean | 'typed';
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, onAccept, unmask = true, ...props }, ref) => {
    return (
      <IMaskInput
        mask={mask}
        unmask={unmask}
        onAccept={onAccept}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        inputRef={(el: HTMLInputElement) => {
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        {...props}
      />
    )
  }
)
MaskedInput.displayName = "MaskedInput"

export { MaskedInput }
