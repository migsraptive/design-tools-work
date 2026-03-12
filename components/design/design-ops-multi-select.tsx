"use client";

import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface DesignOpsMultiSelectProps {
  id?: string;
  label: string;
  description: string;
  placeholder: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  placeholderClassName?: string;
}

export function DesignOpsMultiSelect({
  id,
  label,
  description,
  placeholder,
  options,
  selectedValues,
  onToggle,
  placeholderClassName,
}: DesignOpsMultiSelectProps) {
  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label);

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs leading-5 text-muted-foreground">{description}</p>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className="h-auto min-h-10 w-full justify-between px-3 py-2 text-left"
          >
            <div className="min-w-0 flex-1">
              {selectedLabels.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedLabels.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className={cn("text-sm text-muted-foreground", placeholderClassName)}>
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[360px] max-w-[calc(100vw-2rem)] p-2">
          <div className="space-y-1">
            {options.map((option) => {
              const selected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onToggle(option.value)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                    selected ? "bg-primary/8" : "hover:bg-secondary/40"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background"
                    )}
                  >
                    {selected ? <Check className="size-3" /> : null}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{option.label}</p>
                    {option.description ? (
                      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                        {option.description}
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
