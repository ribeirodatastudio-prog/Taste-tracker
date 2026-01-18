"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createVisit } from "@/app/actions/log-visit"
import { visitSchema, VisitFormValues } from "@/lib/schemas"
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
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
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
        starters: "",
        mainCourse: "",
        desserts: "",
        drinks: "",
        companions: [],
      },
    },
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
                starters: "",
                mainCourse: "",
                desserts: "",
                drinks: "",
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
                            "w-[240px] pl-3 text-left font-normal",
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

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="visit.starters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starters</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What did you start with?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="visit.mainCourse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Course</FormLabel>
                      <FormControl>
                        <Textarea placeholder="The main event..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="visit.desserts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desserts</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Sweet treats..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="visit.drinks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drinks</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Beverages..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
