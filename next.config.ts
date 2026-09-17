import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/shared/i18n/request.ts");

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "mapbox-gl": 'mapbox-gl/dist/mapbox-gl.js'
        }
        return config;
    },
    turbopack: {}
};

export default withNextIntl(nextConfig);
