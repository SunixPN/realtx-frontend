import NProgress from "nprogress";

export function beginTopLoader() {
    NProgress.start();
}

export function doneTopLoader() {
    NProgress.done();
}