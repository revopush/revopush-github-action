# `revopush-github-action` GitHub Action

Configures the Revopush Command Line Interface in the GitHub Actions environment.

## Prerequisites

-   This action runs using Node 20. If you are using self-hosted GitHub Actions
    runners, you must use a [runner version](https://github.com/actions/virtual-environments) that supports this
    version or newer.

## Usage

```yaml
jobs:
  job_id:
    runs-on: ubuntu-latest
    steps:
      - name: Setup Revopush CLI
        uses: 'revopush/revopush-github-action@v1'
        id: setup-revopush-cli
        with:
          version: 'latest'
          accessKey: ${{ secrets.REVOPUSH_ACCESS_KEY }}
      - name: Release Android bundle
        run: revopush release-react myAmazingAndroidApp android -d Staging
      - name: Release ios bundle
        run: revopush release-react myAmazingIOSApp ios -d Staging
```

## Inputs

-   `version`(Optional, default: `latest`).
    A string representing the version or version constraint of the Revopush CLI
    (`revopush`) to install (e.g. `"0.0.3"` or `">= 0.0.2"`). The default
    value is `"latest"`, which will always download and install the latest
    available CLI version.

        - uses: 'revopush/revopush-github-action@v1'
          with:
            version: '>= 0.0.3'

    If there is no installed `revopush` version that matches the given
    constraint, this GitHub Action will download and install the latest
    available version that still matches the constraint.

    You are responsible for ensuring the `revopush` version matches the features required.

-   `accessKey`(Optional). Revopush access key created in the [app](http://app.revopush.org/). Considered to be a secret.

         - uses: 'revopush/revopush-github-action@v1'
           with:
             accessKey: ${{ secrets.REVOPUSH_ACCESS_KEY }}

    You are responsible for ensuring the accessKey was not neither expired nor deleted.
    
    If no accessKey given you must authenticate CLI before executing any commands require authentication

        - name: Authenticate Revopush CLI
          run: revopush login --accessKey ${{ secrets.REVOPUSH_ACCESS_KEY }}

## Outputs
-   `version`: Version of Revopush CLI that was installed.

## Caching

Under the hood action uses [@actions/tool-cache](https://www.npmjs.com/package/@actions/tool-cache) npm package to 
cache installed tooling (`/opt/hostedtoolcache/revopush`) to speed up further workflow executions. 
It works out the box for self-hosted runners where for GitHub-hosted runners the following config is needed to persist 
changes made by action:

```yaml
      - name: Tools cache
        id: tool-caches
        uses: actions/cache@v4
        with:
          path: /opt/hostedtoolcache/revopush
          key: revopush-${{ runner.os }}-${{ github.run_id }}
          restore-keys: |
            revopush-${{ runner.os }}-
```

## Versioning

We recommend pinning to the latest available major version:

```yaml
- uses: 'revopush/revopush-github-action@v1'
```

While this action attempts to follow semantic versioning, human errors can occur.
To avoid accidental breaking changes, you can pin to a specific version:

```yaml
- uses: 'revopush/revopush-github-action@v1.0.0'
```

However, you will not get automatic security updates or new features without
explicitly updating your version number.

## Questions, Issues and Support

If you have any questions or issues with this action, please [open an issue](https://github.com/revopush/revopush-github-action/issues) 
on this repository or send email to [support@revopush.org](mailto:support@revopush.org).
