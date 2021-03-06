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

import {_private} from 'workbox-core';
import '../_version.mjs';

const logGroup = (groupTitle, urls) => {
  _private.logger.groupCollapsed(groupTitle);

  urls.forEach((url) => {
    _private.logger.log(url);
  });

  _private.logger.groupEnd();
};

/**
 * @param {Array<Request>} deletedCacheRequests
 * @param {Array<Object>} deletedRevisionDetails
 *
 * @private
 * @memberof module:workbox-precachig
 */
export default (deletedCacheRequests, deletedRevisionDetails) => {
  if (deletedCacheRequests.length === 0 &&
    deletedRevisionDetails.length === 0) {
    return;
  }

  const cacheDeleteCount = deletedCacheRequests.length;
  const revisionDeleteCount = deletedRevisionDetails.length;

  const cacheDeleteText =
    `${cacheDeleteCount} cached ` +
    `request${cacheDeleteCount === 1 ? ' was' : 's were'} deleted`;
  const revisionDeleteText =
    `${revisionDeleteCount} ` +
    `${revisionDeleteCount === 1 ? 'entry' : 'entries'} ` +
    `${revisionDeleteCount === 1 ? 'was' : 'were'} deleted from IndexedDB.`;

  _private.logger.groupCollapsed(
    `During precaching cleanup, ${cacheDeleteText} and ${revisionDeleteText}`);

  logGroup('Deleted Cache Requests', deletedCacheRequests);
  logGroup('Revision Details Deleted from DB', deletedRevisionDetails);

  _private.logger.groupEnd();
};
