"use server"

import {cookies} from "next/headers";

export default async function readCookieAction(name: string) {
    const cookiesStore = await cookies()
    return cookiesStore.get(name)?.value
}