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
 * There are common caching strategies that most service workers will need
 * and use. This module provides simple implementations of these strategies.
 *
 * @module workbox-runtime-caching
 */

import CacheFirst from './CacheFirst.mjs';
import CacheOnly from './CacheOnly.mjs';
import NetworkFirst from './NetworkFirst.mjs';
import NetworkOnly from './NetworkOnly.mjs';
import StaleWhileRevalidate from './StaleWhileRevalidate.mjs';
import './_version.mjs';

export {
  CacheFirst,
  CacheOnly,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
};
