# Pinny Release Checklist

Take this checklist and paste it into your release PR. Ensure steps are followed in order.

- [ ] Tests pass in the terminal and in supported browsers.
  - See [README](./README.md#browser-compatibility) for list of supported browsers.
  - See [README](./README.md#grunt-tasks) for instructions on how to run these tests.
- [ ] Branch off `develop` and create a `release-X.X.X` branch.
- [ ] Increment the version in package.json and bower.json.
  - This is determined by the changes since the last release, using [Semantic Versioning](www.semver.org).
- [ ] Update CHANGELOG.
  - Describe large internal changes or anything that will affect users.
- [ ] Merge this release branch into `master` and tag it. Delete release branch.
- [ ] Merge `master` into `develop`.
- [ ] Publish a new GitHub [release](https://github.com/mobify/pinny/releases).
