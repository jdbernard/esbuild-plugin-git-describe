import type { Plugin } from 'esbuild';
import { gitDescribe } from 'git-describe';

export interface PluginOptions {
  /**
   * From [git-describe](https://github.com/tvdstaaij/node-git-describe), the
   * dirty mark to use if repo state is dirty (see git describe's --dirty).
   * Defaults to `'-dirty'`.
   */
  dirtyMark?: string;

  /**
   * From [git-describe](https://github.com/tvdstaaij/node-git-describe),
   * appends the dirty mark to semverString if repo state is dirty. Defaults to
   * `true`.
   */
  dirtySemver?: boolean;

  /**
   * From [git-describe](https://github.com/tvdstaaij/node-git-describe),
   * always adds commit distance and hash to raw, suffix and .toString()
   * (matches the behaviour of git describe's --long). Defaults to `true`.
   */
  long?: boolean;

  /**
   * From [git-describe](https://github.com/tvdstaaij/node-git-describe),
   * always adds commit distance and hash to semverString (similar to git
   * describe's --long, but for semver). Defaults to `false`.
   */
  longSemver?: boolean;

  /**
   * From [git-describe](https://github.com/tvdstaaij/node-git-describe),
   * uses --tags if false, so that simple git tags are allowed. Defaults to
   * `false`.
   */
  requireAnnotated?: boolean;

  /**
   * From [git-describe](https://github.com/tvdstaaij/node-git-describe),
   * uses --match to filter tag names. By default only tags resembling a
   * version number are considered. Defaults to `'v[0-9]*'`.
   */
  match?: string;

  /**
   * From [git-describe](https://github.com/tvdstaaij/node-git-describe),
   * array of additional arguments to pass to git describe. Not all arguments
   * are useful and some may even break the library, but things like --abbrev
   * and --candidates should be safe to add.  Defaults to `[]`.
   */
  customArguments: Array<string>;

  /**
   * Namespace to use as the source of the git-describe variables exposed to
   * the application. Defaults to `git-describe`.
   */
  namespace?: string;
}

export const esbuildPluginGitDescribe = (
  options: PluginOptions = {
    dirtyMark: '-dirty',
    dirtySemver: true,
    long: true,
    longSemver: false,
    requireAnnotated: false,
    match: 'v[0-9]*',
    customArguments: [],
    namespace: 'git-describe',
  }
): Plugin => {
  return {
    name: 'esbuild-plugin-git-describe',
    setup(build) {
      build.onResolve(
        {
          filter: new RegExp(`^${options.namespace || 'git-describe'}$`),
        },
        (args) => ({
          path: args.path,
          namespace: 'git-describe-ns',
        })
      );

      build.onLoad(
        { filter: /.*/, namespace: 'git-describe-ns' },
        async () => ({
          contents: JSON.stringify(await gitDescribe(options)),
          loader: 'json',
        })
      );
    },
  };
};
