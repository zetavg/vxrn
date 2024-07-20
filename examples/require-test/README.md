Run `yarn dev` and then `rm -rf rn.bundle.js && wget 'http://127.0.0.1:8081/index.bundle' -O rn.bundle.js` to get the RN bundle.

Then we can try to run `node rn.bundle.js`.

Rollup will also write it's output to the `z-test-rollup-output` dir.
