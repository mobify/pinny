# Contributing

We love pull requests. If you want to contribute a bug fix or feature, please follow the guidelines below. Don't forget to add tests!

If you are unable to resolve the issue with a PR, create an issue in our [issue tracker](https://github.com/mobify/pinny/issues) describing the problem.

## Instructions

#### Fork

[Fork](https://help.github.com/articles/fork-a-repo/), then [clone](https://help.github.com/articles/cloning-a-repository/) the repo:

```
git clone https://github.com/your-username/pinny.git
```

Install any dependencies:

```
cd your-pinny-directory
bower install
npm install
```

#### Contribute

First, ensure the existing tests pass. Make your changes, **add tests for your changes**, then ensure the tests continue to pass in both the terminal and in supported browsers. See [README.md grunt tasks](./README.md#grunt-tasks) for instructions on how to test, and [README.md supported browsers](./README.md#browser-compatibility) for browser list.

#### Build

If the tests have passed, generate the build. Build files are built into the `dist` directory. To build, do the following:

1. Increment the version number in the package.json file according to the [semver](http://semver.org/) specification.

2. Run the following `grunt` task to build the dist:

  ```
  grunt build
  ```

3. Push to your fork, and open a [pull request](https://github.com/mobify/pinny/compare). Please ensure you use the [Pull Request Template](./PULL-REQUEST-TEMPLATE.md) when opening up a pull request; describing your changes increases the likelihood of the PR being merged.

## Coding Guidelines

The following section sets out some guidelines for code being submitted to the project.  These are not hard-and-fast rules but rather guidelines that help to make for a consistent and easy-to-learn codebase.

#### JavaScript

[Mobify JavaScript Code Style Guidelines](https://github.com/mobify/mobify-code-style/tree/master/javascript)

JS can be manually run through our code style linter (eslint) with the command `grunt lint`. Please note that JS will be linted automatically during each build.
