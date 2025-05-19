// noinspection JSFileReferences

import * as runtimeModule from "./_framework/dotnet.runtime.js";
import * as nativeModule from "./_framework/dotnet.native.js";
import { dotnet } from "./_framework/dotnet.js";

export async function boot() {
    /** @type {import("dotnet").MonoConfig & { assets: import("dotnet").AssetEntry[] }} */
    const config = {
        mainAssemblyName: "JSInteropTest.dll",
        assets: [
            {
                name: "dotnet.runtime.js",
                moduleExports: runtimeModule,
                behavior: "js-module-runtime"
            },
            {
                name: "dotnet.native.js",
                moduleExports: nativeModule,
                behavior: "js-module-native"
            },
            {
                name: "dotnet.native.wasm",
                behavior: "dotnetwasm",
                buffer: await fetchBin("dotnet.native.wasm")
            },
            {
                name: "System.Private.CoreLib.wasm",
                behavior: "assembly",
                buffer: await fetchBin("System.Private.CoreLib.wasm")
            },
            {
                name: "System.Runtime.InteropServices.JavaScript.wasm",
                behavior: "assembly",
                buffer: await fetchBin("System.Runtime.InteropServices.JavaScript.wasm"),
            },
            {
                name: "System.Console.wasm",
                behavior: "assembly",
                buffer: await fetchBin("System.Console.wasm"),
            },
            {
                name: "System.Linq.wasm",
                behavior: "assembly",
                buffer: await fetchBin("System.Linq.wasm"),
            },
            {
                name: "System.Text.Json.wasm",
                buffer: await fetchBin("System.Text.Json.wasm"),
                behavior: "assembly",
            },
            {
                name: "System.Text.Encodings.Web.wasm",
                buffer: await fetchBin("System.Text.Encodings.Web.wasm"),
                behavior: "assembly",
            },
            {
                name: "System.Collections.wasm",
                buffer: await fetchBin("System.Collections.wasm"),
                behavior: "assembly",
            },
            {
                name: "System.Collections.Concurrent.wasm",
                buffer: await fetchBin("System.Collections.Concurrent.wasm"),
                behavior: "assembly",
            },
            {
                name: "System.IO.Pipelines.wasm",
                buffer: await fetchBin("System.IO.Pipelines.wasm"),
                behavior: "assembly",
            },
            {
                name: "System.Memory.wasm",
                buffer: await fetchBin("System.Memory.wasm"),
                behavior: "assembly",
            },
            {
                name: "OtherAssembly.wasm",
                buffer: await fetchBin("OtherAssembly.wasm"),
                behavior: "assembly",
            },
            {
                name: "JSInteropTest.wasm",
                buffer: await fetchBin("JSInteropTest.wasm"),
                behavior: "assembly",
            }
        ]
    };

    // /** @type {import("dotnet").MonoConfig} */
    // const config = {
    //     mainAssemblyName: "JSInteropTest.dll",
    //     resources: {
    //         jsModuleRuntime: { "dotnet.runtime.js": "" },
    //         jsModuleNative: { "dotnet.native.js": "" },
    //         // jsModuleWorker: { "dotnet.native.worker.js": "" },
    //         wasmNative: { "dotnet.native.wasm": "" },
    //         coreAssembly: {
    //             "System.Private.CoreLib.wasm": "",
    //             "System.Runtime.InteropServices.JavaScript.wasm": ""
    //         },
    //         assembly: {
    //             "System.Console.wasm": "",
    //             "System.Linq.wasm": "",
    //             "System.Text.Json.wasm": "",
    //             "System.Text.Encodings.Web.wasm": "",
    //             // "System.Threading.Channels.wasm": "",
    //             "System.Collections.wasm": "",
    //             "System.Collections.Concurrent.wasm": "",
    //             "System.IO.Pipelines.wasm": "",
    //             "System.Memory.wasm": "",
    //             "OtherAssembly.wasm": "",
    //             "JSInteropTest.wasm": "",
    //         }
    //     },
    //     debugLevel: 0
    // };

    const runtime = await dotnet
        .withConfig(config)
        .withResourceLoader((type, name, defaultUri, integrity, behavior) => {
            // console.log(`withResourceLoader(type: ${type} name: ${name} defaultUri: ${defaultUri} behaviour: ${behavior})`);
            return "/_framework/" + name;
        })
        .create();
    console.log("Runtime created.");

    await runtime.runMain("JSInteropTest.dll", []);
    console.log("Runtime run.");

    return runtime;
}

async function fetchBin(name) {
    if (typeof window === "object") return new Uint8Array(await (await fetch(`./_framework/${name}`)).arrayBuffer());
    return new Uint8Array((await (await import("node:fs/promises")).readFile(`./_framework/${name}`)));
}

