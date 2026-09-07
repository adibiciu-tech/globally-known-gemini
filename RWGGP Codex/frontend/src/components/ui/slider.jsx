import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex touch-none select-none",
      props.orientation === "vertical" 
        ? "flex-col h-full w-4 items-center" 
        : "w-full items-center",
      className
    )}
    {...props}>
    <SliderPrimitive.Track
      className={cn(
        "relative grow overflow-hidden rounded-full bg-slate-200",
        props.orientation === "vertical" ? "w-1.5 h-full" : "h-1.5 w-full"
      )}>
      <SliderPrimitive.Range className={cn(
        "absolute bg-indigo-600",
        props.orientation === "vertical" ? "w-full" : "h-full"
      )} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-4 w-4 rounded-full border border-slate-300 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
