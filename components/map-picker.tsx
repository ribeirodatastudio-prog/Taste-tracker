"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for Leaflet default marker icons in Next.js/Webpack
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

const defaultIcon = L.icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
}

function LocationMarker({
  onSelect,
  position,
}: {
  onSelect: (lat: number, lng: number) => void
  position: [number, number] | null
}) {
  const map = useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position ? <Marker position={position} /> : null
}

export default function MapPicker({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  const handleSelect = (lat: number, lng: number) => {
    setPosition([lat, lng])
    onLocationSelect(lat, lng)
  }

  // Default to London if no position
  const defaultCenter: [number, number] = [51.505, -0.09]

  if (!isMounted) {
    return <div className="h-[300px] w-full bg-muted rounded-md animate-pulse" />
  }

  return (
    <div className="h-[300px] w-full rounded-md overflow-hidden border z-0 relative">
      <MapContainer
        center={position || defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={handleSelect} position={position} />
      </MapContainer>
    </div>
  )
}
