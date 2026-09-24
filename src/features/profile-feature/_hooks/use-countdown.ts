'use client'
import { useEffect, useState } from 'react'

/** Обратный отсчёт с перезапуском на произвольное число секунд (retryAfter от бека) */
export function useCountdown() {
    const [secondsLeft, setSecondsLeft] = useState(0)
    useEffect(() => {
        if (secondsLeft <= 0) return
        const id = setTimeout(() => setSecondsLeft((s) => Math.max(s - 1, 0)), 1000)
        return () => clearTimeout(id)
    }, [secondsLeft])
    return {
        secondsLeft,
        done: secondsLeft <= 0,
        start: (seconds: number) => setSecondsLeft(seconds),
    }
}
