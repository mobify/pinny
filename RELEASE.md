# Releasing a New Version

This document describes how to release a new version of Pinny. This occurs only after your PR has been reviewed and +1'd.

1. **Make sure the tests are green**

  Before the release, the tests need to pass in the terminal and in supported browsers. See README for instructions on how to run these tests.

2. **Update version**

  The new version should be determined by the changes since the last release, using [Semantic Versioning](www.semver.org). Update this version in both bower.json and package.json files.

  Commit the change in a commit with message "Update version to <version>", where <version> is the new version. 

3. **Update CHANGELOG**

  Go through all commits since the last release and describe large internal changes or anything that will affect users. Formatting of the new CHANGELOG entry should follow the style used in previous entries.

  Commit the change in a commit with message "Update CHANGELOG".

4. **Merge into master**

  Click the big green "Merge pull request" button on GitHub. Delete the PR branch when merging is done.

5. **Publish a new GitHub release**

  Click the "Draft a new release" button on https://github.com/mobify/pinny/releases. Ensure you are tagging based on master branch, and add the version number you updated in Step #2 as the "tag version". Summarize the changes being released, and paste the contents of the CHANGELOG update you added in Step #4. Click "Publish release".
