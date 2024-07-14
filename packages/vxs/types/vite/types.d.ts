import type { Hono } from 'hono';
import type { AfterBuildProps as VXRNAfterBuildProps, VXRNUserConfig } from 'vxrn';
export declare namespace VXS {
    type Options = Omit<VXRNUserConfig, keyof PluginOptions> & PluginOptions;
    type RouteMode = 'ssg' | 'spa';
    type RouteOptions = {
        routeModes?: Record<string, VXS.RouteMode>;
    };
    type PluginOptions = {
        redirects?: Redirects;
        shouldIgnore?: (req: Request) => boolean;
        disableSSR?: boolean;
        afterBuild?: (props: AfterBuildProps) => void | Promise<void>;
        afterServerStart?: ((options: Options, server: Hono) => void | Promise<void>) | ((options: Options, server: Hono, buildInfo: AfterServerStartBuildInfo) => void | Promise<void>);
    };
    type Redirect = {
        source: string;
        destination: string;
        permanent: boolean;
    };
    type Redirects = Redirect[];
    type AfterServerStartBuildInfo = Pick<AfterBuildProps, 'routeMap' | 'builtRoutes'>;
    type AfterBuildProps = VXRNAfterBuildProps & {
        routeMap: Record<string, string>;
        builtRoutes: RouteBuildInfo[];
    };
    type RouteBuildInfo = {
        path: string;
        htmlPath: string;
        clientJsPath: string;
        params: Object;
        loaderData: any;
        preloads: string[];
    };
}
//# sourceMappingURL=types.d.ts.map