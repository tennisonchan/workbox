/*
  Copyright 2017 Google Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/**
 * Use the `compiler.inputFileSystem._readFile` method instead of `fs.readFile`,
 * `readFile` is configured to use `compiler.inputFileSystem._readFile` during
 * the run phase of the webpack compilation lifecycle by passing the function
 * to the `setReadFile` function.
 */
let readFileFn;

const setReadFile = (fn) => {
  readFileFn = fn;
};

const readFile = (filePath) => new Promise(
  (resolve, reject) => readFileFn(filePath, 'utf8', (err, data) => {
    if (err) reject(err);
    resolve(data);
  })
);

module.exports = {
  setReadFile,
  readFile,
};
