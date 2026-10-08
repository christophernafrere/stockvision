import type { Config } from "jest";

const config: Config = {
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.tsx?$": [
            "babel-jest",
            {
                presets: ["@babel/preset-typescript"],
            },
        ],
    },
    testMatch: ["<rootDir>/**/*.test.ts", "<rootDir>/**/*.spec.ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    passWithNoTests: true,
};

export default config;
