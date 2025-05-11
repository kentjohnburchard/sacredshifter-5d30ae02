
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary/80 text-primary-foreground hover:bg-primary/90 backdrop-blur-md shadow-md shadow-primary/20 border border-white/10",
        destructive:
          "bg-destructive/80 text-destructive-foreground hover:bg-destructive/90 backdrop-blur-md shadow-md shadow-destructive/20 border border-white/10",
        outline:
          "border-2 border-input/60 bg-background/40 hover:bg-accent/40 hover:text-accent-foreground text-enhanced backdrop-blur-md shadow-sm",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary/90 backdrop-blur-md shadow-md shadow-secondary/20 border border-white/10",
        ghost: "hover:bg-accent/40 hover:text-accent-foreground text-enhanced",
        link: "text-primary underline-offset-4 hover:underline font-semibold text-enhanced",
        gradient: "bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white hover:from-purple-700/90 hover:to-indigo-700/90 shadow-lg shadow-purple-700/20 border border-white/10 backdrop-blur-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }), 
          "shadow-lg"
        )}
        ref={ref}
        style={{
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
        }}
        {...props}
      >
        {props.children}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 transform -translate-x-full hover:translate-x-full"></span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
