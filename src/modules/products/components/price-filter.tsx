"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  minPrice?: string | null
  maxPrice?: string | null
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
}

export const FormatAsCurrency = (value: string) => {
  const numericValue = value.replace(/[^0-9.]/g, "")

  const parts = numericValue.split(".")
  const formattedValue =
    parts[0] + (parts.length > 1 ? `.${parts[1]?.slice(0, 2)}` : "")

  if (!formattedValue) return ""

  const numberValue = parseFloat(formattedValue)
  if (Number.isNaN(numberValue)) return ""

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue)
}

export const PriceFilter = ({
  onMaxPriceChange,
  onMinPriceChange,
  maxPrice,
  minPrice,
}: Props) => {
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get the raw input value and extract the numeric value
    const numericValue = e.target.value.replace(/[^0-9.]/g, "")
    onMinPriceChange(numericValue)
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get the raw input value and extract the numeric value
    const numericValue = e.target.value.replace(/[^0-9.]/g, "")
    onMaxPriceChange(numericValue)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Minimum price</Label>
        <Input
          type="text"
          placeholder="0"
          value={minPrice ? FormatAsCurrency(minPrice) : ""}
          onChange={handleMinPriceChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Maximum price</Label>
        <Input
          type="text"
          placeholder="∞"
          value={maxPrice ? FormatAsCurrency(maxPrice) : ""}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  )
}
