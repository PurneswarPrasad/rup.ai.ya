import { Info } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

const InfoIconWithTooltip = ({ text }: { text: ReactNode }) => (
  <Tooltip.Provider delayDuration={100}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <span className="cursor-pointer">
          <Info className="w-4 h-4 text-muted-foreground" />
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content
        className="bg-white/90 text-black px-3 py-2 text-sm rounded-xl shadow-lg max-w-[220px] whitespace-normal break-words backdrop-blur-sm"
        side="top"
        sideOffset={5}
      >
        {text}
        <Tooltip.Arrow className="fill-white/90" />
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export default InfoIconWithTooltip;
