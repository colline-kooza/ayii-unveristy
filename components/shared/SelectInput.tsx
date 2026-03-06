"use client"
import * as React from "react"
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import type { SelectOption } from "@/types/admin"

interface SelectInputProps {
  label: string
  options: SelectOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  loading?: boolean
  showDescription?: boolean
  className?: string
  disabled?: boolean
}

export function SelectInput({
  label,
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  loading = false,
  showDescription = false,
  className,
  disabled = false,
}: SelectInputProps) {
  const [open, setOpen] = React.useState(false)
  
  // Deduplicate options based on value to prevent duplicates
  const uniqueOptions = React.useMemo(() => {
    const seen = new Map<string, SelectOption>()
    options.forEach((option) => {
      if (!seen.has(option.value)) {
        seen.set(option.value, option)
      }
    })
    return Array.from(seen.values())
  }, [options])
  
  const selectedOption = uniqueOptions.find((option) => option.value === value)

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal bg-transparent"
            disabled={disabled || loading}
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </span>
            ) : selectedOption ? (
              selectedOption.label
            ) : (
              placeholder
            )}
            {!loading && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput placeholder={searchPlaceholder} className="h-9 flex-1" />
            </div>
            <CommandList>
              {loading ? (
                <CommandEmpty>
                  <div className="flex flex-col items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="mt-2 text-sm text-muted-foreground">Loading options...</span>
                  </div>
                </CommandEmpty>
              ) : (
                <>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {uniqueOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => {
                          onValueChange(option.value)
                          setOpen(false)
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          {showDescription && option.description && (
                            <span className="text-xs text-muted-foreground">{option.description}</span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
