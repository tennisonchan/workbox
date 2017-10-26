/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

import {getRuntimeName} from 'workbox-core/_private/cacheNames.mjs';
import cacheWrapper from 'workbox-core/_private/cacheWrapper.mjs';
import * as fetchWrapper from 'workbox-core/_private/fetchWrapper.mjs';

import cacheOkAndOpaquePlugin from './plugins/cacheOkAndOpaquePlugin.mjs';
import './_version.mjs';

/**
 * An implementation of a
 * [stale-while-revalidate]{@link https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate}
 * request strategy.
 *
 * Resources are requested from both the cache and the network in parallel, then
 * responds with the cached version. The cache is updated with the response
 * from the network.
 *
 * By default, this strategy will cache responses with a 200 status code as
 * well as [opaque responses]{@link http://stackoverflow.com/q/39109789}.
 * Opaque responses are are cross-origin requests where the response doesn't
 * support [CORS]{@link https://enable-cors.org/}.
 *
 * @memberof module:workbox-runtime-caching
 */
class StaleWhileRevalidate {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by `workbox-core`.
   * @param {string} options.plugins Workbox plugins you may want to use in
   * conjunction with this caching strategy.
   */
  constructor(options = {}) {
    this._cacheName = getRuntimeName(options.cacheName);
      this._plugins = options.plugins || [];

    if (options.plugins) {
      let isUsingCacheWillUpdate =
        options.plugins.some((plugin) => !!plugin.cacheWillUpdate);
      this._plugins = isUsingCacheWillUpdate ?
        options.plugins : [cacheOkAndOpaquePlugin, ...options.plugins];
    } else {
      // No plugins passed in, use the default plugin.
      this._plugins = [cacheOkAndOpaquePlugin];
    }
  }

  /**
   * The handle method will be called by the
   * {@link module:workbox-routing.Route|Route} class when a route matches a
   * request.
   *
   * @param {Object} input
   * @param {FetchEvent} input.event The fetch event to handle.
   * @param {URL} input.url The URL of the request.
   * @param {Object} input.params Any params returned by `Routes` match
   * callback.
   * @return {Promise<Response>}
   */
  async handle({url, event, params}) {
    if (process.env.NODE_ENV !== 'production') {
      // TODO: Switch to core.assert
      // core.assert.isInstance({event}, FetchEvent);
    }

    const fetchAndCachePromise = fetchWrapper.fetch(
      event.request,
      null,
      this._plugins
    )
    .then(async (response) => {
      await cacheWrapper.put(
        this._cacheName,
        event.request,
        response.clone(),
        this._plugins
      );

      return response;
    });

    const cachedResponse = await cacheWrapper.match(
      this._cacheName,
      event.request,
      null,
      this._plugins
    );

    event.waitUntil(fetchAndCachePromise);

    return cachedResponse || await fetchAndCachePromise;
  }
}

export {StaleWhileRevalidate};
