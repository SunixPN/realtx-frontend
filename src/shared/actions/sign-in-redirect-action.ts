"use server"

import {redirect} from "next/navigation";
import {ROUTES} from "@/shared/const/routes";
import {PROTECTED_ROUTES} from "@/shared/const/routes-guard";

export default async function signInRedirectAction(pathName: string) {
    if (PROTECTED_ROUTES.includes(pathName)) {
        redirect(ROUTES.SIGN_IN)
    }
}