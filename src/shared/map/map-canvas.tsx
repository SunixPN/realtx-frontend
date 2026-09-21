"use client"
import React, { useEffect, useRef } from "react"
import { useMapContext } from "./map-provider"
type MapCanvasProps = {
    className?: string
    style?: React.CSSProperties
}
export function MapCanvas({ className, style }: MapCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { map, mountMap, unmountMap } = useMapContext()
    useEffect(() => {
        if (!containerRef.current) return
        mountMap(containerRef.current)
        return unmountMap
    }, [mountMap, unmountMap])
    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                ...style,
                backgroundColor: "#DDE4EC",
                opacity: map ? 1 : 0,
                transition: "opacity 200ms ease-out",
            }}
        />
    )
}
