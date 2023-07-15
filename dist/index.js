"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esbuildPluginGitDescribe = void 0;
const git_describe_1 = require("git-describe");
const esbuildPluginGitDescribe = (options = {
    dirtyMark: '-dirty',
    dirtySemver: true,
    long: true,
    longSemver: false,
    requireAnnotated: false,
    match: 'v[0-9]*',
    customArguments: [],
    namespace: 'git-describe',
}) => {
    return {
        name: 'esbuild-plugin-git-describe',
        setup(build) {
            build.onResolve({
                filter: new RegExp(`^${options.namespace || 'git-describe'}$`),
            }, (args) => ({
                path: args.path,
                namespace: 'git-describe-ns',
            }));
            build.onLoad({ filter: /.*/, namespace: 'git-describe-ns' }, async () => ({
                contents: JSON.stringify(await (0, git_describe_1.gitDescribe)(options)),
                loader: 'json',
            }));
        },
    };
};
exports.esbuildPluginGitDescribe = esbuildPluginGitDescribe;
