"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createVisit } from "@/app/actions/log-visit"
import { visitSchema, VisitFormValues, ItemCategory } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react"
import { useTransition } from "react"
import dynamic from "next/dynamic"
import { TagsInput } from "@/components/tags-input"

// Dynamically import MapPicker to avoid SSR issues
const MapPicker = dynamic(() => import("@/components/map-picker"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted rounded-md animate-pulse" />,
})

export default function VisitForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      restaurant: {
        name: "",
        cuisine: "",
        address: "",
        latitude: undefined,
        longitude: undefined,
      },
      visit: {
        date: new Date(),
        rating: 5,
        menuItems: [],
        companions: [],
      },
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "visit.menuItems",
  })

  function onSubmit(data: VisitFormValues) {
    startTransition(async () => {
      const result = await createVisit(data)
      if (result.success) {
        form.reset({
             restaurant: {
                name: "",
                cuisine: "",
                address: "",
                latitude: undefined,
                longitude: undefined,
              },
              visit: {
                date: new Date(),
                rating: 5,
                menuItems: [],
                companions: [],
              },
        })
        alert("Visit logged successfully!")
      } else {
        alert("Failed to log visit")
        console.error(result.error)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground/90">Restaurant Details</h2>
            <FormField
              control={form.control}
              name="restaurant.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. The Burger Joint" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="restaurant.cuisine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuisine</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. American, Italian" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="restaurant.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Food St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                   <MapPicker
                      onLocationSelect={(lat, lng) => {
                          form.setValue("restaurant.latitude", lat)
                          form.setValue("restaurant.longitude", lng)
                      }}
                   />
                </FormControl>
                <FormDescription>Click on the map to set the exact location.</FormDescription>
            </FormItem>
        </div>

        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground/90">Visit Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="visit.date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                      control={form.control}
                      name="visit.rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating (1-5)</FormLabel>
                          <FormControl>
                            <Input
                                type="number"
                                min={1}
                                max={5}
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Menu Items</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ name: "", category: ItemCategory.MAIN, price: 0 })}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <Card key={field.id}>
                        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-5">
                                <FormField
                                    control={form.control}
                                    name={`visit.menuItems.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Item name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-3">
                                <FormField
                                    control={form.control}
                                    name={`visit.menuItems.${index}.category`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.keys(ItemCategory).map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category.charAt(0) + category.slice(1).toLowerCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-3">
                                <FormField
                                    control={form.control}
                                    name={`visit.menuItems.${index}.price`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value === "" ? undefined : parseFloat(e.target.value)
                                                        field.onChange(val)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-1 flex justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    className="text-destructive hover:text-destructive/90"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                        No items added yet. Click "Add Item" to start.
                    </p>
                )}
            </div>

             <FormField
                  control={form.control}
                  name="visit.companions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Companions</FormLabel>
                      <FormControl>
                        <TagsInput
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Type name and press Enter"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
        </div>

        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Log Visit
        </Button>
      </form>
    </Form>
  )
}
