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

    // ResizeObserver реагирует ТОЛЬКО на реальные изменения размеров контейнера
    // (в т.ч. когда меняется --app-height). Один resize на закрытие клавиатуры
    // вместо десятка вызовов на visualViewport.resize → нет дёрганья canvas.
    useEffect(() => {
        if (!map || !containerRef.current) return
        const el = containerRef.current
        const ro = new ResizeObserver(() => map.resize())
        ro.observe(el)
        return () => ro.disconnect()
    }, [map])
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
