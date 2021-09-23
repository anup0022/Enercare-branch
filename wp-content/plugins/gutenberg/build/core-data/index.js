/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3909:
/***/ (function(module) {



function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 * Given an instance of EquivalentKeyMap, returns its internal value pair tuple
 * for a key, if one exists. The tuple members consist of the last reference
 * value for the key (used in efficient subsequent lookups) and the value
 * assigned for the key at the leaf node.
 *
 * @param {EquivalentKeyMap} instance EquivalentKeyMap instance.
 * @param {*} key                     The key for which to return value pair.
 *
 * @return {?Array} Value pair, if exists.
 */
function getValuePair(instance, key) {
  var _map = instance._map,
      _arrayTreeMap = instance._arrayTreeMap,
      _objectTreeMap = instance._objectTreeMap; // Map keeps a reference to the last object-like key used to set the
  // value, which can be used to shortcut immediately to the value.

  if (_map.has(key)) {
    return _map.get(key);
  } // Sort keys to ensure stable retrieval from tree.


  var properties = Object.keys(key).sort(); // Tree by type to avoid conflicts on numeric object keys, empty value.

  var map = Array.isArray(key) ? _arrayTreeMap : _objectTreeMap;

  for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    map = map.get(property);

    if (map === undefined) {
      return;
    }

    var propertyValue = key[property];
    map = map.get(propertyValue);

    if (map === undefined) {
      return;
    }
  }

  var valuePair = map.get('_ekm_value');

  if (!valuePair) {
    return;
  } // If reached, it implies that an object-like key was set with another
  // reference, so delete the reference and replace with the current.


  _map.delete(valuePair[0]);

  valuePair[0] = key;
  map.set('_ekm_value', valuePair);

  _map.set(key, valuePair);

  return valuePair;
}
/**
 * Variant of a Map object which enables lookup by equivalent (deeply equal)
 * object and array keys.
 */


var EquivalentKeyMap =
/*#__PURE__*/
function () {
  /**
   * Constructs a new instance of EquivalentKeyMap.
   *
   * @param {Iterable.<*>} iterable Initial pair of key, value for map.
   */
  function EquivalentKeyMap(iterable) {
    _classCallCheck(this, EquivalentKeyMap);

    this.clear();

    if (iterable instanceof EquivalentKeyMap) {
      // Map#forEach is only means of iterating with support for IE11.
      var iterablePairs = [];
      iterable.forEach(function (value, key) {
        iterablePairs.push([key, value]);
      });
      iterable = iterablePairs;
    }

    if (iterable != null) {
      for (var i = 0; i < iterable.length; i++) {
        this.set(iterable[i][0], iterable[i][1]);
      }
    }
  }
  /**
   * Accessor property returning the number of elements.
   *
   * @return {number} Number of elements.
   */


  _createClass(EquivalentKeyMap, [{
    key: "set",

    /**
     * Add or update an element with a specified key and value.
     *
     * @param {*} key   The key of the element to add.
     * @param {*} value The value of the element to add.
     *
     * @return {EquivalentKeyMap} Map instance.
     */
    value: function set(key, value) {
      // Shortcut non-object-like to set on internal Map.
      if (key === null || _typeof(key) !== 'object') {
        this._map.set(key, value);

        return this;
      } // Sort keys to ensure stable assignment into tree.


      var properties = Object.keys(key).sort();
      var valuePair = [key, value]; // Tree by type to avoid conflicts on numeric object keys, empty value.

      var map = Array.isArray(key) ? this._arrayTreeMap : this._objectTreeMap;

      for (var i = 0; i < properties.length; i++) {
        var property = properties[i];

        if (!map.has(property)) {
          map.set(property, new EquivalentKeyMap());
        }

        map = map.get(property);
        var propertyValue = key[property];

        if (!map.has(propertyValue)) {
          map.set(propertyValue, new EquivalentKeyMap());
        }

        map = map.get(propertyValue);
      } // If an _ekm_value exists, there was already an equivalent key. Before
      // overriding, ensure that the old key reference is removed from map to
      // avoid memory leak of accumulating equivalent keys. This is, in a
      // sense, a poor man's WeakMap, while still enabling iterability.


      var previousValuePair = map.get('_ekm_value');

      if (previousValuePair) {
        this._map.delete(previousValuePair[0]);
      }

      map.set('_ekm_value', valuePair);

      this._map.set(key, valuePair);

      return this;
    }
    /**
     * Returns a specified element.
     *
     * @param {*} key The key of the element to return.
     *
     * @return {?*} The element associated with the specified key or undefined
     *              if the key can't be found.
     */

  }, {
    key: "get",
    value: function get(key) {
      // Shortcut non-object-like to get from internal Map.
      if (key === null || _typeof(key) !== 'object') {
        return this._map.get(key);
      }

      var valuePair = getValuePair(this, key);

      if (valuePair) {
        return valuePair[1];
      }
    }
    /**
     * Returns a boolean indicating whether an element with the specified key
     * exists or not.
     *
     * @param {*} key The key of the element to test for presence.
     *
     * @return {boolean} Whether an element with the specified key exists.
     */

  }, {
    key: "has",
    value: function has(key) {
      if (key === null || _typeof(key) !== 'object') {
        return this._map.has(key);
      } // Test on the _presence_ of the pair, not its value, as even undefined
      // can be a valid member value for a key.


      return getValuePair(this, key) !== undefined;
    }
    /**
     * Removes the specified element.
     *
     * @param {*} key The key of the element to remove.
     *
     * @return {boolean} Returns true if an element existed and has been
     *                   removed, or false if the element does not exist.
     */

  }, {
    key: "delete",
    value: function _delete(key) {
      if (!this.has(key)) {
        return false;
      } // This naive implementation will leave orphaned child trees. A better
      // implementation should traverse and remove orphans.


      this.set(key, undefined);
      return true;
    }
    /**
     * Executes a provided function once per each key/value pair, in insertion
     * order.
     *
     * @param {Function} callback Function to execute for each element.
     * @param {*}        thisArg  Value to use as `this` when executing
     *                            `callback`.
     */

  }, {
    key: "forEach",
    value: function forEach(callback) {
      var _this = this;

      var thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

      this._map.forEach(function (value, key) {
        // Unwrap value from object-like value pair.
        if (key !== null && _typeof(key) === 'object') {
          value = value[1];
        }

        callback.call(thisArg, value, key, _this);
      });
    }
    /**
     * Removes all elements.
     */

  }, {
    key: "clear",
    value: function clear() {
      this._map = new Map();
      this._arrayTreeMap = new Map();
      this._objectTreeMap = new Map();
    }
  }, {
    key: "size",
    get: function get() {
      return this._map.size;
    }
  }]);

  return EquivalentKeyMap;
}();

module.exports = EquivalentKeyMap;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "EntityProvider": function() { return /* reexport */ EntityProvider; },
  "__experimentalFetchLinkSuggestions": function() { return /* reexport */ _experimental_fetch_link_suggestions; },
  "__experimentalFetchUrlData": function() { return /* reexport */ _experimental_fetch_url_data; },
  "store": function() { return /* binding */ store; },
  "useEntityBlockEditor": function() { return /* reexport */ useEntityBlockEditor; },
  "useEntityId": function() { return /* reexport */ useEntityId; },
  "useEntityProp": function() { return /* reexport */ useEntityProp; }
});

// NAMESPACE OBJECT: ./packages/core-data/build-module/locks/actions.js
var locks_actions_namespaceObject = {};
__webpack_require__.r(locks_actions_namespaceObject);
__webpack_require__.d(locks_actions_namespaceObject, {
  "__unstableAcquireStoreLock": function() { return __unstableAcquireStoreLock; },
  "__unstableEnqueueLockRequest": function() { return __unstableEnqueueLockRequest; },
  "__unstableProcessPendingLockRequests": function() { return __unstableProcessPendingLockRequests; },
  "__unstableReleaseStoreLock": function() { return __unstableReleaseStoreLock; }
});

// NAMESPACE OBJECT: ./packages/core-data/build-module/actions.js
var build_module_actions_namespaceObject = {};
__webpack_require__.r(build_module_actions_namespaceObject);
__webpack_require__.d(build_module_actions_namespaceObject, {
  "__experimentalBatch": function() { return __experimentalBatch; },
  "__experimentalSaveSpecifiedEntityEdits": function() { return __experimentalSaveSpecifiedEntityEdits; },
  "__unstableCreateUndoLevel": function() { return __unstableCreateUndoLevel; },
  "addEntities": function() { return addEntities; },
  "deleteEntityRecord": function() { return deleteEntityRecord; },
  "editEntityRecord": function() { return editEntityRecord; },
  "receiveAutosaves": function() { return receiveAutosaves; },
  "receiveCurrentTheme": function() { return receiveCurrentTheme; },
  "receiveCurrentUser": function() { return receiveCurrentUser; },
  "receiveEmbedPreview": function() { return receiveEmbedPreview; },
  "receiveEntityRecords": function() { return receiveEntityRecords; },
  "receiveThemeSupports": function() { return receiveThemeSupports; },
  "receiveUploadPermissions": function() { return receiveUploadPermissions; },
  "receiveUserPermission": function() { return receiveUserPermission; },
  "receiveUserQuery": function() { return receiveUserQuery; },
  "redo": function() { return redo; },
  "saveEditedEntityRecord": function() { return saveEditedEntityRecord; },
  "saveEntityRecord": function() { return saveEntityRecord; },
  "undo": function() { return undo; }
});

// NAMESPACE OBJECT: ./packages/core-data/build-module/selectors.js
var build_module_selectors_namespaceObject = {};
__webpack_require__.r(build_module_selectors_namespaceObject);
__webpack_require__.d(build_module_selectors_namespaceObject, {
  "__experimentalGetDirtyEntityRecords": function() { return __experimentalGetDirtyEntityRecords; },
  "__experimentalGetEntitiesBeingSaved": function() { return __experimentalGetEntitiesBeingSaved; },
  "__experimentalGetEntityRecordNoResolver": function() { return __experimentalGetEntityRecordNoResolver; },
  "__experimentalGetTemplateForLink": function() { return __experimentalGetTemplateForLink; },
  "canUser": function() { return canUser; },
  "canUserEditEntityRecord": function() { return canUserEditEntityRecord; },
  "getAuthors": function() { return getAuthors; },
  "getAutosave": function() { return getAutosave; },
  "getAutosaves": function() { return getAutosaves; },
  "getCurrentTheme": function() { return getCurrentTheme; },
  "getCurrentUser": function() { return getCurrentUser; },
  "getEditedEntityRecord": function() { return getEditedEntityRecord; },
  "getEmbedPreview": function() { return getEmbedPreview; },
  "getEntitiesByKind": function() { return getEntitiesByKind; },
  "getEntity": function() { return getEntity; },
  "getEntityRecord": function() { return getEntityRecord; },
  "getEntityRecordEdits": function() { return getEntityRecordEdits; },
  "getEntityRecordNonTransientEdits": function() { return getEntityRecordNonTransientEdits; },
  "getEntityRecords": function() { return getEntityRecords; },
  "getLastEntityDeleteError": function() { return getLastEntityDeleteError; },
  "getLastEntitySaveError": function() { return getLastEntitySaveError; },
  "getRawEntityRecord": function() { return getRawEntityRecord; },
  "getRedoEdit": function() { return getRedoEdit; },
  "getReferenceByDistinctEdits": function() { return getReferenceByDistinctEdits; },
  "getThemeSupports": function() { return getThemeSupports; },
  "getUndoEdit": function() { return getUndoEdit; },
  "getUserQueryResults": function() { return getUserQueryResults; },
  "hasEditsForEntityRecord": function() { return hasEditsForEntityRecord; },
  "hasEntityRecords": function() { return hasEntityRecords; },
  "hasFetchedAutosaves": function() { return hasFetchedAutosaves; },
  "hasRedo": function() { return hasRedo; },
  "hasUndo": function() { return hasUndo; },
  "isAutosavingEntityRecord": function() { return isAutosavingEntityRecord; },
  "isDeletingEntityRecord": function() { return isDeletingEntityRecord; },
  "isPreviewEmbedFallback": function() { return isPreviewEmbedFallback; },
  "isRequestingEmbedPreview": function() { return isRequestingEmbedPreview; },
  "isSavingEntityRecord": function() { return isSavingEntityRecord; }
});

// NAMESPACE OBJECT: ./packages/core-data/build-module/resolvers.js
var resolvers_namespaceObject = {};
__webpack_require__.r(resolvers_namespaceObject);
__webpack_require__.d(resolvers_namespaceObject, {
  "__experimentalGetTemplateForLink": function() { return resolvers_experimentalGetTemplateForLink; },
  "canUser": function() { return resolvers_canUser; },
  "canUserEditEntityRecord": function() { return resolvers_canUserEditEntityRecord; },
  "getAuthors": function() { return resolvers_getAuthors; },
  "getAutosave": function() { return resolvers_getAutosave; },
  "getAutosaves": function() { return resolvers_getAutosaves; },
  "getCurrentTheme": function() { return resolvers_getCurrentTheme; },
  "getCurrentUser": function() { return resolvers_getCurrentUser; },
  "getEditedEntityRecord": function() { return resolvers_getEditedEntityRecord; },
  "getEmbedPreview": function() { return resolvers_getEmbedPreview; },
  "getEntityRecord": function() { return resolvers_getEntityRecord; },
  "getEntityRecords": function() { return resolvers_getEntityRecords; },
  "getRawEntityRecord": function() { return resolvers_getRawEntityRecord; },
  "getThemeSupports": function() { return resolvers_getThemeSupports; }
});

// NAMESPACE OBJECT: ./packages/core-data/build-module/locks/selectors.js
var locks_selectors_namespaceObject = {};
__webpack_require__.r(locks_selectors_namespaceObject);
__webpack_require__.d(locks_selectors_namespaceObject, {
  "__unstableGetPendingLockRequests": function() { return __unstableGetPendingLockRequests; },
  "__unstableIsLockAvailable": function() { return __unstableIsLockAvailable; }
});

;// CONCATENATED MODULE: external ["wp","data"]
var external_wp_data_namespaceObject = window["wp"]["data"];
;// CONCATENATED MODULE: external ["wp","dataControls"]
var external_wp_dataControls_namespaceObject = window["wp"]["dataControls"];
;// CONCATENATED MODULE: external "lodash"
var external_lodash_namespaceObject = window["lodash"];
;// CONCATENATED MODULE: external ["wp","isShallowEqual"]
var external_wp_isShallowEqual_namespaceObject = window["wp"]["isShallowEqual"];
var external_wp_isShallowEqual_default = /*#__PURE__*/__webpack_require__.n(external_wp_isShallowEqual_namespaceObject);
;// CONCATENATED MODULE: ./packages/core-data/build-module/utils/if-matching-action.js
/**
 * A higher-order reducer creator which invokes the original reducer only if
 * the dispatching action matches the given predicate, **OR** if state is
 * initializing (undefined).
 *
 * @param {Function} isMatch Function predicate for allowing reducer call.
 *
 * @return {Function} Higher-order reducer.
 */
const ifMatchingAction = isMatch => reducer => (state, action) => {
  if (state === undefined || isMatch(action)) {
    return reducer(state, action);
  }

  return state;
};

/* harmony default export */ var if_matching_action = (ifMatchingAction);
//# sourceMappingURL=if-matching-action.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/utils/replace-action.js
/**
 * Higher-order reducer creator which substitutes the action object before
 * passing to the original reducer.
 *
 * @param {Function} replacer Function mapping original action to replacement.
 *
 * @return {Function} Higher-order reducer.
 */
const replaceAction = replacer => reducer => (state, action) => {
  return reducer(state, replacer(action));
};

/* harmony default export */ var replace_action = (replaceAction);
//# sourceMappingURL=replace-action.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/utils/conservative-map-item.js
/**
 * External dependencies
 */

/**
 * Given the current and next item entity, returns the minimally "modified"
 * result of the next item, preferring value references from the original item
 * if equal. If all values match, the original item is returned.
 *
 * @param {Object} item     Original item.
 * @param {Object} nextItem Next item.
 *
 * @return {Object} Minimally modified merged item.
 */

function conservativeMapItem(item, nextItem) {
  // Return next item in its entirety if there is no original item.
  if (!item) {
    return nextItem;
  }

  let hasChanges = false;
  const result = {};

  for (const key in nextItem) {
    if ((0,external_lodash_namespaceObject.isEqual)(item[key], nextItem[key])) {
      result[key] = item[key];
    } else {
      hasChanges = true;
      result[key] = nextItem[key];
    }
  }

  if (!hasChanges) {
    return item;
  } // Only at this point, backfill properties from the original item which
  // weren't explicitly set into the result above. This is an optimization
  // to allow `hasChanges` to return early.


  for (const key in item) {
    if (!result.hasOwnProperty(key)) {
      result[key] = item[key];
    }
  }

  return result;
}
//# sourceMappingURL=conservative-map-item.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/utils/on-sub-key.js
/**
 * Higher-order reducer creator which creates a combined reducer object, keyed
 * by a property on the action object.
 *
 * @param {string} actionProperty Action property by which to key object.
 *
 * @return {Function} Higher-order reducer.
 */
const onSubKey = actionProperty => reducer => (state = {}, action) => {
  // Retrieve subkey from action. Do not track if undefined; useful for cases
  // where reducer is scoped by action shape.
  const key = action[actionProperty];

  if (key === undefined) {
    return state;
  } // Avoid updating state if unchanged. Note that this also accounts for a
  // reducer which returns undefined on a key which is not yet tracked.


  const nextKeyState = reducer(state[key], action);

  if (nextKeyState === state[key]) {
    return state;
  }

  return { ...state,
    [key]: nextKeyState
  };
};
/* harmony default export */ var on_sub_key = (onSubKey);
//# sourceMappingURL=on-sub-key.js.map
;// CONCATENATED MODULE: external ["wp","i18n"]
var external_wp_i18n_namespaceObject = window["wp"]["i18n"];
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/rng.js
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
// find the complete implementation of crypto (msCrypto) on IE11.
var getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
  }

  return getRandomValues(rnds8);
}
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/regex.js
/* harmony default export */ var regex = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/validate.js


function validate(uuid) {
  return typeof uuid === 'string' && regex.test(uuid);
}

/* harmony default export */ var esm_browser_validate = (validate);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/stringify.js

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!esm_browser_validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ var esm_browser_stringify = (stringify);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v4.js



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return esm_browser_stringify(rnds);
}

/* harmony default export */ var esm_browser_v4 = (v4);
;// CONCATENATED MODULE: external ["wp","url"]
var external_wp_url_namespaceObject = window["wp"]["url"];
;// CONCATENATED MODULE: ./packages/core-data/build-module/queried-data/actions.js
/**
 * External dependencies
 */

/**
 * Returns an action object used in signalling that items have been received.
 *
 * @param {Array}   items Items received.
 * @param {?Object} edits Optional edits to reset.
 *
 * @return {Object} Action object.
 */

function receiveItems(items, edits) {
  return {
    type: 'RECEIVE_ITEMS',
    items: (0,external_lodash_namespaceObject.castArray)(items),
    persistedEdits: edits
  };
}
/**
 * Returns an action object used in signalling that entity records have been
 * deleted and they need to be removed from entities state.
 *
 * @param {string}       kind            Kind of the removed entities.
 * @param {string}       name            Name of the removed entities.
 * @param {Array|number} records         Record IDs of the removed entities.
 * @param {boolean}      invalidateCache Controls whether we want to invalidate the cache.
 * @return {Object} Action object.
 */

function removeItems(kind, name, records, invalidateCache = false) {
  return {
    type: 'REMOVE_ITEMS',
    itemIds: (0,external_lodash_namespaceObject.castArray)(records),
    kind,
    name,
    invalidateCache
  };
}
/**
 * Returns an action object used in signalling that queried data has been
 * received.
 *
 * @param {Array}   items Queried items received.
 * @param {?Object} query Optional query object.
 * @param {?Object} edits Optional edits to reset.
 *
 * @return {Object} Action object.
 */

function receiveQueriedItems(items, query = {}, edits) {
  return { ...receiveItems(items, edits),
    query
  };
}
//# sourceMappingURL=actions.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/name.js
/**
 * The reducer key used by core data in store registration.
 * This is defined in a separate file to avoid cycle-dependency
 *
 * @type {string}
 */
const STORE_NAME = 'core';
//# sourceMappingURL=name.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/locks/actions.js
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */


function* __unstableAcquireStoreLock(store, path, {
  exclusive
}) {
  const promise = yield* __unstableEnqueueLockRequest(store, path, {
    exclusive
  });
  yield* __unstableProcessPendingLockRequests();
  return yield (0,external_wp_dataControls_namespaceObject.__unstableAwaitPromise)(promise);
}
function* __unstableEnqueueLockRequest(store, path, {
  exclusive
}) {
  let notifyAcquired;
  const promise = new Promise(resolve => {
    notifyAcquired = resolve;
  });
  yield {
    type: 'ENQUEUE_LOCK_REQUEST',
    request: {
      store,
      path,
      exclusive,
      notifyAcquired
    }
  };
  return promise;
}
function* __unstableReleaseStoreLock(lock) {
  yield {
    type: 'RELEASE_LOCK',
    lock
  };
  yield* __unstableProcessPendingLockRequests();
}
function* __unstableProcessPendingLockRequests() {
  yield {
    type: 'PROCESS_PENDING_LOCK_REQUESTS'
  };
  const lockRequests = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, '__unstableGetPendingLockRequests');

  for (const request of lockRequests) {
    const {
      store,
      path,
      exclusive,
      notifyAcquired
    } = request;
    const isAvailable = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, '__unstableIsLockAvailable', store, path, {
      exclusive
    });

    if (isAvailable) {
      const lock = {
        store,
        path,
        exclusive
      };
      yield {
        type: 'GRANT_LOCK_REQUEST',
        lock,
        request
      };
      notifyAcquired(lock);
    }
  }
}
//# sourceMappingURL=actions.js.map
;// CONCATENATED MODULE: external ["wp","apiFetch"]
var external_wp_apiFetch_namespaceObject = window["wp"]["apiFetch"];
var external_wp_apiFetch_default = /*#__PURE__*/__webpack_require__.n(external_wp_apiFetch_namespaceObject);
;// CONCATENATED MODULE: ./packages/core-data/build-module/batch/default-processor.js
/**
 * WordPress dependencies
 */

/**
 * Default batch processor. Sends its input requests to /v1/batch.
 *
 * @param {Array} requests List of API requests to perform at once.
 *
 * @return {Promise} Promise that resolves to a list of objects containing
 *                   either `output` (if that request was succesful) or `error`
 *                   (if not ).
 */

async function defaultProcessor(requests) {
  const batchResponse = await external_wp_apiFetch_default()({
    path: '/batch/v1',
    method: 'POST',
    data: {
      validation: 'require-all-validate',
      requests: requests.map(request => ({
        path: request.path,
        body: request.data,
        // Rename 'data' to 'body'.
        method: request.method,
        headers: request.headers
      }))
    }
  });

  if (batchResponse.failed) {
    return batchResponse.responses.map(response => ({
      error: response === null || response === void 0 ? void 0 : response.body
    }));
  }

  return batchResponse.responses.map(response => {
    const result = {};

    if (response.status >= 200 && response.status < 300) {
      result.output = response.body;
    } else {
      result.error = response.body;
    }

    return result;
  });
}
//# sourceMappingURL=default-processor.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/batch/create-batch.js
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */


/**
 * Creates a batch, which can be used to combine multiple API requests into one
 * API request using the WordPress batch processing API (/v1/batch).
 *
 * ```
 * const batch = createBatch();
 * const dunePromise = batch.add( {
 *   path: '/v1/books',
 *   method: 'POST',
 *   data: { title: 'Dune' }
 * } );
 * const lotrPromise = batch.add( {
 *   path: '/v1/books',
 *   method: 'POST',
 *   data: { title: 'Lord of the Rings' }
 * } );
 * const isSuccess = await batch.run(); // Sends one POST to /v1/batch.
 * if ( isSuccess ) {
 *   console.log(
 *     'Saved two books:',
 *     await dunePromise,
 *     await lotrPromise
 *   );
 * }
 * ```
 *
 * @param {Function} [processor] Processor function. Can be used to replace the
 *                               default functionality which is to send an API
 *                               request to /v1/batch. Is given an array of
 *                               inputs and must return a promise that
 *                               resolves to an array of objects containing
 *                               either `output` or `error`.
 */

function createBatch(processor = defaultProcessor) {
  let lastId = 0;
  let queue = [];
  const pending = new ObservableSet();
  return {
    /**
     * Adds an input to the batch and returns a promise that is resolved or
     * rejected when the input is processed by `batch.run()`.
     *
     * You may also pass a thunk which allows inputs to be added
     * asychronously.
     *
     * ```
     * // Both are allowed:
     * batch.add( { path: '/v1/books', ... } );
     * batch.add( ( add ) => add( { path: '/v1/books', ... } ) );
     * ```
     *
     * If a thunk is passed, `batch.run()` will pause until either:
     *
     * - The thunk calls its `add` argument, or;
     * - The thunk returns a promise and that promise resolves, or;
     * - The thunk returns a non-promise.
     *
     * @param {any|Function} inputOrThunk Input to add or thunk to execute.
     *
     * @return {Promise|any} If given an input, returns a promise that
     *                       is resolved or rejected when the batch is
     *                       processed. If given a thunk, returns the return
     *                       value of that thunk.
     */
    add(inputOrThunk) {
      const id = ++lastId;
      pending.add(id);

      const add = input => new Promise((resolve, reject) => {
        queue.push({
          input,
          resolve,
          reject
        });
        pending.delete(id);
      });

      if ((0,external_lodash_namespaceObject.isFunction)(inputOrThunk)) {
        return Promise.resolve(inputOrThunk(add)).finally(() => {
          pending.delete(id);
        });
      }

      return add(inputOrThunk);
    },

    /**
     * Runs the batch. This calls `batchProcessor` and resolves or rejects
     * all promises returned by `add()`.
     *
     * @return {Promise} A promise that resolves to a boolean that is true
     *                   if the processor returned no errors.
     */
    async run() {
      if (pending.size) {
        await new Promise(resolve => {
          const unsubscribe = pending.subscribe(() => {
            if (!pending.size) {
              unsubscribe();
              resolve();
            }
          });
        });
      }

      let results;

      try {
        results = await processor(queue.map(({
          input
        }) => input));

        if (results.length !== queue.length) {
          throw new Error('run: Array returned by processor must be same size as input array.');
        }
      } catch (error) {
        for (const {
          reject
        } of queue) {
          reject(error);
        }

        throw error;
      }

      let isSuccess = true;

      for (const [result, {
        resolve,
        reject
      }] of (0,external_lodash_namespaceObject.zip)(results, queue)) {
        if (result !== null && result !== void 0 && result.error) {
          reject(result.error);
          isSuccess = false;
        } else {
          var _result$output;

          resolve((_result$output = result === null || result === void 0 ? void 0 : result.output) !== null && _result$output !== void 0 ? _result$output : result);
        }
      }

      queue = [];
      return isSuccess;
    }

  };
}

class ObservableSet {
  constructor(...args) {
    this.set = new Set(...args);
    this.subscribers = new Set();
  }

  get size() {
    return this.set.size;
  }

  add(...args) {
    this.set.add(...args);
    this.subscribers.forEach(subscriber => subscriber());
    return this;
  }

  delete(...args) {
    const isSuccess = this.set.delete(...args);
    this.subscribers.forEach(subscriber => subscriber());
    return isSuccess;
  }

  subscribe(subscriber) {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

}
//# sourceMappingURL=create-batch.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/controls.js
/**
 * WordPress dependencies
 */

function regularFetch(url) {
  return {
    type: 'REGULAR_FETCH',
    url
  };
}
function getDispatch() {
  return {
    type: 'GET_DISPATCH'
  };
}
const controls = {
  async REGULAR_FETCH({
    url
  }) {
    const {
      data
    } = await window.fetch(url).then(res => res.json());
    return data;
  },

  GET_DISPATCH: (0,external_wp_data_namespaceObject.createRegistryControl)(({
    dispatch
  }) => () => dispatch)
};
/* harmony default export */ var build_module_controls = (controls);
//# sourceMappingURL=controls.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/actions.js
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */







/**
 * Returns an action object used in signalling that authors have been received.
 *
 * @param {string}       queryID Query ID.
 * @param {Array|Object} users   Users received.
 *
 * @return {Object} Action object.
 */

function receiveUserQuery(queryID, users) {
  return {
    type: 'RECEIVE_USER_QUERY',
    users: (0,external_lodash_namespaceObject.castArray)(users),
    queryID
  };
}
/**
 * Returns an action used in signalling that the current user has been received.
 *
 * @param {Object} currentUser Current user object.
 *
 * @return {Object} Action object.
 */

function receiveCurrentUser(currentUser) {
  return {
    type: 'RECEIVE_CURRENT_USER',
    currentUser
  };
}
/**
 * Returns an action object used in adding new entities.
 *
 * @param {Array} entities Entities received.
 *
 * @return {Object} Action object.
 */

function addEntities(entities) {
  return {
    type: 'ADD_ENTITIES',
    entities
  };
}
/**
 * Returns an action object used in signalling that entity records have been received.
 *
 * @param {string}       kind            Kind of the received entity.
 * @param {string}       name            Name of the received entity.
 * @param {Array|Object} records         Records received.
 * @param {?Object}      query           Query Object.
 * @param {?boolean}     invalidateCache Should invalidate query caches.
 * @param {?Object}      edits           Edits to reset.
 * @return {Object} Action object.
 */

function receiveEntityRecords(kind, name, records, query, invalidateCache = false, edits) {
  // Auto drafts should not have titles, but some plugins rely on them so we can't filter this
  // on the server.
  if (kind === 'postType') {
    records = (0,external_lodash_namespaceObject.castArray)(records).map(record => record.status === 'auto-draft' ? { ...record,
      title: ''
    } : record);
  }

  let action;

  if (query) {
    action = receiveQueriedItems(records, query, edits);
  } else {
    action = receiveItems(records, edits);
  }

  return { ...action,
    kind,
    name,
    invalidateCache
  };
}
/**
 * Returns an action object used in signalling that the current theme has been received.
 *
 * @param {Object} currentTheme The current theme.
 *
 * @return {Object} Action object.
 */

function receiveCurrentTheme(currentTheme) {
  return {
    type: 'RECEIVE_CURRENT_THEME',
    currentTheme
  };
}
/**
 * Returns an action object used in signalling that the index has been received.
 *
 * @param {Object} themeSupports Theme support for the current theme.
 *
 * @return {Object} Action object.
 */

function receiveThemeSupports(themeSupports) {
  return {
    type: 'RECEIVE_THEME_SUPPORTS',
    themeSupports
  };
}
/**
 * Returns an action object used in signalling that the preview data for
 * a given URl has been received.
 *
 * @param {string} url     URL to preview the embed for.
 * @param {*}      preview Preview data.
 *
 * @return {Object} Action object.
 */

function receiveEmbedPreview(url, preview) {
  return {
    type: 'RECEIVE_EMBED_PREVIEW',
    url,
    preview
  };
}
/**
 * Action triggered to delete an entity record.
 *
 * @param {string}   kind                      Kind of the deleted entity.
 * @param {string}   name                      Name of the deleted entity.
 * @param {string}   recordId                  Record ID of the deleted entity.
 * @param {?Object}  query                     Special query parameters for the
 *                                             DELETE API call.
 * @param {Object}   [options]                 Delete options.
 * @param {Function} [options.__unstableFetch] Internal use only. Function to
 *                                             call instead of `apiFetch()`.
 *                                             Must return a control descriptor.
 */

function* deleteEntityRecord(kind, name, recordId, query, {
  __unstableFetch = null
} = {}) {
  const entities = yield getKindEntities(kind);
  const entity = (0,external_lodash_namespaceObject.find)(entities, {
    kind,
    name
  });
  let error;
  let deletedRecord = false;

  if (!entity) {
    return;
  }

  const lock = yield* __unstableAcquireStoreLock(STORE_NAME, ['entities', 'data', kind, name, recordId], {
    exclusive: true
  });

  try {
    yield {
      type: 'DELETE_ENTITY_RECORD_START',
      kind,
      name,
      recordId
    };

    try {
      let path = `${entity.baseURL}/${recordId}`;

      if (query) {
        path = (0,external_wp_url_namespaceObject.addQueryArgs)(path, query);
      }

      const options = {
        path,
        method: 'DELETE'
      };

      if (__unstableFetch) {
        deletedRecord = yield (0,external_wp_dataControls_namespaceObject.__unstableAwaitPromise)(__unstableFetch(options));
      } else {
        deletedRecord = yield (0,external_wp_dataControls_namespaceObject.apiFetch)(options);
      }

      yield removeItems(kind, name, recordId, true);
    } catch (_error) {
      error = _error;
    }

    yield {
      type: 'DELETE_ENTITY_RECORD_FINISH',
      kind,
      name,
      recordId,
      error
    };
    return deletedRecord;
  } finally {
    yield* __unstableReleaseStoreLock(lock);
  }
}
/**
 * Returns an action object that triggers an
 * edit to an entity record.
 *
 * @param {string}  kind               Kind of the edited entity record.
 * @param {string}  name               Name of the edited entity record.
 * @param {number}  recordId           Record ID of the edited entity record.
 * @param {Object}  edits              The edits.
 * @param {Object}  options            Options for the edit.
 * @param {boolean} options.undoIgnore Whether to ignore the edit in undo history or not.
 *
 * @return {Object} Action object.
 */

function* editEntityRecord(kind, name, recordId, edits, options = {}) {
  const entity = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getEntity', kind, name);

  if (!entity) {
    throw new Error(`The entity being edited (${kind}, ${name}) does not have a loaded config.`);
  }

  const {
    transientEdits = {},
    mergedEdits = {}
  } = entity;
  const record = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getRawEntityRecord', kind, name, recordId);
  const editedRecord = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getEditedEntityRecord', kind, name, recordId);
  const edit = {
    kind,
    name,
    recordId,
    // Clear edits when they are equal to their persisted counterparts
    // so that the property is not considered dirty.
    edits: Object.keys(edits).reduce((acc, key) => {
      const recordValue = record[key];
      const editedRecordValue = editedRecord[key];
      const value = mergedEdits[key] ? { ...editedRecordValue,
        ...edits[key]
      } : edits[key];
      acc[key] = (0,external_lodash_namespaceObject.isEqual)(recordValue, value) ? undefined : value;
      return acc;
    }, {}),
    transientEdits
  };
  return {
    type: 'EDIT_ENTITY_RECORD',
    ...edit,
    meta: {
      undo: !options.undoIgnore && { ...edit,
        // Send the current values for things like the first undo stack entry.
        edits: Object.keys(edits).reduce((acc, key) => {
          acc[key] = editedRecord[key];
          return acc;
        }, {})
      }
    }
  };
}
/**
 * Action triggered to undo the last edit to
 * an entity record, if any.
 */

function* undo() {
  const undoEdit = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getUndoEdit');

  if (!undoEdit) {
    return;
  }

  yield {
    type: 'EDIT_ENTITY_RECORD',
    ...undoEdit,
    meta: {
      isUndo: true
    }
  };
}
/**
 * Action triggered to redo the last undoed
 * edit to an entity record, if any.
 */

function* redo() {
  const redoEdit = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getRedoEdit');

  if (!redoEdit) {
    return;
  }

  yield {
    type: 'EDIT_ENTITY_RECORD',
    ...redoEdit,
    meta: {
      isRedo: true
    }
  };
}
/**
 * Forces the creation of a new undo level.
 *
 * @return {Object} Action object.
 */

function __unstableCreateUndoLevel() {
  return {
    type: 'CREATE_UNDO_LEVEL'
  };
}
/**
 * Action triggered to save an entity record.
 *
 * @param {string}   kind                       Kind of the received entity.
 * @param {string}   name                       Name of the received entity.
 * @param {Object}   record                     Record to be saved.
 * @param {Object}   options                    Saving options.
 * @param {boolean}  [options.isAutosave=false] Whether this is an autosave.
 * @param {Function} [options.__unstableFetch]  Internal use only. Function to
 *                                              call instead of `apiFetch()`.
 *                                              Must return a control
 *                                              descriptor.
 */

function* saveEntityRecord(kind, name, record, {
  isAutosave = false,
  __unstableFetch = null
} = {}) {
  const entities = yield getKindEntities(kind);
  const entity = (0,external_lodash_namespaceObject.find)(entities, {
    kind,
    name
  });

  if (!entity) {
    return;
  }

  const entityIdKey = entity.key || DEFAULT_ENTITY_KEY;
  const recordId = record[entityIdKey];
  const lock = yield* __unstableAcquireStoreLock(STORE_NAME, ['entities', 'data', kind, name, recordId || esm_browser_v4()], {
    exclusive: true
  });

  try {
    // Evaluate optimized edits.
    // (Function edits that should be evaluated on save to avoid expensive computations on every edit.)
    for (const [key, value] of Object.entries(record)) {
      if (typeof value === 'function') {
        const evaluatedValue = value(yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getEditedEntityRecord', kind, name, recordId));
        yield editEntityRecord(kind, name, recordId, {
          [key]: evaluatedValue
        }, {
          undoIgnore: true
        });
        record[key] = evaluatedValue;
      }
    }

    yield {
      type: 'SAVE_ENTITY_RECORD_START',
      kind,
      name,
      recordId,
      isAutosave
    };
    let updatedRecord;
    let error;

    try {
      const path = `${entity.baseURL}${recordId ? '/' + recordId : ''}`;
      const persistedRecord = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getRawEntityRecord', kind, name, recordId);

      if (isAutosave) {
        // Most of this autosave logic is very specific to posts.
        // This is fine for now as it is the only supported autosave,
        // but ideally this should all be handled in the back end,
        // so the client just sends and receives objects.
        const currentUser = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getCurrentUser');
        const currentUserId = currentUser ? currentUser.id : undefined;
        const autosavePost = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getAutosave', persistedRecord.type, persistedRecord.id, currentUserId); // Autosaves need all expected fields to be present.
        // So we fallback to the previous autosave and then
        // to the actual persisted entity if the edits don't
        // have a value.

        let data = { ...persistedRecord,
          ...autosavePost,
          ...record
        };
        data = Object.keys(data).reduce((acc, key) => {
          if (['title', 'excerpt', 'content'].includes(key)) {
            // Edits should be the "raw" attribute values.
            acc[key] = (0,external_lodash_namespaceObject.get)(data[key], 'raw', data[key]);
          }

          return acc;
        }, {
          status: data.status === 'auto-draft' ? 'draft' : data.status
        });
        const options = {
          path: `${path}/autosaves`,
          method: 'POST',
          data
        };

        if (__unstableFetch) {
          updatedRecord = yield (0,external_wp_dataControls_namespaceObject.__unstableAwaitPromise)(__unstableFetch(options));
        } else {
          updatedRecord = yield (0,external_wp_dataControls_namespaceObject.apiFetch)(options);
        } // An autosave may be processed by the server as a regular save
        // when its update is requested by the author and the post had
        // draft or auto-draft status.


        if (persistedRecord.id === updatedRecord.id) {
          let newRecord = { ...persistedRecord,
            ...data,
            ...updatedRecord
          };
          newRecord = Object.keys(newRecord).reduce((acc, key) => {
            // These properties are persisted in autosaves.
            if (['title', 'excerpt', 'content'].includes(key)) {
              // Edits should be the "raw" attribute values.
              acc[key] = (0,external_lodash_namespaceObject.get)(newRecord[key], 'raw', newRecord[key]);
            } else if (key === 'status') {
              // Status is only persisted in autosaves when going from
              // "auto-draft" to "draft".
              acc[key] = persistedRecord.status === 'auto-draft' && newRecord.status === 'draft' ? newRecord.status : persistedRecord.status;
            } else {
              // These properties are not persisted in autosaves.
              acc[key] = (0,external_lodash_namespaceObject.get)(persistedRecord[key], 'raw', persistedRecord[key]);
            }

            return acc;
          }, {});
          yield receiveEntityRecords(kind, name, newRecord, undefined, true);
        } else {
          yield receiveAutosaves(persistedRecord.id, updatedRecord);
        }
      } else {
        let edits = record;

        if (entity.__unstablePrePersist) {
          edits = { ...edits,
            ...entity.__unstablePrePersist(persistedRecord, edits)
          };
        }

        const options = {
          path,
          method: recordId ? 'PUT' : 'POST',
          data: edits
        };

        if (__unstableFetch) {
          updatedRecord = yield (0,external_wp_dataControls_namespaceObject.__unstableAwaitPromise)(__unstableFetch(options));
        } else {
          updatedRecord = yield (0,external_wp_dataControls_namespaceObject.apiFetch)(options);
        }

        yield receiveEntityRecords(kind, name, updatedRecord, undefined, true, edits);
      }
    } catch (_error) {
      error = _error;
    }

    yield {
      type: 'SAVE_ENTITY_RECORD_FINISH',
      kind,
      name,
      recordId,
      error,
      isAutosave
    };
    return updatedRecord;
  } finally {
    yield* __unstableReleaseStoreLock(lock);
  }
}
/**
 * Runs multiple core-data actions at the same time using one API request.
 *
 * Example:
 *
 * ```
 * const [ savedRecord, updatedRecord, deletedRecord ] =
 *   await dispatch( 'core' ).__experimentalBatch( [
 *     ( { saveEntityRecord } ) => saveEntityRecord( 'root', 'widget', widget ),
 *     ( { saveEditedEntityRecord } ) => saveEntityRecord( 'root', 'widget', 123 ),
 *     ( { deleteEntityRecord } ) => deleteEntityRecord( 'root', 'widget', 123, null ),
 *   ] );
 * ```
 *
 * @param {Array} requests Array of functions which are invoked simultaneously.
 *                         Each function is passed an object containing
 *                         `saveEntityRecord`, `saveEditedEntityRecord`, and
 *                         `deleteEntityRecord`.
 *
 * @return {Promise} A promise that resolves to an array containing the return
 *                   values of each function given in `requests`.
 */

function* __experimentalBatch(requests) {
  const batch = createBatch();
  const dispatch = yield getDispatch();
  const api = {
    saveEntityRecord(kind, name, record, options) {
      return batch.add(add => dispatch(STORE_NAME).saveEntityRecord(kind, name, record, { ...options,
        __unstableFetch: add
      }));
    },

    saveEditedEntityRecord(kind, name, recordId, options) {
      return batch.add(add => dispatch(STORE_NAME).saveEditedEntityRecord(kind, name, recordId, { ...options,
        __unstableFetch: add
      }));
    },

    deleteEntityRecord(kind, name, recordId, query, options) {
      return batch.add(add => dispatch(STORE_NAME).deleteEntityRecord(kind, name, recordId, query, { ...options,
        __unstableFetch: add
      }));
    }

  };
  const resultPromises = requests.map(request => request(api));
  const [, ...results] = yield (0,external_wp_dataControls_namespaceObject.__unstableAwaitPromise)(Promise.all([batch.run(), ...resultPromises]));
  return results;
}
/**
 * Action triggered to save an entity record's edits.
 *
 * @param {string} kind     Kind of the entity.
 * @param {string} name     Name of the entity.
 * @param {Object} recordId ID of the record.
 * @param {Object} options  Saving options.
 */

function* saveEditedEntityRecord(kind, name, recordId, options) {
  if (!(yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'hasEditsForEntityRecord', kind, name, recordId))) {
    return;
  }

  const edits = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getEntityRecordNonTransientEdits', kind, name, recordId);
  const record = {
    id: recordId,
    ...edits
  };
  return yield* saveEntityRecord(kind, name, record, options);
}
/**
 * Action triggered to save only specified properties for the entity.
 *
 * @param {string} kind        Kind of the entity.
 * @param {string} name        Name of the entity.
 * @param {Object} recordId    ID of the record.
 * @param {Array}  itemsToSave List of entity properties to save.
 * @param {Object} options     Saving options.
 */

function* __experimentalSaveSpecifiedEntityEdits(kind, name, recordId, itemsToSave, options) {
  if (!(yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'hasEditsForEntityRecord', kind, name, recordId))) {
    return;
  }

  const edits = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getEntityRecordNonTransientEdits', kind, name, recordId);
  const editsToSave = {};

  for (const edit in edits) {
    if (itemsToSave.some(item => item === edit)) {
      editsToSave[edit] = edits[edit];
    }
  }

  return yield* saveEntityRecord(kind, name, editsToSave, options);
}
/**
 * Returns an action object used in signalling that Upload permissions have been received.
 *
 * @param {boolean} hasUploadPermissions Does the user have permission to upload files?
 *
 * @return {Object} Action object.
 */

function receiveUploadPermissions(hasUploadPermissions) {
  return {
    type: 'RECEIVE_USER_PERMISSION',
    key: 'create/media',
    isAllowed: hasUploadPermissions
  };
}
/**
 * Returns an action object used in signalling that the current user has
 * permission to perform an action on a REST resource.
 *
 * @param {string}  key       A key that represents the action and REST resource.
 * @param {boolean} isAllowed Whether or not the user can perform the action.
 *
 * @return {Object} Action object.
 */

function receiveUserPermission(key, isAllowed) {
  return {
    type: 'RECEIVE_USER_PERMISSION',
    key,
    isAllowed
  };
}
/**
 * Returns an action object used in signalling that the autosaves for a
 * post have been received.
 *
 * @param {number}       postId    The id of the post that is parent to the autosave.
 * @param {Array|Object} autosaves An array of autosaves or singular autosave object.
 *
 * @return {Object} Action object.
 */

function receiveAutosaves(postId, autosaves) {
  return {
    type: 'RECEIVE_AUTOSAVES',
    postId,
    autosaves: (0,external_lodash_namespaceObject.castArray)(autosaves)
  };
}
//# sourceMappingURL=actions.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/entities.js
/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */



const DEFAULT_ENTITY_KEY = 'id';
const defaultEntities = [{
  label: (0,external_wp_i18n_namespaceObject.__)('Base'),
  name: '__unstableBase',
  kind: 'root',
  baseURL: ''
}, {
  label: (0,external_wp_i18n_namespaceObject.__)('Site'),
  name: 'site',
  kind: 'root',
  baseURL: '/wp/v2/settings',
  getTitle: record => {
    return (0,external_lodash_namespaceObject.get)(record, ['title'], (0,external_wp_i18n_namespaceObject.__)('Site Title'));
  }
}, {
  label: (0,external_wp_i18n_namespaceObject.__)('Post Type'),
  name: 'postType',
  kind: 'root',
  key: 'slug',
  baseURL: '/wp/v2/types',
  baseURLParams: {
    context: 'edit'
  }
}, {
  name: 'media',
  kind: 'root',
  baseURL: '/wp/v2/media',
  baseURLParams: {
    context: 'edit'
  },
  plural: 'mediaItems',
  label: (0,external_wp_i18n_namespaceObject.__)('Media')
}, {
  name: 'taxonomy',
  kind: 'root',
  key: 'slug',
  baseURL: '/wp/v2/taxonomies',
  baseURLParams: {
    context: 'edit'
  },
  plural: 'taxonomies',
  label: (0,external_wp_i18n_namespaceObject.__)('Taxonomy')
}, {
  name: 'sidebar',
  kind: 'root',
  baseURL: '/wp/v2/sidebars',
  plural: 'sidebars',
  transientEdits: {
    blocks: true
  },
  label: (0,external_wp_i18n_namespaceObject.__)('Widget areas')
}, {
  name: 'widget',
  kind: 'root',
  baseURL: '/wp/v2/widgets',
  baseURLParams: {
    context: 'edit'
  },
  plural: 'widgets',
  transientEdits: {
    blocks: true
  },
  label: (0,external_wp_i18n_namespaceObject.__)('Widgets')
}, {
  name: 'widgetType',
  kind: 'root',
  baseURL: '/wp/v2/widget-types',
  baseURLParams: {
    context: 'edit'
  },
  plural: 'widgetTypes',
  label: (0,external_wp_i18n_namespaceObject.__)('Widget types')
}, {
  label: (0,external_wp_i18n_namespaceObject.__)('User'),
  name: 'user',
  kind: 'root',
  baseURL: '/wp/v2/users',
  baseURLParams: {
    context: 'edit'
  },
  plural: 'users'
}, {
  name: 'comment',
  kind: 'root',
  baseURL: '/wp/v2/comments',
  baseURLParams: {
    context: 'edit'
  },
  plural: 'comments',
  label: (0,external_wp_i18n_namespaceObject.__)('Comment')
}, {
  name: 'menu',
  kind: 'root',
  baseURL: '/__experimental/menus',
  baseURLParams: {
    context: 'edit'
  },
  plural: 'menus',
  label: (0,external_wp_i18n_namespaceObject.__)('Menu')
}, {
  name: 'menuItem',
  kind: 'root',
  baseURL: '/__experimental/menu-items',
  baseURLParams: {
    context: 'edit'
  },
  plural: 'menuItems',
  label: (0,external_wp_i18n_namespaceObject.__)('Menu Item')
}, {
  name: 'menuLocation',
  kind: 'root',
  baseURL: '/__experimental/menu-locations',
  baseURLParams: {
    context: 'edit'
  },
  plural: 'menuLocations',
  label: (0,external_wp_i18n_namespaceObject.__)('Menu Location'),
  key: 'name'
}];
const kinds = [{
  name: 'postType',
  loadEntities: loadPostTypeEntities
}, {
  name: 'taxonomy',
  loadEntities: loadTaxonomyEntities
}];
/**
 * Returns a function to be used to retrieve extra edits to apply before persisting a post type.
 *
 * @param {Object} persistedRecord Already persisted Post
 * @param {Object} edits           Edits.
 * @return {Object} Updated edits.
 */

const prePersistPostType = (persistedRecord, edits) => {
  const newEdits = {};

  if ((persistedRecord === null || persistedRecord === void 0 ? void 0 : persistedRecord.status) === 'auto-draft') {
    // Saving an auto-draft should create a draft by default.
    if (!edits.status && !newEdits.status) {
      newEdits.status = 'draft';
    } // Fix the auto-draft default title.


    if ((!edits.title || edits.title === 'Auto Draft') && !newEdits.title && (!(persistedRecord !== null && persistedRecord !== void 0 && persistedRecord.title) || (persistedRecord === null || persistedRecord === void 0 ? void 0 : persistedRecord.title) === 'Auto Draft')) {
      newEdits.title = '';
    }
  }

  return newEdits;
};
/**
 * Returns the list of post type entities.
 *
 * @return {Promise} Entities promise
 */

function* loadPostTypeEntities() {
  const postTypes = yield (0,external_wp_dataControls_namespaceObject.apiFetch)({
    path: '/wp/v2/types?context=edit'
  });
  return (0,external_lodash_namespaceObject.map)(postTypes, (postType, name) => {
    const isTemplate = ['wp_template', 'wp_template_part'].includes(name);
    return {
      kind: 'postType',
      baseURL: '/wp/v2/' + postType.rest_base,
      baseURLParams: {
        context: 'edit'
      },
      name,
      label: postType.labels.singular_name,
      transientEdits: {
        blocks: true,
        selection: true
      },
      mergedEdits: {
        meta: true
      },
      getTitle: record => {
        var _record$title;

        return (record === null || record === void 0 ? void 0 : (_record$title = record.title) === null || _record$title === void 0 ? void 0 : _record$title.rendered) || (record === null || record === void 0 ? void 0 : record.title) || (isTemplate ? (0,external_lodash_namespaceObject.startCase)(record.slug) : String(record.id));
      },
      __unstablePrePersist: isTemplate ? undefined : prePersistPostType,
      __unstable_rest_base: postType.rest_base
    };
  });
}
/**
 * Returns the list of the taxonomies entities.
 *
 * @return {Promise} Entities promise
 */


function* loadTaxonomyEntities() {
  const taxonomies = yield (0,external_wp_dataControls_namespaceObject.apiFetch)({
    path: '/wp/v2/taxonomies?context=edit'
  });
  return (0,external_lodash_namespaceObject.map)(taxonomies, (taxonomy, name) => {
    return {
      kind: 'taxonomy',
      baseURL: '/wp/v2/' + taxonomy.rest_base,
      baseURLParams: {
        context: 'edit'
      },
      name,
      label: taxonomy.labels.singular_name
    };
  });
}
/**
 * Returns the entity's getter method name given its kind and name.
 *
 * @param {string}  kind      Entity kind.
 * @param {string}  name      Entity name.
 * @param {string}  prefix    Function prefix.
 * @param {boolean} usePlural Whether to use the plural form or not.
 *
 * @return {string} Method name
 */


const getMethodName = (kind, name, prefix = 'get', usePlural = false) => {
  const entity = (0,external_lodash_namespaceObject.find)(defaultEntities, {
    kind,
    name
  });
  const kindPrefix = kind === 'root' ? '' : (0,external_lodash_namespaceObject.upperFirst)((0,external_lodash_namespaceObject.camelCase)(kind));
  const nameSuffix = (0,external_lodash_namespaceObject.upperFirst)((0,external_lodash_namespaceObject.camelCase)(name)) + (usePlural ? 's' : '');
  const suffix = usePlural && entity.plural ? (0,external_lodash_namespaceObject.upperFirst)((0,external_lodash_namespaceObject.camelCase)(entity.plural)) : nameSuffix;
  return `${prefix}${kindPrefix}${suffix}`;
};
/**
 * Loads the kind entities into the store.
 *
 * @param {string} kind Kind
 *
 * @return {Array} Entities
 */

function* getKindEntities(kind) {
  let entities = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getEntitiesByKind', kind);

  if (entities && entities.length !== 0) {
    return entities;
  }

  const kindConfig = (0,external_lodash_namespaceObject.find)(kinds, {
    name: kind
  });

  if (!kindConfig) {
    return [];
  }

  entities = yield kindConfig.loadEntities();
  yield addEntities(entities);
  return entities;
}
//# sourceMappingURL=entities.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/utils/get-normalized-comma-separable.js
/**
 * Given a value which can be specified as one or the other of a comma-separated
 * string or an array, returns a value normalized to an array of strings, or
 * null if the value cannot be interpreted as either.
 *
 * @param {string|string[]|*} value
 *
 * @return {?(string[])} Normalized field value.
 */
function getNormalizedCommaSeparable(value) {
  if (typeof value === 'string') {
    return value.split(',');
  } else if (Array.isArray(value)) {
    return value;
  }

  return null;
}

/* harmony default export */ var get_normalized_comma_separable = (getNormalizedCommaSeparable);
//# sourceMappingURL=get-normalized-comma-separable.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/utils/with-weak-map-cache.js
/**
 * External dependencies
 */

/**
 * Given a function, returns an enhanced function which caches the result and
 * tracks in WeakMap. The result is only cached if the original function is
 * passed a valid object-like argument (requirement for WeakMap key).
 *
 * @param {Function} fn Original function.
 *
 * @return {Function} Enhanced caching function.
 */

function withWeakMapCache(fn) {
  const cache = new WeakMap();
  return key => {
    let value;

    if (cache.has(key)) {
      value = cache.get(key);
    } else {
      value = fn(key); // Can reach here if key is not valid for WeakMap, since `has`
      // will return false for invalid key. Since `set` will throw,
      // ensure that key is valid before setting into cache.

      if ((0,external_lodash_namespaceObject.isObjectLike)(key)) {
        cache.set(key, value);
      }
    }

    return value;
  };
}

/* harmony default export */ var with_weak_map_cache = (withWeakMapCache);
//# sourceMappingURL=with-weak-map-cache.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/queried-data/get-query-parts.js
/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */


/**
 * An object of properties describing a specific query.
 *
 * @typedef {Object} WPQueriedDataQueryParts
 *
 * @property {number}      page      The query page (1-based index, default 1).
 * @property {number}      perPage   Items per page for query (default 10).
 * @property {string}      stableKey An encoded stable string of all non-
 *                                   pagination, non-fields query parameters.
 * @property {?(string[])} fields    Target subset of fields to derive from
 *                                   item objects.
 * @property {?(number[])} include   Specific item IDs to include.
 */

/**
 * Given a query object, returns an object of parts, including pagination
 * details (`page` and `perPage`, or default values). All other properties are
 * encoded into a stable (idempotent) `stableKey` value.
 *
 * @param {Object} query Optional query object.
 *
 * @return {WPQueriedDataQueryParts} Query parts.
 */

function getQueryParts(query) {
  /**
   * @type {WPQueriedDataQueryParts}
   */
  const parts = {
    stableKey: '',
    page: 1,
    perPage: 10,
    fields: null,
    include: null,
    context: 'default'
  }; // Ensure stable key by sorting keys. Also more efficient for iterating.

  const keys = Object.keys(query).sort();

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    let value = query[key];

    switch (key) {
      case 'page':
        parts[key] = Number(value);
        break;

      case 'per_page':
        parts.perPage = Number(value);
        break;

      case 'include':
        parts.include = get_normalized_comma_separable(value).map(Number);
        break;

      case 'context':
        parts.context = value;
        break;

      default:
        // While in theory, we could exclude "_fields" from the stableKey
        // because two request with different fields have the same results
        // We're not able to ensure that because the server can decide to omit
        // fields from the response even if we explicitely asked for it.
        // Example: Asking for titles in posts without title support.
        if (key === '_fields') {
          parts.fields = get_normalized_comma_separable(value); // Make sure to normalize value for `stableKey`

          value = parts.fields.join();
        } // While it could be any deterministic string, for simplicity's
        // sake mimic querystring encoding for stable key.
        //
        // TODO: For consistency with PHP implementation, addQueryArgs
        // should accept a key value pair, which may optimize its
        // implementation for our use here, vs. iterating an object
        // with only a single key.


        parts.stableKey += (parts.stableKey ? '&' : '') + (0,external_wp_url_namespaceObject.addQueryArgs)('', {
          [key]: value
        }).slice(1);
    }
  }

  return parts;
}
/* harmony default export */ var get_query_parts = (with_weak_map_cache(getQueryParts));
//# sourceMappingURL=get-query-parts.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/queried-data/reducer.js
/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */





function getContextFromAction(action) {
  const {
    query
  } = action;

  if (!query) {
    return 'default';
  }

  const queryParts = get_query_parts(query);
  return queryParts.context;
}
/**
 * Returns a merged array of item IDs, given details of the received paginated
 * items. The array is sparse-like with `undefined` entries where holes exist.
 *
 * @param {?Array<number>} itemIds     Original item IDs (default empty array).
 * @param {number[]}       nextItemIds Item IDs to merge.
 * @param {number}         page        Page of items merged.
 * @param {number}         perPage     Number of items per page.
 *
 * @return {number[]} Merged array of item IDs.
 */


function getMergedItemIds(itemIds, nextItemIds, page, perPage) {
  const receivedAllIds = page === 1 && perPage === -1;

  if (receivedAllIds) {
    return nextItemIds;
  }

  const nextItemIdsStartIndex = (page - 1) * perPage; // If later page has already been received, default to the larger known
  // size of the existing array, else calculate as extending the existing.

  const size = Math.max(itemIds.length, nextItemIdsStartIndex + nextItemIds.length); // Preallocate array since size is known.

  const mergedItemIds = new Array(size);

  for (let i = 0; i < size; i++) {
    // Preserve existing item ID except for subset of range of next items.
    const isInNextItemsRange = i >= nextItemIdsStartIndex && i < nextItemIdsStartIndex + nextItemIds.length;
    mergedItemIds[i] = isInNextItemsRange ? nextItemIds[i - nextItemIdsStartIndex] : itemIds[i];
  }

  return mergedItemIds;
}
/**
 * Reducer tracking items state, keyed by ID. Items are assumed to be normal,
 * where identifiers are common across all queries.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Next state.
 */

function items(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_ITEMS':
      {
        const context = getContextFromAction(action);
        const key = action.key || DEFAULT_ENTITY_KEY;
        return { ...state,
          [context]: { ...state[context],
            ...action.items.reduce((accumulator, value) => {
              var _state$context;

              const itemId = value[key];
              accumulator[itemId] = conservativeMapItem(state === null || state === void 0 ? void 0 : (_state$context = state[context]) === null || _state$context === void 0 ? void 0 : _state$context[itemId], value);
              return accumulator;
            }, {})
          }
        };
      }

    case 'REMOVE_ITEMS':
      return (0,external_lodash_namespaceObject.mapValues)(state, contextState => (0,external_lodash_namespaceObject.omit)(contextState, action.itemIds));
  }

  return state;
}
/**
 * Reducer tracking item completeness, keyed by ID. A complete item is one for
 * which all fields are known. This is used in supporting `_fields` queries,
 * where not all properties associated with an entity are necessarily returned.
 * In such cases, completeness is used as an indication of whether it would be
 * safe to use queried data for a non-`_fields`-limited request.
 *
 * @param {Object<string,boolean>} state  Current state.
 * @param {Object}                 action Dispatched action.
 *
 * @return {Object<string,boolean>} Next state.
 */

function itemIsComplete(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_ITEMS':
      {
        const context = getContextFromAction(action);
        const {
          query,
          key = DEFAULT_ENTITY_KEY
        } = action; // An item is considered complete if it is received without an associated
        // fields query. Ideally, this would be implemented in such a way where the
        // complete aggregate of all fields would satisfy completeness. Since the
        // fields are not consistent across all entity types, this would require
        // introspection on the REST schema for each entity to know which fields
        // compose a complete item for that entity.

        const queryParts = query ? get_query_parts(query) : {};
        const isCompleteQuery = !query || !Array.isArray(queryParts.fields);
        return { ...state,
          [context]: { ...state[context],
            ...action.items.reduce((result, item) => {
              var _state$context2;

              const itemId = item[key]; // Defer to completeness if already assigned. Technically the
              // data may be outdated if receiving items for a field subset.

              result[itemId] = (state === null || state === void 0 ? void 0 : (_state$context2 = state[context]) === null || _state$context2 === void 0 ? void 0 : _state$context2[itemId]) || isCompleteQuery;
              return result;
            }, {})
          }
        };
      }

    case 'REMOVE_ITEMS':
      return (0,external_lodash_namespaceObject.mapValues)(state, contextState => (0,external_lodash_namespaceObject.omit)(contextState, action.itemIds));
  }

  return state;
}
/**
 * Reducer tracking queries state, keyed by stable query key. Each reducer
 * query object includes `itemIds` and `requestingPageByPerPage`.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Next state.
 */

const receiveQueries = (0,external_lodash_namespaceObject.flowRight)([// Limit to matching action type so we don't attempt to replace action on
// an unhandled action.
if_matching_action(action => 'query' in action), // Inject query parts into action for use both in `onSubKey` and reducer.
replace_action(action => {
  // `ifMatchingAction` still passes on initialization, where state is
  // undefined and a query is not assigned. Avoid attempting to parse
  // parts. `onSubKey` will omit by lack of `stableKey`.
  if (action.query) {
    return { ...action,
      ...get_query_parts(action.query)
    };
  }

  return action;
}), on_sub_key('context'), // Queries shape is shared, but keyed by query `stableKey` part. Original
// reducer tracks only a single query object.
on_sub_key('stableKey')])((state = null, action) => {
  const {
    type,
    page,
    perPage,
    key = DEFAULT_ENTITY_KEY
  } = action;

  if (type !== 'RECEIVE_ITEMS') {
    return state;
  }

  return getMergedItemIds(state || [], (0,external_lodash_namespaceObject.map)(action.items, key), page, perPage);
});
/**
 * Reducer tracking queries state.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Next state.
 */

const queries = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_ITEMS':
      return receiveQueries(state, action);

    case 'REMOVE_ITEMS':
      const removedItems = action.itemIds.reduce((result, itemId) => {
        result[itemId] = true;
        return result;
      }, {});
      return (0,external_lodash_namespaceObject.mapValues)(state, contextQueries => {
        return (0,external_lodash_namespaceObject.mapValues)(contextQueries, queryItems => {
          return (0,external_lodash_namespaceObject.filter)(queryItems, queryId => {
            return !removedItems[queryId];
          });
        });
      });

    default:
      return state;
  }
};

/* harmony default export */ var reducer = ((0,external_wp_data_namespaceObject.combineReducers)({
  items,
  itemIsComplete,
  queries
}));
//# sourceMappingURL=reducer.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/locks/utils.js
function deepCopyLocksTreePath(tree, path) {
  const newTree = { ...tree
  };
  let currentNode = newTree;

  for (const branchName of path) {
    currentNode.children = { ...currentNode.children,
      [branchName]: {
        locks: [],
        children: {},
        ...currentNode.children[branchName]
      }
    };
    currentNode = currentNode.children[branchName];
  }

  return newTree;
}
function getNode(tree, path) {
  let currentNode = tree;

  for (const branchName of path) {
    const nextNode = currentNode.children[branchName];

    if (!nextNode) {
      return null;
    }

    currentNode = nextNode;
  }

  return currentNode;
}
function* iteratePath(tree, path) {
  let currentNode = tree;
  yield currentNode;

  for (const branchName of path) {
    const nextNode = currentNode.children[branchName];

    if (!nextNode) {
      break;
    }

    yield nextNode;
    currentNode = nextNode;
  }
}
function* iterateDescendants(node) {
  const stack = Object.values(node.children);

  while (stack.length) {
    const childNode = stack.pop();
    yield childNode;
    stack.push(...Object.values(childNode.children));
  }
}
function hasConflictingLock({
  exclusive
}, locks) {
  if (exclusive && locks.length) {
    return true;
  }

  if (!exclusive && locks.filter(lock => lock.exclusive).length) {
    return true;
  }

  return false;
}
//# sourceMappingURL=utils.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/locks/reducer.js
/**
 * Internal dependencies
 */

const DEFAULT_STATE = {
  requests: [],
  tree: {
    locks: [],
    children: {}
  }
};
/**
 * Reducer returning locks.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */

function locks(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case 'ENQUEUE_LOCK_REQUEST':
      {
        const {
          request
        } = action;
        return { ...state,
          requests: [request, ...state.requests]
        };
      }

    case 'GRANT_LOCK_REQUEST':
      {
        const {
          lock,
          request
        } = action;
        const {
          store,
          path
        } = request;
        const storePath = [store, ...path];
        const newTree = deepCopyLocksTreePath(state.tree, storePath);
        const node = getNode(newTree, storePath);
        node.locks = [...node.locks, lock];
        return { ...state,
          requests: state.requests.filter(r => r !== request),
          tree: newTree
        };
      }

    case 'RELEASE_LOCK':
      {
        const {
          lock
        } = action;
        const storePath = [lock.store, ...lock.path];
        const newTree = deepCopyLocksTreePath(state.tree, storePath);
        const node = getNode(newTree, storePath);
        node.locks = node.locks.filter(l => l !== lock);
        return { ...state,
          tree: newTree
        };
      }
  }

  return state;
}
/* harmony default export */ var locks_reducer = (locks);
//# sourceMappingURL=reducer.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/reducer.js
/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */





/**
 * Reducer managing terms state. Keyed by taxonomy slug, the value is either
 * undefined (if no request has been made for given taxonomy), null (if a
 * request is in-flight for given taxonomy), or the array of terms for the
 * taxonomy.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */

function terms(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_TERMS':
      return { ...state,
        [action.taxonomy]: action.terms
      };
  }

  return state;
}
/**
 * Reducer managing authors state. Keyed by id.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */

function users(state = {
  byId: {},
  queries: {}
}, action) {
  switch (action.type) {
    case 'RECEIVE_USER_QUERY':
      return {
        byId: { ...state.byId,
          ...(0,external_lodash_namespaceObject.keyBy)(action.users, 'id')
        },
        queries: { ...state.queries,
          [action.queryID]: (0,external_lodash_namespaceObject.map)(action.users, user => user.id)
        }
      };
  }

  return state;
}
/**
 * Reducer managing current user state.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */

function currentUser(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_CURRENT_USER':
      return action.currentUser;
  }

  return state;
}
/**
 * Reducer managing taxonomies.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */

function taxonomies(state = [], action) {
  switch (action.type) {
    case 'RECEIVE_TAXONOMIES':
      return action.taxonomies;
  }

  return state;
}
/**
 * Reducer managing the current theme.
 *
 * @param {string} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {string} Updated state.
 */

function currentTheme(state = undefined, action) {
  switch (action.type) {
    case 'RECEIVE_CURRENT_THEME':
      return action.currentTheme.stylesheet;
  }

  return state;
}
/**
 * Reducer managing installed themes.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */

function themes(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_CURRENT_THEME':
      return { ...state,
        [action.currentTheme.stylesheet]: action.currentTheme
      };
  }

  return state;
}
/**
 * Reducer managing theme supports data.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */

function themeSupports(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_THEME_SUPPORTS':
      return { ...state,
        ...action.themeSupports
      };
  }

  return state;
}
/**
 * Higher Order Reducer for a given entity config. It supports:
 *
 *  - Fetching
 *  - Editing
 *  - Saving
 *
 * @param {Object} entityConfig Entity config.
 *
 * @return {Function} Reducer.
 */

function entity(entityConfig) {
  return (0,external_lodash_namespaceObject.flowRight)([// Limit to matching action type so we don't attempt to replace action on
  // an unhandled action.
  if_matching_action(action => action.name && action.kind && action.name === entityConfig.name && action.kind === entityConfig.kind), // Inject the entity config into the action.
  replace_action(action => {
    return { ...action,
      key: entityConfig.key || DEFAULT_ENTITY_KEY
    };
  })])((0,external_wp_data_namespaceObject.combineReducers)({
    queriedData: reducer,
    edits: (state = {}, action) => {
      var _action$query$context, _action$query;

      switch (action.type) {
        case 'RECEIVE_ITEMS':
          const context = (_action$query$context = action === null || action === void 0 ? void 0 : (_action$query = action.query) === null || _action$query === void 0 ? void 0 : _action$query.context) !== null && _action$query$context !== void 0 ? _action$query$context : 'default';

          if (context !== 'default') {
            return state;
          }

          const nextState = { ...state
          };

          for (const record of action.items) {
            const recordId = record[action.key];
            const edits = nextState[recordId];

            if (!edits) {
              continue;
            }

            const nextEdits = Object.keys(edits).reduce((acc, key) => {
              // If the edited value is still different to the persisted value,
              // keep the edited value in edits.
              if ( // Edits are the "raw" attribute values, but records may have
              // objects with more properties, so we use `get` here for the
              // comparison.
              !(0,external_lodash_namespaceObject.isEqual)(edits[key], (0,external_lodash_namespaceObject.get)(record[key], 'raw', record[key])) && ( // Sometimes the server alters the sent value which means
              // we need to also remove the edits before the api request.
              !action.persistedEdits || !(0,external_lodash_namespaceObject.isEqual)(edits[key], action.persistedEdits[key]))) {
                acc[key] = edits[key];
              }

              return acc;
            }, {});

            if (Object.keys(nextEdits).length) {
              nextState[recordId] = nextEdits;
            } else {
              delete nextState[recordId];
            }
          }

          return nextState;

        case 'EDIT_ENTITY_RECORD':
          const nextEdits = { ...state[action.recordId],
            ...action.edits
          };
          Object.keys(nextEdits).forEach(key => {
            // Delete cleared edits so that the properties
            // are not considered dirty.
            if (nextEdits[key] === undefined) {
              delete nextEdits[key];
            }
          });
          return { ...state,
            [action.recordId]: nextEdits
          };
      }

      return state;
    },
    saving: (state = {}, action) => {
      switch (action.type) {
        case 'SAVE_ENTITY_RECORD_START':
        case 'SAVE_ENTITY_RECORD_FINISH':
          return { ...state,
            [action.recordId]: {
              pending: action.type === 'SAVE_ENTITY_RECORD_START',
              error: action.error,
              isAutosave: action.isAutosave
            }
          };
      }

      return state;
    },
    deleting: (state = {}, action) => {
      switch (action.type) {
        case 'DELETE_ENTITY_RECORD_START':
        case 'DELETE_ENTITY_RECORD_FINISH':
          return { ...state,
            [action.recordId]: {
              pending: action.type === 'DELETE_ENTITY_RECORD_START',
              error: action.error
            }
          };
      }

      return state;
    }
  }));
}
/**
 * Reducer keeping track of the registered entities.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */


function entitiesConfig(state = defaultEntities, action) {
  switch (action.type) {
    case 'ADD_ENTITIES':
      return [...state, ...action.entities];
  }

  return state;
}
/**
 * Reducer keeping track of the registered entities config and data.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */

const entities = (state = {}, action) => {
  const newConfig = entitiesConfig(state.config, action); // Generates a dynamic reducer for the entities

  let entitiesDataReducer = state.reducer;

  if (!entitiesDataReducer || newConfig !== state.config) {
    const entitiesByKind = (0,external_lodash_namespaceObject.groupBy)(newConfig, 'kind');
    entitiesDataReducer = (0,external_wp_data_namespaceObject.combineReducers)(Object.entries(entitiesByKind).reduce((memo, [kind, subEntities]) => {
      const kindReducer = (0,external_wp_data_namespaceObject.combineReducers)(subEntities.reduce((kindMemo, entityConfig) => ({ ...kindMemo,
        [entityConfig.name]: entity(entityConfig)
      }), {}));
      memo[kind] = kindReducer;
      return memo;
    }, {}));
  }

  const newData = entitiesDataReducer(state.data, action);

  if (newData === state.data && newConfig === state.config && entitiesDataReducer === state.reducer) {
    return state;
  }

  return {
    reducer: entitiesDataReducer,
    data: newData,
    config: newConfig
  };
};
/**
 * Reducer keeping track of entity edit undo history.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */

const UNDO_INITIAL_STATE = [];
UNDO_INITIAL_STATE.offset = 0;
let lastEditAction;
function reducer_undo(state = UNDO_INITIAL_STATE, action) {
  switch (action.type) {
    case 'EDIT_ENTITY_RECORD':
    case 'CREATE_UNDO_LEVEL':
      let isCreateUndoLevel = action.type === 'CREATE_UNDO_LEVEL';
      const isUndoOrRedo = !isCreateUndoLevel && (action.meta.isUndo || action.meta.isRedo);

      if (isCreateUndoLevel) {
        action = lastEditAction;
      } else if (!isUndoOrRedo) {
        // Don't lose the last edit cache if the new one only has transient edits.
        // Transient edits don't create new levels so updating the cache would make
        // us skip an edit later when creating levels explicitly.
        if (Object.keys(action.edits).some(key => !action.transientEdits[key])) {
          lastEditAction = action;
        } else {
          lastEditAction = { ...action,
            edits: { ...(lastEditAction && lastEditAction.edits),
              ...action.edits
            }
          };
        }
      }

      let nextState;

      if (isUndoOrRedo) {
        nextState = [...state];
        nextState.offset = state.offset + (action.meta.isUndo ? -1 : 1);

        if (state.flattenedUndo) {
          // The first undo in a sequence of undos might happen while we have
          // flattened undos in state. If this is the case, we want execution
          // to continue as if we were creating an explicit undo level. This
          // will result in an extra undo level being appended with the flattened
          // undo values.
          isCreateUndoLevel = true;
          action = lastEditAction;
        } else {
          return nextState;
        }
      }

      if (!action.meta.undo) {
        return state;
      } // Transient edits don't create an undo level, but are
      // reachable in the next meaningful edit to which they
      // are merged. They are defined in the entity's config.


      if (!isCreateUndoLevel && !Object.keys(action.edits).some(key => !action.transientEdits[key])) {
        nextState = [...state];
        nextState.flattenedUndo = { ...state.flattenedUndo,
          ...action.edits
        };
        nextState.offset = state.offset;
        return nextState;
      } // Clear potential redos, because this only supports linear history.


      nextState = nextState || state.slice(0, state.offset || undefined);
      nextState.offset = nextState.offset || 0;
      nextState.pop();

      if (!isCreateUndoLevel) {
        nextState.push({
          kind: action.meta.undo.kind,
          name: action.meta.undo.name,
          recordId: action.meta.undo.recordId,
          edits: { ...state.flattenedUndo,
            ...action.meta.undo.edits
          }
        });
      } // When an edit is a function it's an optimization to avoid running some expensive operation.
      // We can't rely on the function references being the same so we opt out of comparing them here.


      const comparisonUndoEdits = Object.values(action.meta.undo.edits).filter(edit => typeof edit !== 'function');
      const comparisonEdits = Object.values(action.edits).filter(edit => typeof edit !== 'function');

      if (!external_wp_isShallowEqual_default()(comparisonUndoEdits, comparisonEdits)) {
        nextState.push({
          kind: action.kind,
          name: action.name,
          recordId: action.recordId,
          edits: isCreateUndoLevel ? { ...state.flattenedUndo,
            ...action.edits
          } : action.edits
        });
      }

      return nextState;
  }

  return state;
}
/**
 * Reducer managing embed preview data.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */

function embedPreviews(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_EMBED_PREVIEW':
      const {
        url,
        preview
      } = action;
      return { ...state,
        [url]: preview
      };
  }

  return state;
}
/**
 * State which tracks whether the user can perform an action on a REST
 * resource.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */

function userPermissions(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_USER_PERMISSION':
      return { ...state,
        [action.key]: action.isAllowed
      };
  }

  return state;
}
/**
 * Reducer returning autosaves keyed by their parent's post id.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */

function autosaves(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_AUTOSAVES':
      const {
        postId,
        autosaves: autosavesData
      } = action;
      return { ...state,
        [postId]: autosavesData
      };
  }

  return state;
}
/* harmony default export */ var build_module_reducer = ((0,external_wp_data_namespaceObject.combineReducers)({
  terms,
  users,
  currentTheme,
  currentUser,
  taxonomies,
  themes,
  themeSupports,
  entities,
  undo: reducer_undo,
  embedPreviews,
  userPermissions,
  autosaves,
  locks: locks_reducer
}));
//# sourceMappingURL=reducer.js.map
;// CONCATENATED MODULE: ./node_modules/rememo/es/rememo.js


var LEAF_KEY, hasWeakMap;

/**
 * Arbitrary value used as key for referencing cache object in WeakMap tree.
 *
 * @type {Object}
 */
LEAF_KEY = {};

/**
 * Whether environment supports WeakMap.
 *
 * @type {boolean}
 */
hasWeakMap = typeof WeakMap !== 'undefined';

/**
 * Returns the first argument as the sole entry in an array.
 *
 * @param {*} value Value to return.
 *
 * @return {Array} Value returned as entry in array.
 */
function arrayOf( value ) {
	return [ value ];
}

/**
 * Returns true if the value passed is object-like, or false otherwise. A value
 * is object-like if it can support property assignment, e.g. object or array.
 *
 * @param {*} value Value to test.
 *
 * @return {boolean} Whether value is object-like.
 */
function isObjectLike( value ) {
	return !! value && 'object' === typeof value;
}

/**
 * Creates and returns a new cache object.
 *
 * @return {Object} Cache object.
 */
function createCache() {
	var cache = {
		clear: function() {
			cache.head = null;
		},
	};

	return cache;
}

/**
 * Returns true if entries within the two arrays are strictly equal by
 * reference from a starting index.
 *
 * @param {Array}  a         First array.
 * @param {Array}  b         Second array.
 * @param {number} fromIndex Index from which to start comparison.
 *
 * @return {boolean} Whether arrays are shallowly equal.
 */
function isShallowEqual( a, b, fromIndex ) {
	var i;

	if ( a.length !== b.length ) {
		return false;
	}

	for ( i = fromIndex; i < a.length; i++ ) {
		if ( a[ i ] !== b[ i ] ) {
			return false;
		}
	}

	return true;
}

/**
 * Returns a memoized selector function. The getDependants function argument is
 * called before the memoized selector and is expected to return an immutable
 * reference or array of references on which the selector depends for computing
 * its own return value. The memoize cache is preserved only as long as those
 * dependant references remain the same. If getDependants returns a different
 * reference(s), the cache is cleared and the selector value regenerated.
 *
 * @param {Function} selector      Selector function.
 * @param {Function} getDependants Dependant getter returning an immutable
 *                                 reference or array of reference used in
 *                                 cache bust consideration.
 *
 * @return {Function} Memoized selector.
 */
/* harmony default export */ function rememo(selector, getDependants ) {
	var rootCache, getCache;

	// Use object source as dependant if getter not provided
	if ( ! getDependants ) {
		getDependants = arrayOf;
	}

	/**
	 * Returns the root cache. If WeakMap is supported, this is assigned to the
	 * root WeakMap cache set, otherwise it is a shared instance of the default
	 * cache object.
	 *
	 * @return {(WeakMap|Object)} Root cache object.
	 */
	function getRootCache() {
		return rootCache;
	}

	/**
	 * Returns the cache for a given dependants array. When possible, a WeakMap
	 * will be used to create a unique cache for each set of dependants. This
	 * is feasible due to the nature of WeakMap in allowing garbage collection
	 * to occur on entries where the key object is no longer referenced. Since
	 * WeakMap requires the key to be an object, this is only possible when the
	 * dependant is object-like. The root cache is created as a hierarchy where
	 * each top-level key is the first entry in a dependants set, the value a
	 * WeakMap where each key is the next dependant, and so on. This continues
	 * so long as the dependants are object-like. If no dependants are object-
	 * like, then the cache is shared across all invocations.
	 *
	 * @see isObjectLike
	 *
	 * @param {Array} dependants Selector dependants.
	 *
	 * @return {Object} Cache object.
	 */
	function getWeakMapCache( dependants ) {
		var caches = rootCache,
			isUniqueByDependants = true,
			i, dependant, map, cache;

		for ( i = 0; i < dependants.length; i++ ) {
			dependant = dependants[ i ];

			// Can only compose WeakMap from object-like key.
			if ( ! isObjectLike( dependant ) ) {
				isUniqueByDependants = false;
				break;
			}

			// Does current segment of cache already have a WeakMap?
			if ( caches.has( dependant ) ) {
				// Traverse into nested WeakMap.
				caches = caches.get( dependant );
			} else {
				// Create, set, and traverse into a new one.
				map = new WeakMap();
				caches.set( dependant, map );
				caches = map;
			}
		}

		// We use an arbitrary (but consistent) object as key for the last item
		// in the WeakMap to serve as our running cache.
		if ( ! caches.has( LEAF_KEY ) ) {
			cache = createCache();
			cache.isUniqueByDependants = isUniqueByDependants;
			caches.set( LEAF_KEY, cache );
		}

		return caches.get( LEAF_KEY );
	}

	// Assign cache handler by availability of WeakMap
	getCache = hasWeakMap ? getWeakMapCache : getRootCache;

	/**
	 * Resets root memoization cache.
	 */
	function clear() {
		rootCache = hasWeakMap ? new WeakMap() : createCache();
	}

	// eslint-disable-next-line jsdoc/check-param-names
	/**
	 * The augmented selector call, considering first whether dependants have
	 * changed before passing it to underlying memoize function.
	 *
	 * @param {Object} source    Source object for derivation.
	 * @param {...*}   extraArgs Additional arguments to pass to selector.
	 *
	 * @return {*} Selector result.
	 */
	function callSelector( /* source, ...extraArgs */ ) {
		var len = arguments.length,
			cache, node, i, args, dependants;

		// Create copy of arguments (avoid leaking deoptimization).
		args = new Array( len );
		for ( i = 0; i < len; i++ ) {
			args[ i ] = arguments[ i ];
		}

		dependants = getDependants.apply( null, args );
		cache = getCache( dependants );

		// If not guaranteed uniqueness by dependants (primitive type or lack
		// of WeakMap support), shallow compare against last dependants and, if
		// references have changed, destroy cache to recalculate result.
		if ( ! cache.isUniqueByDependants ) {
			if ( cache.lastDependants && ! isShallowEqual( dependants, cache.lastDependants, 0 ) ) {
				cache.clear();
			}

			cache.lastDependants = dependants;
		}

		node = cache.head;
		while ( node ) {
			// Check whether node arguments match arguments
			if ( ! isShallowEqual( node.args, args, 1 ) ) {
				node = node.next;
				continue;
			}

			// At this point we can assume we've found a match

			// Surface matched node to head if not already
			if ( node !== cache.head ) {
				// Adjust siblings to point to each other.
				node.prev.next = node.next;
				if ( node.next ) {
					node.next.prev = node.prev;
				}

				node.next = cache.head;
				node.prev = null;
				cache.head.prev = node;
				cache.head = node;
			}

			// Return immediately
			return node.val;
		}

		// No cached value found. Continue to insertion phase:

		node = {
			// Generate the result from original function
			val: selector.apply( null, args ),
		};

		// Avoid including the source object in the cache.
		args[ 0 ] = null;
		node.args = args;

		// Don't need to check whether node is already head, since it would
		// have been returned above already if it was

		// Shift existing head down list
		if ( cache.head ) {
			cache.head.prev = node;
			node.next = cache.head;
		}

		cache.head = node;

		return node.val;
	}

	callSelector.getDependants = getDependants;
	callSelector.clear = clear;
	clear();

	return callSelector;
}

;// CONCATENATED MODULE: external ["wp","deprecated"]
var external_wp_deprecated_namespaceObject = window["wp"]["deprecated"];
var external_wp_deprecated_default = /*#__PURE__*/__webpack_require__.n(external_wp_deprecated_namespaceObject);
// EXTERNAL MODULE: ./node_modules/equivalent-key-map/equivalent-key-map.js
var equivalent_key_map = __webpack_require__(3909);
var equivalent_key_map_default = /*#__PURE__*/__webpack_require__.n(equivalent_key_map);
;// CONCATENATED MODULE: ./packages/core-data/build-module/queried-data/selectors.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */


/**
 * Cache of state keys to EquivalentKeyMap where the inner map tracks queries
 * to their resulting items set. WeakMap allows garbage collection on expired
 * state references.
 *
 * @type {WeakMap<Object,EquivalentKeyMap>}
 */

const queriedItemsCacheByState = new WeakMap();
/**
 * Returns items for a given query, or null if the items are not known.
 *
 * @param {Object}  state State object.
 * @param {?Object} query Optional query.
 *
 * @return {?Array} Query items.
 */

function getQueriedItemsUncached(state, query) {
  var _state$queries, _state$queries$contex;

  const {
    stableKey,
    page,
    perPage,
    include,
    fields,
    context
  } = get_query_parts(query);
  let itemIds;

  if ((_state$queries = state.queries) !== null && _state$queries !== void 0 && (_state$queries$contex = _state$queries[context]) !== null && _state$queries$contex !== void 0 && _state$queries$contex[stableKey]) {
    itemIds = state.queries[context][stableKey];
  }

  if (!itemIds) {
    return null;
  }

  const startOffset = perPage === -1 ? 0 : (page - 1) * perPage;
  const endOffset = perPage === -1 ? itemIds.length : Math.min(startOffset + perPage, itemIds.length);
  const items = [];

  for (let i = startOffset; i < endOffset; i++) {
    var _state$items$context;

    const itemId = itemIds[i];

    if (Array.isArray(include) && !include.includes(itemId)) {
      continue;
    } // Having a target item ID doesn't guarantee that this object has been queried.


    if (!((_state$items$context = state.items[context]) !== null && _state$items$context !== void 0 && _state$items$context.hasOwnProperty(itemId))) {
      return null;
    }

    const item = state.items[context][itemId];
    let filteredItem;

    if (Array.isArray(fields)) {
      filteredItem = {};

      for (let f = 0; f < fields.length; f++) {
        const field = fields[f].split('.');
        const value = (0,external_lodash_namespaceObject.get)(item, field);
        (0,external_lodash_namespaceObject.set)(filteredItem, field, value);
      }
    } else {
      var _state$itemIsComplete;

      // If expecting a complete item, validate that completeness, or
      // otherwise abort.
      if (!((_state$itemIsComplete = state.itemIsComplete[context]) !== null && _state$itemIsComplete !== void 0 && _state$itemIsComplete[itemId])) {
        return null;
      }

      filteredItem = item;
    }

    items.push(filteredItem);
  }

  return items;
}
/**
 * Returns items for a given query, or null if the items are not known. Caches
 * result both per state (by reference) and per query (by deep equality).
 * The caching approach is intended to be durable to query objects which are
 * deeply but not referentially equal, since otherwise:
 *
 * `getQueriedItems( state, {} ) !== getQueriedItems( state, {} )`
 *
 * @param {Object}  state State object.
 * @param {?Object} query Optional query.
 *
 * @return {?Array} Query items.
 */


const getQueriedItems = rememo((state, query = {}) => {
  let queriedItemsCache = queriedItemsCacheByState.get(state);

  if (queriedItemsCache) {
    const queriedItems = queriedItemsCache.get(query);

    if (queriedItems !== undefined) {
      return queriedItems;
    }
  } else {
    queriedItemsCache = new (equivalent_key_map_default())();
    queriedItemsCacheByState.set(state, queriedItemsCache);
  }

  const items = getQueriedItemsUncached(state, query);
  queriedItemsCache.set(query, items);
  return items;
});
//# sourceMappingURL=selectors.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/selectors.js
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */





/**
 * Shared reference to an empty array for cases where it is important to avoid
 * returning a new array reference on every invocation, as in a connected or
 * other pure component which performs `shouldComponentUpdate` check on props.
 * This should be used as a last resort, since the normalized data should be
 * maintained by the reducer result in state.
 *
 * @type {Array}
 */

const EMPTY_ARRAY = [];
/**
 * Returns true if a request is in progress for embed preview data, or false
 * otherwise.
 *
 * @param {Object} state Data state.
 * @param {string} url   URL the preview would be for.
 *
 * @return {boolean} Whether a request is in progress for an embed preview.
 */

const isRequestingEmbedPreview = (0,external_wp_data_namespaceObject.createRegistrySelector)(select => (state, url) => {
  return select(STORE_NAME).isResolving('getEmbedPreview', [url]);
});
/**
 * Returns all available authors.
 *
 * @deprecated since 11.3. Callers should use `select( 'core' ).getUsers({ who: 'authors' })` instead.
 *
 * @param {Object}           state Data state.
 * @param {Object|undefined} query Optional object of query parameters to
 *                                 include with request.
 * @return {Array} Authors list.
 */

function getAuthors(state, query) {
  external_wp_deprecated_default()("select( 'core' ).getAuthors()", {
    since: '5.9',
    alternative: "select( 'core' ).getUsers({ who: 'authors' })"
  });
  const path = (0,external_wp_url_namespaceObject.addQueryArgs)('/wp/v2/users/?who=authors&per_page=100', query);
  return getUserQueryResults(state, path);
}
/**
 * Returns the current user.
 *
 * @param {Object} state Data state.
 *
 * @return {Object} Current user object.
 */

function getCurrentUser(state) {
  return state.currentUser;
}
/**
 * Returns all the users returned by a query ID.
 *
 * @param {Object} state   Data state.
 * @param {string} queryID Query ID.
 *
 * @return {Array} Users list.
 */

const getUserQueryResults = rememo((state, queryID) => {
  const queryResults = state.users.queries[queryID];
  return (0,external_lodash_namespaceObject.map)(queryResults, id => state.users.byId[id]);
}, (state, queryID) => [state.users.queries[queryID], state.users.byId]);
/**
 * Returns whether the entities for the give kind are loaded.
 *
 * @param {Object} state Data state.
 * @param {string} kind  Entity kind.
 *
 * @return {Array<Object>} Array of entities with config matching kind.
 */

function getEntitiesByKind(state, kind) {
  return (0,external_lodash_namespaceObject.filter)(state.entities.config, {
    kind
  });
}
/**
 * Returns the entity object given its kind and name.
 *
 * @param {Object} state Data state.
 * @param {string} kind  Entity kind.
 * @param {string} name  Entity name.
 *
 * @return {Object} Entity
 */

function getEntity(state, kind, name) {
  return (0,external_lodash_namespaceObject.find)(state.entities.config, {
    kind,
    name
  });
}
/**
 * Returns the Entity's record object by key. Returns `null` if the value is not
 * yet received, undefined if the value entity is known to not exist, or the
 * entity object if it exists and is received.
 *
 * @param {Object}  state State tree
 * @param {string}  kind  Entity kind.
 * @param {string}  name  Entity name.
 * @param {number}  key   Record's key
 * @param {?Object} query Optional query.
 *
 * @return {Object?} Record.
 */

function getEntityRecord(state, kind, name, key, query) {
  var _query$context, _queriedState$items$c;

  const queriedState = (0,external_lodash_namespaceObject.get)(state.entities.data, [kind, name, 'queriedData']);

  if (!queriedState) {
    return undefined;
  }

  const context = (_query$context = query === null || query === void 0 ? void 0 : query.context) !== null && _query$context !== void 0 ? _query$context : 'default';

  if (query === undefined) {
    var _queriedState$itemIsC;

    // If expecting a complete item, validate that completeness.
    if (!((_queriedState$itemIsC = queriedState.itemIsComplete[context]) !== null && _queriedState$itemIsC !== void 0 && _queriedState$itemIsC[key])) {
      return undefined;
    }

    return queriedState.items[context][key];
  }

  const item = (_queriedState$items$c = queriedState.items[context]) === null || _queriedState$items$c === void 0 ? void 0 : _queriedState$items$c[key];

  if (item && query._fields) {
    const filteredItem = {};
    const fields = get_normalized_comma_separable(query._fields);

    for (let f = 0; f < fields.length; f++) {
      const field = fields[f].split('.');
      const value = (0,external_lodash_namespaceObject.get)(item, field);
      (0,external_lodash_namespaceObject.set)(filteredItem, field, value);
    }

    return filteredItem;
  }

  return item;
}
/**
 * Returns the Entity's record object by key. Doesn't trigger a resolver nor requests the entity from the API if the entity record isn't available in the local state.
 *
 * @param {Object} state State tree
 * @param {string} kind  Entity kind.
 * @param {string} name  Entity name.
 * @param {number} key   Record's key
 *
 * @return {Object|null} Record.
 */

function __experimentalGetEntityRecordNoResolver(state, kind, name, key) {
  return getEntityRecord(state, kind, name, key);
}
/**
 * Returns the entity's record object by key,
 * with its attributes mapped to their raw values.
 *
 * @param {Object} state State tree.
 * @param {string} kind  Entity kind.
 * @param {string} name  Entity name.
 * @param {number} key   Record's key.
 *
 * @return {Object?} Object with the entity's raw attributes.
 */

const getRawEntityRecord = rememo((state, kind, name, key) => {
  const record = getEntityRecord(state, kind, name, key);
  return record && Object.keys(record).reduce((accumulator, _key) => {
    // Because edits are the "raw" attribute values,
    // we return those from record selectors to make rendering,
    // comparisons, and joins with edits easier.
    accumulator[_key] = (0,external_lodash_namespaceObject.get)(record[_key], 'raw', record[_key]);
    return accumulator;
  }, {});
}, state => [state.entities.data]);
/**
 * Returns true if records have been received for the given set of parameters,
 * or false otherwise.
 *
 * @param {Object}  state State tree
 * @param {string}  kind  Entity kind.
 * @param {string}  name  Entity name.
 * @param {?Object} query Optional terms query.
 *
 * @return {boolean} Whether entity records have been received.
 */

function hasEntityRecords(state, kind, name, query) {
  return Array.isArray(getEntityRecords(state, kind, name, query));
}
/**
 * Returns the Entity's records.
 *
 * @param {Object}  state State tree
 * @param {string}  kind  Entity kind.
 * @param {string}  name  Entity name.
 * @param {?Object} query Optional terms query.
 *
 * @return {?Array} Records.
 */

function getEntityRecords(state, kind, name, query) {
  // Queried data state is prepopulated for all known entities. If this is not
  // assigned for the given parameters, then it is known to not exist. Thus, a
  // return value of an empty array is used instead of `null` (where `null` is
  // otherwise used to represent an unknown state).
  const queriedState = (0,external_lodash_namespaceObject.get)(state.entities.data, [kind, name, 'queriedData']);

  if (!queriedState) {
    return EMPTY_ARRAY;
  }

  return getQueriedItems(queriedState, query);
}
/**
 * Returns the  list of dirty entity records.
 *
 * @param {Object} state State tree.
 *
 * @return {[{ title: string, key: string, name: string, kind: string }]} The list of updated records
 */

const __experimentalGetDirtyEntityRecords = rememo(state => {
  const {
    entities: {
      data
    }
  } = state;
  const dirtyRecords = [];
  Object.keys(data).forEach(kind => {
    Object.keys(data[kind]).forEach(name => {
      const primaryKeys = Object.keys(data[kind][name].edits).filter(primaryKey => hasEditsForEntityRecord(state, kind, name, primaryKey));

      if (primaryKeys.length) {
        const entity = getEntity(state, kind, name);
        primaryKeys.forEach(primaryKey => {
          var _entity$getTitle;

          const entityRecord = getEditedEntityRecord(state, kind, name, primaryKey);
          dirtyRecords.push({
            // We avoid using primaryKey because it's transformed into a string
            // when it's used as an object key.
            key: entityRecord[entity.key || DEFAULT_ENTITY_KEY],
            title: (entity === null || entity === void 0 ? void 0 : (_entity$getTitle = entity.getTitle) === null || _entity$getTitle === void 0 ? void 0 : _entity$getTitle.call(entity, entityRecord)) || '',
            name,
            kind
          });
        });
      }
    });
  });
  return dirtyRecords;
}, state => [state.entities.data]);
/**
 * Returns the list of entities currently being saved.
 *
 * @param {Object} state State tree.
 *
 * @return {[{ title: string, key: string, name: string, kind: string }]} The list of records being saved.
 */

const __experimentalGetEntitiesBeingSaved = rememo(state => {
  const {
    entities: {
      data
    }
  } = state;
  const recordsBeingSaved = [];
  Object.keys(data).forEach(kind => {
    Object.keys(data[kind]).forEach(name => {
      const primaryKeys = Object.keys(data[kind][name].saving).filter(primaryKey => isSavingEntityRecord(state, kind, name, primaryKey));

      if (primaryKeys.length) {
        const entity = getEntity(state, kind, name);
        primaryKeys.forEach(primaryKey => {
          var _entity$getTitle2;

          const entityRecord = getEditedEntityRecord(state, kind, name, primaryKey);
          recordsBeingSaved.push({
            // We avoid using primaryKey because it's transformed into a string
            // when it's used as an object key.
            key: entityRecord[entity.key || DEFAULT_ENTITY_KEY],
            title: (entity === null || entity === void 0 ? void 0 : (_entity$getTitle2 = entity.getTitle) === null || _entity$getTitle2 === void 0 ? void 0 : _entity$getTitle2.call(entity, entityRecord)) || '',
            name,
            kind
          });
        });
      }
    });
  });
  return recordsBeingSaved;
}, state => [state.entities.data]);
/**
 * Returns the specified entity record's edits.
 *
 * @param {Object} state    State tree.
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {number} recordId Record ID.
 *
 * @return {Object?} The entity record's edits.
 */

function getEntityRecordEdits(state, kind, name, recordId) {
  return (0,external_lodash_namespaceObject.get)(state.entities.data, [kind, name, 'edits', recordId]);
}
/**
 * Returns the specified entity record's non transient edits.
 *
 * Transient edits don't create an undo level, and
 * are not considered for change detection.
 * They are defined in the entity's config.
 *
 * @param {Object} state    State tree.
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {number} recordId Record ID.
 *
 * @return {Object?} The entity record's non transient edits.
 */

const getEntityRecordNonTransientEdits = rememo((state, kind, name, recordId) => {
  const {
    transientEdits
  } = getEntity(state, kind, name) || {};
  const edits = getEntityRecordEdits(state, kind, name, recordId) || {};

  if (!transientEdits) {
    return edits;
  }

  return Object.keys(edits).reduce((acc, key) => {
    if (!transientEdits[key]) {
      acc[key] = edits[key];
    }

    return acc;
  }, {});
}, state => [state.entities.config, state.entities.data]);
/**
 * Returns true if the specified entity record has edits,
 * and false otherwise.
 *
 * @param {Object} state    State tree.
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {number} recordId Record ID.
 *
 * @return {boolean} Whether the entity record has edits or not.
 */

function hasEditsForEntityRecord(state, kind, name, recordId) {
  return isSavingEntityRecord(state, kind, name, recordId) || Object.keys(getEntityRecordNonTransientEdits(state, kind, name, recordId)).length > 0;
}
/**
 * Returns the specified entity record, merged with its edits.
 *
 * @param {Object} state    State tree.
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {number} recordId Record ID.
 *
 * @return {Object?} The entity record, merged with its edits.
 */

const getEditedEntityRecord = rememo((state, kind, name, recordId) => ({ ...getRawEntityRecord(state, kind, name, recordId),
  ...getEntityRecordEdits(state, kind, name, recordId)
}), state => [state.entities.data]);
/**
 * Returns true if the specified entity record is autosaving, and false otherwise.
 *
 * @param {Object} state    State tree.
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {number} recordId Record ID.
 *
 * @return {boolean} Whether the entity record is autosaving or not.
 */

function isAutosavingEntityRecord(state, kind, name, recordId) {
  const {
    pending,
    isAutosave
  } = (0,external_lodash_namespaceObject.get)(state.entities.data, [kind, name, 'saving', recordId], {});
  return Boolean(pending && isAutosave);
}
/**
 * Returns true if the specified entity record is saving, and false otherwise.
 *
 * @param {Object} state    State tree.
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {number} recordId Record ID.
 *
 * @return {boolean} Whether the entity record is saving or not.
 */

function isSavingEntityRecord(state, kind, name, recordId) {
  return (0,external_lodash_namespaceObject.get)(state.entities.data, [kind, name, 'saving', recordId, 'pending'], false);
}
/**
 * Returns true if the specified entity record is deleting, and false otherwise.
 *
 * @param {Object} state    State tree.
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {number} recordId Record ID.
 *
 * @return {boolean} Whether the entity record is deleting or not.
 */

function isDeletingEntityRecord(state, kind, name, recordId) {
  return (0,external_lodash_namespaceObject.get)(state.entities.data, [kind, name, 'deleting', recordId, 'pending'], false);
}
/**
 * Returns the specified entity record's last save error.
 *
 * @param {Object} state    State tree.
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {number} recordId Record ID.
 *
 * @return {Object?} The entity record's save error.
 */

function getLastEntitySaveError(state, kind, name, recordId) {
  return (0,external_lodash_namespaceObject.get)(state.entities.data, [kind, name, 'saving', recordId, 'error']);
}
/**
 * Returns the specified entity record's last delete error.
 *
 * @param {Object} state    State tree.
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {number} recordId Record ID.
 *
 * @return {Object?} The entity record's save error.
 */

function getLastEntityDeleteError(state, kind, name, recordId) {
  return (0,external_lodash_namespaceObject.get)(state.entities.data, [kind, name, 'deleting', recordId, 'error']);
}
/**
 * Returns the current undo offset for the
 * entity records edits history. The offset
 * represents how many items from the end
 * of the history stack we are at. 0 is the
 * last edit, -1 is the second last, and so on.
 *
 * @param {Object} state State tree.
 *
 * @return {number} The current undo offset.
 */

function getCurrentUndoOffset(state) {
  return state.undo.offset;
}
/**
 * Returns the previous edit from the current undo offset
 * for the entity records edits history, if any.
 *
 * @param {Object} state State tree.
 *
 * @return {Object?} The edit.
 */


function getUndoEdit(state) {
  return state.undo[state.undo.length - 2 + getCurrentUndoOffset(state)];
}
/**
 * Returns the next edit from the current undo offset
 * for the entity records edits history, if any.
 *
 * @param {Object} state State tree.
 *
 * @return {Object?} The edit.
 */

function getRedoEdit(state) {
  return state.undo[state.undo.length + getCurrentUndoOffset(state)];
}
/**
 * Returns true if there is a previous edit from the current undo offset
 * for the entity records edits history, and false otherwise.
 *
 * @param {Object} state State tree.
 *
 * @return {boolean} Whether there is a previous edit or not.
 */

function hasUndo(state) {
  return Boolean(getUndoEdit(state));
}
/**
 * Returns true if there is a next edit from the current undo offset
 * for the entity records edits history, and false otherwise.
 *
 * @param {Object} state State tree.
 *
 * @return {boolean} Whether there is a next edit or not.
 */

function hasRedo(state) {
  return Boolean(getRedoEdit(state));
}
/**
 * Return the current theme.
 *
 * @param {Object} state Data state.
 *
 * @return {Object} The current theme.
 */

function getCurrentTheme(state) {
  return state.themes[state.currentTheme];
}
/**
 * Return theme supports data in the index.
 *
 * @param {Object} state Data state.
 *
 * @return {*} Index data.
 */

function getThemeSupports(state) {
  return state.themeSupports;
}
/**
 * Returns the embed preview for the given URL.
 *
 * @param {Object} state Data state.
 * @param {string} url   Embedded URL.
 *
 * @return {*} Undefined if the preview has not been fetched, otherwise, the preview fetched from the embed preview API.
 */

function getEmbedPreview(state, url) {
  return state.embedPreviews[url];
}
/**
 * Determines if the returned preview is an oEmbed link fallback.
 *
 * WordPress can be configured to return a simple link to a URL if it is not embeddable.
 * We need to be able to determine if a URL is embeddable or not, based on what we
 * get back from the oEmbed preview API.
 *
 * @param {Object} state Data state.
 * @param {string} url   Embedded URL.
 *
 * @return {boolean} Is the preview for the URL an oEmbed link fallback.
 */

function isPreviewEmbedFallback(state, url) {
  const preview = state.embedPreviews[url];
  const oEmbedLinkCheck = '<a href="' + url + '">' + url + '</a>';

  if (!preview) {
    return false;
  }

  return preview.html === oEmbedLinkCheck;
}
/**
 * Returns whether the current user can perform the given action on the given
 * REST resource.
 *
 * Calling this may trigger an OPTIONS request to the REST API via the
 * `canUser()` resolver.
 *
 * https://developer.wordpress.org/rest-api/reference/
 *
 * @param {Object}  state    Data state.
 * @param {string}  action   Action to check. One of: 'create', 'read', 'update', 'delete'.
 * @param {string}  resource REST resource to check, e.g. 'media' or 'posts'.
 * @param {string=} id       Optional ID of the rest resource to check.
 *
 * @return {boolean|undefined} Whether or not the user can perform the action,
 *                             or `undefined` if the OPTIONS request is still being made.
 */

function canUser(state, action, resource, id) {
  const key = (0,external_lodash_namespaceObject.compact)([action, resource, id]).join('/');
  return (0,external_lodash_namespaceObject.get)(state, ['userPermissions', key]);
}
/**
 * Returns whether the current user can edit the given entity.
 *
 * Calling this may trigger an OPTIONS request to the REST API via the
 * `canUser()` resolver.
 *
 * https://developer.wordpress.org/rest-api/reference/
 *
 * @param {Object} state    Data state.
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {string} recordId Record's id.
 * @return {boolean|undefined} Whether or not the user can edit,
 * or `undefined` if the OPTIONS request is still being made.
 */

function canUserEditEntityRecord(state, kind, name, recordId) {
  const entity = getEntity(state, kind, name);

  if (!entity) {
    return false;
  }

  const resource = entity.__unstable_rest_base;
  return canUser(state, 'update', resource, recordId);
}
/**
 * Returns the latest autosaves for the post.
 *
 * May return multiple autosaves since the backend stores one autosave per
 * author for each post.
 *
 * @param {Object} state    State tree.
 * @param {string} postType The type of the parent post.
 * @param {number} postId   The id of the parent post.
 *
 * @return {?Array} An array of autosaves for the post, or undefined if there is none.
 */

function getAutosaves(state, postType, postId) {
  return state.autosaves[postId];
}
/**
 * Returns the autosave for the post and author.
 *
 * @param {Object} state    State tree.
 * @param {string} postType The type of the parent post.
 * @param {number} postId   The id of the parent post.
 * @param {number} authorId The id of the author.
 *
 * @return {?Object} The autosave for the post and author.
 */

function getAutosave(state, postType, postId, authorId) {
  if (authorId === undefined) {
    return;
  }

  const autosaves = state.autosaves[postId];
  return (0,external_lodash_namespaceObject.find)(autosaves, {
    author: authorId
  });
}
/**
 * Returns true if the REST request for autosaves has completed.
 *
 * @param {Object} state    State tree.
 * @param {string} postType The type of the parent post.
 * @param {number} postId   The id of the parent post.
 *
 * @return {boolean} True if the REST request was completed. False otherwise.
 */

const hasFetchedAutosaves = (0,external_wp_data_namespaceObject.createRegistrySelector)(select => (state, postType, postId) => {
  return select(STORE_NAME).hasFinishedResolution('getAutosaves', [postType, postId]);
});
/**
 * Returns a new reference when edited values have changed. This is useful in
 * inferring where an edit has been made between states by comparison of the
 * return values using strict equality.
 *
 * @example
 *
 * ```
 * const hasEditOccurred = (
 *    getReferenceByDistinctEdits( beforeState ) !==
 *    getReferenceByDistinctEdits( afterState )
 * );
 * ```
 *
 * @param {Object} state Editor state.
 *
 * @return {*} A value whose reference will change only when an edit occurs.
 */

const getReferenceByDistinctEdits = rememo(() => [], state => [state.undo.length, state.undo.offset, state.undo.flattenedUndo]);
/**
 * Retrieve the frontend template used for a given link.
 *
 * @param {Object} state Editor state.
 * @param {string} link  Link.
 *
 * @return {Object?} The template record.
 */

function __experimentalGetTemplateForLink(state, link) {
  const records = getEntityRecords(state, 'postType', 'wp_template', {
    'find-template': link
  });
  const template = records !== null && records !== void 0 && records.length ? records[0] : null;

  if (template) {
    return getEditedEntityRecord(state, 'postType', 'wp_template', template.id);
  }

  return template;
}
//# sourceMappingURL=selectors.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/utils/if-not-resolved.js
/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */


/**
 * Higher-order function which invokes the given resolver only if it has not
 * already been resolved with the arguments passed to the enhanced function.
 *
 * This only considers resolution state, and notably does not support resolver
 * custom `isFulfilled` behavior.
 *
 * @param {Function} resolver     Original resolver.
 * @param {string}   selectorName Selector name associated with resolver.
 *
 * @return {Function} Enhanced resolver.
 */

const ifNotResolved = (resolver, selectorName) =>
/**
 * @param {...any} args Original resolver arguments.
 */
function* resolveIfNotResolved(...args) {
  const hasStartedResolution = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'hasStartedResolution', selectorName, args);

  if (!hasStartedResolution) {
    yield* resolver(...args);
  }
};

/* harmony default export */ var if_not_resolved = (ifNotResolved);
//# sourceMappingURL=if-not-resolved.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/resolvers.js
/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */



/**
 * Internal dependencies
 */





/**
 * Requests authors from the REST API.
 *
 * @param {Object|undefined} query Optional object of query parameters to
 *                                 include with request.
 */

function* resolvers_getAuthors(query) {
  const path = (0,external_wp_url_namespaceObject.addQueryArgs)('/wp/v2/users/?who=authors&per_page=100', query);
  const users = yield (0,external_wp_dataControls_namespaceObject.apiFetch)({
    path
  });
  yield receiveUserQuery(path, users);
}
/**
 * Requests the current user from the REST API.
 */

function* resolvers_getCurrentUser() {
  const currentUser = yield (0,external_wp_dataControls_namespaceObject.apiFetch)({
    path: '/wp/v2/users/me'
  });
  yield receiveCurrentUser(currentUser);
}
/**
 * Requests an entity's record from the REST API.
 *
 * @param {string}           kind  Entity kind.
 * @param {string}           name  Entity name.
 * @param {number|string}    key   Record's key
 * @param {Object|undefined} query Optional object of query parameters to
 *                                 include with request.
 */

function* resolvers_getEntityRecord(kind, name, key = '', query) {
  const entities = yield getKindEntities(kind);
  const entity = (0,external_lodash_namespaceObject.find)(entities, {
    kind,
    name
  });

  if (!entity) {
    return;
  }

  const lock = yield* __unstableAcquireStoreLock(STORE_NAME, ['entities', 'data', kind, name, key], {
    exclusive: false
  });

  try {
    if (query !== undefined && query._fields) {
      // If requesting specific fields, items and query association to said
      // records are stored by ID reference. Thus, fields must always include
      // the ID.
      query = { ...query,
        _fields: (0,external_lodash_namespaceObject.uniq)([...(get_normalized_comma_separable(query._fields) || []), entity.key || DEFAULT_ENTITY_KEY]).join()
      };
    } // Disable reason: While true that an early return could leave `path`
    // unused, it's important that path is derived using the query prior to
    // additional query modifications in the condition below, since those
    // modifications are relevant to how the data is tracked in state, and not
    // for how the request is made to the REST API.
    // eslint-disable-next-line @wordpress/no-unused-vars-before-return


    const path = (0,external_wp_url_namespaceObject.addQueryArgs)(entity.baseURL + '/' + key, { ...entity.baseURLParams,
      ...query
    });

    if (query !== undefined) {
      query = { ...query,
        include: [key]
      }; // The resolution cache won't consider query as reusable based on the
      // fields, so it's tested here, prior to initiating the REST request,
      // and without causing `getEntityRecords` resolution to occur.

      const hasRecords = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'hasEntityRecords', kind, name, query);

      if (hasRecords) {
        return;
      }
    }

    const record = yield (0,external_wp_dataControls_namespaceObject.apiFetch)({
      path
    });
    yield receiveEntityRecords(kind, name, record, query);
  } catch (error) {// We need a way to handle and access REST API errors in state
    // Until then, catching the error ensures the resolver is marked as resolved.
  } finally {
    yield* __unstableReleaseStoreLock(lock);
  }
}
/**
 * Requests an entity's record from the REST API.
 */

const resolvers_getRawEntityRecord = if_not_resolved(resolvers_getEntityRecord, 'getEntityRecord');
/**
 * Requests an entity's record from the REST API.
 */

const resolvers_getEditedEntityRecord = if_not_resolved(resolvers_getRawEntityRecord, 'getRawEntityRecord');
/**
 * Requests the entity's records from the REST API.
 *
 * @param {string}  kind  Entity kind.
 * @param {string}  name  Entity name.
 * @param {Object?} query Query Object.
 */

function* resolvers_getEntityRecords(kind, name, query = {}) {
  const entities = yield getKindEntities(kind);
  const entity = (0,external_lodash_namespaceObject.find)(entities, {
    kind,
    name
  });

  if (!entity) {
    return;
  }

  const lock = yield* __unstableAcquireStoreLock(STORE_NAME, ['entities', 'data', kind, name], {
    exclusive: false
  });

  try {
    var _query;

    if (query._fields) {
      // If requesting specific fields, items and query association to said
      // records are stored by ID reference. Thus, fields must always include
      // the ID.
      query = { ...query,
        _fields: (0,external_lodash_namespaceObject.uniq)([...(get_normalized_comma_separable(query._fields) || []), entity.key || DEFAULT_ENTITY_KEY]).join()
      };
    }

    const path = (0,external_wp_url_namespaceObject.addQueryArgs)(entity.baseURL, { ...entity.baseURLParams,
      ...query
    });
    let records = Object.values(yield (0,external_wp_dataControls_namespaceObject.apiFetch)({
      path
    })); // If we request fields but the result doesn't contain the fields,
    // explicitely set these fields as "undefined"
    // that way we consider the query "fullfilled".

    if (query._fields) {
      records = records.map(record => {
        query._fields.split(',').forEach(field => {
          if (!record.hasOwnProperty(field)) {
            record[field] = undefined;
          }
        });

        return record;
      });
    }

    yield receiveEntityRecords(kind, name, records, query); // When requesting all fields, the list of results can be used to
    // resolve the `getEntityRecord` selector in addition to `getEntityRecords`.
    // See https://github.com/WordPress/gutenberg/pull/26575

    if (!((_query = query) !== null && _query !== void 0 && _query._fields) && !query.context) {
      const key = entity.key || DEFAULT_ENTITY_KEY;
      const resolutionsArgs = records.filter(record => record[key]).map(record => [kind, name, record[key]]);
      yield {
        type: 'START_RESOLUTIONS',
        selectorName: 'getEntityRecord',
        args: resolutionsArgs
      };
      yield {
        type: 'FINISH_RESOLUTIONS',
        selectorName: 'getEntityRecord',
        args: resolutionsArgs
      };
    }
  } finally {
    yield* __unstableReleaseStoreLock(lock);
  }
}

resolvers_getEntityRecords.shouldInvalidate = (action, kind, name) => {
  return (action.type === 'RECEIVE_ITEMS' || action.type === 'REMOVE_ITEMS') && action.invalidateCache && kind === action.kind && name === action.name;
};
/**
 * Requests the current theme.
 */


function* resolvers_getCurrentTheme() {
  const activeThemes = yield (0,external_wp_dataControls_namespaceObject.apiFetch)({
    path: '/wp/v2/themes?status=active'
  });
  yield receiveCurrentTheme(activeThemes[0]);
}
/**
 * Requests theme supports data from the index.
 */

function* resolvers_getThemeSupports() {
  const activeThemes = yield (0,external_wp_dataControls_namespaceObject.apiFetch)({
    path: '/wp/v2/themes?status=active'
  });
  yield receiveThemeSupports(activeThemes[0].theme_supports);
}
/**
 * Requests a preview from the from the Embed API.
 *
 * @param {string} url URL to get the preview for.
 */

function* resolvers_getEmbedPreview(url) {
  try {
    const embedProxyResponse = yield (0,external_wp_dataControls_namespaceObject.apiFetch)({
      path: (0,external_wp_url_namespaceObject.addQueryArgs)('/oembed/1.0/proxy', {
        url
      })
    });
    yield receiveEmbedPreview(url, embedProxyResponse);
  } catch (error) {
    // Embed API 404s if the URL cannot be embedded, so we have to catch the error from the apiRequest here.
    yield receiveEmbedPreview(url, false);
  }
}
/**
 * Checks whether the current user can perform the given action on the given
 * REST resource.
 *
 * @param {string}  action   Action to check. One of: 'create', 'read', 'update',
 *                           'delete'.
 * @param {string}  resource REST resource to check, e.g. 'media' or 'posts'.
 * @param {?string} id       ID of the rest resource to check.
 */

function* resolvers_canUser(action, resource, id) {
  const methods = {
    create: 'POST',
    read: 'GET',
    update: 'PUT',
    delete: 'DELETE'
  };
  const method = methods[action];

  if (!method) {
    throw new Error(`'${action}' is not a valid action.`);
  }

  const path = id ? `/wp/v2/${resource}/${id}` : `/wp/v2/${resource}`;
  let response;

  try {
    response = yield (0,external_wp_dataControls_namespaceObject.apiFetch)({
      path,
      // Ideally this would always be an OPTIONS request, but unfortunately there's
      // a bug in the REST API which causes the Allow header to not be sent on
      // OPTIONS requests to /posts/:id routes.
      // https://core.trac.wordpress.org/ticket/45753
      method: id ? 'GET' : 'OPTIONS',
      parse: false
    });
  } catch (error) {
    // Do nothing if our OPTIONS request comes back with an API error (4xx or
    // 5xx). The previously determined isAllowed value will remain in the store.
    return;
  }

  let allowHeader;

  if ((0,external_lodash_namespaceObject.hasIn)(response, ['headers', 'get'])) {
    // If the request is fetched using the fetch api, the header can be
    // retrieved using the 'get' method.
    allowHeader = response.headers.get('allow');
  } else {
    // If the request was preloaded server-side and is returned by the
    // preloading middleware, the header will be a simple property.
    allowHeader = (0,external_lodash_namespaceObject.get)(response, ['headers', 'Allow'], '');
  }

  const key = (0,external_lodash_namespaceObject.compact)([action, resource, id]).join('/');
  const isAllowed = (0,external_lodash_namespaceObject.includes)(allowHeader, method);
  yield receiveUserPermission(key, isAllowed);
}
/**
 * Checks whether the current user can perform the given action on the given
 * REST resource.
 *
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {string} recordId Record's id.
 */

function* resolvers_canUserEditEntityRecord(kind, name, recordId) {
  const entities = yield getKindEntities(kind);
  const entity = (0,external_lodash_namespaceObject.find)(entities, {
    kind,
    name
  });

  if (!entity) {
    return;
  }

  const resource = entity.__unstable_rest_base;
  yield resolvers_canUser('update', resource, recordId);
}
/**
 * Request autosave data from the REST API.
 *
 * @param {string} postType The type of the parent post.
 * @param {number} postId   The id of the parent post.
 */

function* resolvers_getAutosaves(postType, postId) {
  const {
    rest_base: restBase
  } = yield external_wp_data_namespaceObject.controls.resolveSelect(STORE_NAME, 'getPostType', postType);
  const autosaves = yield (0,external_wp_dataControls_namespaceObject.apiFetch)({
    path: `/wp/v2/${restBase}/${postId}/autosaves?context=edit`
  });

  if (autosaves && autosaves.length) {
    yield receiveAutosaves(postId, autosaves);
  }
}
/**
 * Request autosave data from the REST API.
 *
 * This resolver exists to ensure the underlying autosaves are fetched via
 * `getAutosaves` when a call to the `getAutosave` selector is made.
 *
 * @param {string} postType The type of the parent post.
 * @param {number} postId   The id of the parent post.
 */

function* resolvers_getAutosave(postType, postId) {
  yield external_wp_data_namespaceObject.controls.resolveSelect(STORE_NAME, 'getAutosaves', postType, postId);
}
/**
 * Retrieve the frontend template used for a given link.
 *
 * @param {string} link Link.
 */

function* resolvers_experimentalGetTemplateForLink(link) {
  // Ideally this should be using an apiFetch call
  // We could potentially do so by adding a "filter" to the `wp_template` end point.
  // Also it seems the returned object is not a regular REST API post type.
  let template;

  try {
    template = yield regularFetch((0,external_wp_url_namespaceObject.addQueryArgs)(link, {
      '_wp-find-template': true
    }));
  } catch (e) {// For non-FSE themes, it is possible that this request returns an error.
  }

  if (!template) {
    return;
  }

  yield resolvers_getEntityRecord('postType', 'wp_template', template.id);
  const record = yield external_wp_data_namespaceObject.controls.select(STORE_NAME, 'getEntityRecord', 'postType', 'wp_template', template.id);

  if (record) {
    yield receiveEntityRecords('postType', 'wp_template', [record], {
      'find-template': link
    });
  }
}

resolvers_experimentalGetTemplateForLink.shouldInvalidate = action => {
  return (action.type === 'RECEIVE_ITEMS' || action.type === 'REMOVE_ITEMS') && action.invalidateCache && action.kind === 'postType' && action.name === 'wp_template';
};
//# sourceMappingURL=resolvers.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/locks/selectors.js
/**
 * Internal dependencies
 */

function __unstableGetPendingLockRequests(state) {
  return state.locks.requests;
}
function __unstableIsLockAvailable(state, store, path, {
  exclusive
}) {
  const storePath = [store, ...path];
  const locks = state.locks.tree; // Validate all parents and the node itself

  for (const node of iteratePath(locks, storePath)) {
    if (hasConflictingLock({
      exclusive
    }, node.locks)) {
      return false;
    }
  } // iteratePath terminates early if path is unreachable, let's
  // re-fetch the node and check it exists in the tree.


  const node = getNode(locks, storePath);

  if (!node) {
    return true;
  } // Validate all nested nodes


  for (const descendant of iterateDescendants(node)) {
    if (hasConflictingLock({
      exclusive
    }, descendant.locks)) {
      return false;
    }
  }

  return true;
}
//# sourceMappingURL=selectors.js.map
;// CONCATENATED MODULE: external ["wp","element"]
var external_wp_element_namespaceObject = window["wp"]["element"];
;// CONCATENATED MODULE: external ["wp","blocks"]
var external_wp_blocks_namespaceObject = window["wp"]["blocks"];
;// CONCATENATED MODULE: ./packages/core-data/build-module/entity-provider.js


/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */


const entity_provider_EMPTY_ARRAY = [];
/**
 * Internal dependencies
 */


const entity_provider_entities = { ...defaultEntities.reduce((acc, entity) => {
    if (!acc[entity.kind]) {
      acc[entity.kind] = {};
    }

    acc[entity.kind][entity.name] = {
      context: (0,external_wp_element_namespaceObject.createContext)()
    };
    return acc;
  }, {}),
  ...kinds.reduce((acc, kind) => {
    acc[kind.name] = {};
    return acc;
  }, {})
};

const entity_provider_getEntity = (kind, type) => {
  if (!entity_provider_entities[kind]) {
    throw new Error(`Missing entity config for kind: ${kind}.`);
  }

  if (!entity_provider_entities[kind][type]) {
    entity_provider_entities[kind][type] = {
      context: (0,external_wp_element_namespaceObject.createContext)()
    };
  }

  return entity_provider_entities[kind][type];
};
/**
 * Context provider component for providing
 * an entity for a specific entity type.
 *
 * @param {Object} props          The component's props.
 * @param {string} props.kind     The entity kind.
 * @param {string} props.type     The entity type.
 * @param {number} props.id       The entity ID.
 * @param {*}      props.children The children to wrap.
 *
 * @return {Object} The provided children, wrapped with
 *                   the entity's context provider.
 */


function EntityProvider({
  kind,
  type,
  id,
  children
}) {
  const Provider = entity_provider_getEntity(kind, type).context.Provider;
  return (0,external_wp_element_namespaceObject.createElement)(Provider, {
    value: id
  }, children);
}
/**
 * Hook that returns the ID for the nearest
 * provided entity of the specified type.
 *
 * @param {string} kind The entity kind.
 * @param {string} type The entity type.
 */

function useEntityId(kind, type) {
  return (0,external_wp_element_namespaceObject.useContext)(entity_provider_getEntity(kind, type).context);
}
/**
 * Hook that returns the value and a setter for the
 * specified property of the nearest provided
 * entity of the specified type.
 *
 * @param {string} kind  The entity kind.
 * @param {string} type  The entity type.
 * @param {string} prop  The property name.
 * @param {string} [_id] An entity ID to use instead of the context-provided one.
 *
 * @return {[*, Function, *]} An array where the first item is the
 *                            property value, the second is the
 *                            setter and the third is the full value
 * 							  object from REST API containing more
 * 							  information like `raw`, `rendered` and
 * 							  `protected` props.
 */

function useEntityProp(kind, type, prop, _id) {
  const providerId = useEntityId(kind, type);
  const id = _id !== null && _id !== void 0 ? _id : providerId;
  const {
    value,
    fullValue
  } = (0,external_wp_data_namespaceObject.useSelect)(select => {
    const {
      getEntityRecord,
      getEditedEntityRecord
    } = select(STORE_NAME);
    const entity = getEntityRecord(kind, type, id); // Trigger resolver.

    const editedEntity = getEditedEntityRecord(kind, type, id);
    return entity && editedEntity ? {
      value: editedEntity[prop],
      fullValue: entity[prop]
    } : {};
  }, [kind, type, id, prop]);
  const {
    editEntityRecord
  } = (0,external_wp_data_namespaceObject.useDispatch)(STORE_NAME);
  const setValue = (0,external_wp_element_namespaceObject.useCallback)(newValue => {
    editEntityRecord(kind, type, id, {
      [prop]: newValue
    });
  }, [kind, type, id, prop]);
  return [value, setValue, fullValue];
}
/**
 * Hook that returns block content getters and setters for
 * the nearest provided entity of the specified type.
 *
 * The return value has the shape `[ blocks, onInput, onChange ]`.
 * `onInput` is for block changes that don't create undo levels
 * or dirty the post, non-persistent changes, and `onChange` is for
 * peristent changes. They map directly to the props of a
 * `BlockEditorProvider` and are intended to be used with it,
 * or similar components or hooks.
 *
 * @param {string} kind         The entity kind.
 * @param {string} type         The entity type.
 * @param {Object} options
 * @param {string} [options.id] An entity ID to use instead of the context-provided one.
 *
 * @return {[WPBlock[], Function, Function]} The block array and setters.
 */

function useEntityBlockEditor(kind, type, {
  id: _id
} = {}) {
  const providerId = useEntityId(kind, type);
  const id = _id !== null && _id !== void 0 ? _id : providerId;
  const {
    content,
    blocks
  } = (0,external_wp_data_namespaceObject.useSelect)(select => {
    const {
      getEditedEntityRecord
    } = select(STORE_NAME);
    const editedEntity = getEditedEntityRecord(kind, type, id);
    return {
      blocks: editedEntity.blocks,
      content: editedEntity.content
    };
  }, [kind, type, id]);
  const {
    __unstableCreateUndoLevel,
    editEntityRecord
  } = (0,external_wp_data_namespaceObject.useDispatch)(STORE_NAME);
  (0,external_wp_element_namespaceObject.useEffect)(() => {
    // Load the blocks from the content if not already in state
    // Guard against other instances that might have
    // set content to a function already or the blocks are already in state.
    if (content && typeof content !== 'function' && !blocks) {
      const parsedContent = (0,external_wp_blocks_namespaceObject.parse)(content);
      editEntityRecord(kind, type, id, {
        blocks: parsedContent
      }, {
        undoIgnore: true
      });
    }
  }, [content]);
  const onChange = (0,external_wp_element_namespaceObject.useCallback)((newBlocks, options) => {
    const {
      selection
    } = options;
    const edits = {
      blocks: newBlocks,
      selection
    };
    const noChange = blocks === edits.blocks;

    if (noChange) {
      return __unstableCreateUndoLevel(kind, type, id);
    } // We create a new function here on every persistent edit
    // to make sure the edit makes the post dirty and creates
    // a new undo level.


    edits.content = ({
      blocks: blocksForSerialization = []
    }) => (0,external_wp_blocks_namespaceObject.__unstableSerializeAndClean)(blocksForSerialization);

    editEntityRecord(kind, type, id, edits);
  }, [kind, type, id, blocks]);
  const onInput = (0,external_wp_element_namespaceObject.useCallback)((newBlocks, options) => {
    const {
      selection
    } = options;
    const edits = {
      blocks: newBlocks,
      selection
    };
    editEntityRecord(kind, type, id, edits);
  }, [kind, type, id]);
  return [blocks !== null && blocks !== void 0 ? blocks : entity_provider_EMPTY_ARRAY, onInput, onChange];
}
//# sourceMappingURL=entity-provider.js.map
;// CONCATENATED MODULE: external ["wp","htmlEntities"]
var external_wp_htmlEntities_namespaceObject = window["wp"]["htmlEntities"];
;// CONCATENATED MODULE: ./packages/core-data/build-module/fetch/__experimental-fetch-link-suggestions.js
/**
 * WordPress dependencies
 */




/**
 * Filters the search by type
 *
 * @typedef { 'post' | 'term' | 'post-format' } WPLinkSearchType
 */

/**
 * A link with an id may be of kind post-type or taxonomy
 *
 * @typedef { 'post-type' | 'taxonomy' } WPKind
 */

/**
 * @typedef WPLinkSearchOptions
 *
 * @property {boolean}          [isInitialSuggestions] Displays initial search suggestions, when true.
 * @property {WPLinkSearchType} [type]                 Filters by search type.
 * @property {string}           [subtype]              Slug of the post-type or taxonomy.
 * @property {number}           [page]                 Which page of results to return.
 * @property {number}           [perPage]              Search results per page.
 */

/**
 * @typedef WPLinkSearchResult
 *
 * @property {number} id     Post or term id.
 * @property {string} url    Link url.
 * @property {string} title  Title of the link.
 * @property {string} type   The taxonomy or post type slug or type URL.
 * @property {WPKind} [kind] Link kind of post-type or taxonomy
 */

/**
 * @typedef WPEditorSettings
 *
 * @property {boolean} [ disablePostFormats ] Disables post formats, when true.
 */

/**
 * Fetches link suggestions from the API.
 *
 * @async
 * @param {string}              search
 * @param {WPLinkSearchOptions} [searchOptions]
 * @param {WPEditorSettings}    [settings]
 *
 * @example
 * ```js
 * import { __experimentalFetchLinkSuggestions as fetchLinkSuggestions } from '@wordpress/core-data';
 *
 * //...
 *
 * export function initialize( id, settings ) {
 *
 * settings.__experimentalFetchLinkSuggestions = (
 *     search,
 *     searchOptions
 * ) => fetchLinkSuggestions( search, searchOptions, settings );
 * ```
 * @return {Promise< WPLinkSearchResult[] >} List of search suggestions
 */

const fetchLinkSuggestions = async (search, searchOptions = {}, settings = {}) => {
  const {
    isInitialSuggestions = false,
    type = undefined,
    subtype = undefined,
    page = undefined,
    perPage = isInitialSuggestions ? 3 : 20
  } = searchOptions;
  const {
    disablePostFormats = false
  } = settings;
  const queries = [];

  if (!type || type === 'post') {
    queries.push(external_wp_apiFetch_default()({
      path: (0,external_wp_url_namespaceObject.addQueryArgs)('/wp/v2/search', {
        search,
        page,
        per_page: perPage,
        type: 'post',
        subtype
      })
    }).then(results => {
      return results.map(result => {
        return { ...result,
          meta: {
            kind: 'post-type',
            subtype
          }
        };
      });
    }).catch(() => []) // fail by returning no results
    );
  }

  if (!type || type === 'term') {
    queries.push(external_wp_apiFetch_default()({
      path: (0,external_wp_url_namespaceObject.addQueryArgs)('/wp/v2/search', {
        search,
        page,
        per_page: perPage,
        type: 'term',
        subtype
      })
    }).then(results => {
      return results.map(result => {
        return { ...result,
          meta: {
            kind: 'taxonomy',
            subtype
          }
        };
      });
    }).catch(() => []));
  }

  if (!disablePostFormats && (!type || type === 'post-format')) {
    queries.push(external_wp_apiFetch_default()({
      path: (0,external_wp_url_namespaceObject.addQueryArgs)('/wp/v2/search', {
        search,
        page,
        per_page: perPage,
        type: 'post-format',
        subtype
      })
    }).then(results => {
      return results.map(result => {
        return { ...result,
          meta: {
            kind: 'taxonomy',
            subtype
          }
        };
      });
    }).catch(() => []));
  }

  return Promise.all(queries).then(results => {
    return results.reduce((accumulator, current) => accumulator.concat(current), //flatten list
    []).filter(
    /**
     * @param {{ id: number }} result
     */
    result => {
      return !!result.id;
    }).slice(0, perPage).map(
    /**
     * @param {{ id: number, url:string, title?:string, subtype?: string, type?: string }} result
     */
    result => {
      var _result$meta;

      return {
        id: result.id,
        url: result.url,
        title: (0,external_wp_htmlEntities_namespaceObject.decodeEntities)(result.title || '') || (0,external_wp_i18n_namespaceObject.__)('(no title)'),
        type: result.subtype || result.type,
        kind: result === null || result === void 0 ? void 0 : (_result$meta = result.meta) === null || _result$meta === void 0 ? void 0 : _result$meta.kind
      };
    });
  });
};

/* harmony default export */ var _experimental_fetch_link_suggestions = (fetchLinkSuggestions);
//# sourceMappingURL=__experimental-fetch-link-suggestions.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/fetch/__experimental-fetch-url-data.js
/**
 * WordPress dependencies
 */


/**
 * A simple in-memory cache for requests.
 * This avoids repeat HTTP requests which may be beneficial
 * for those wishing to preserve low-bandwidth.
 */

const CACHE = new Map();
/**
 * @typedef WPRemoteUrlData
 *
 * @property {string} title contents of the remote URL's `<title>` tag.
 */

/**
 * Fetches data about a remote URL.
 * eg: <title> tag, favicon...etc.
 *
 * @async
 * @param {string}  url     the URL to request details from.
 * @param {Object?} options any options to pass to the underlying fetch.
 * @example
 * ```js
 * import { __experimentalFetchUrlData as fetchUrlData } from '@wordpress/core-data';
 *
 * //...
 *
 * export function initialize( id, settings ) {
 *
 * settings.__experimentalFetchUrlData = (
 * url
 * ) => fetchUrlData( url );
 * ```
 * @return {Promise< WPRemoteUrlData[] >} Remote URL data.
 */

const fetchUrlData = async (url, options = {}) => {
  const endpoint = '/__experimental/url-details';
  const args = {
    url: (0,external_wp_url_namespaceObject.prependHTTP)(url)
  };

  if (!(0,external_wp_url_namespaceObject.isURL)(url)) {
    return Promise.reject(`${url} is not a valid URL.`);
  } // Test for "http" based URL as it is possible for valid
  // yet unusable URLs such as `tel:123456` to be passed.


  const protocol = (0,external_wp_url_namespaceObject.getProtocol)(url);

  if (!(0,external_wp_url_namespaceObject.isValidProtocol)(protocol) || !protocol.startsWith('http') || !/^https?:\/\/[^\/\s]/i.test(url)) {
    return Promise.reject(`${url} does not have a valid protocol. URLs must be "http" based`);
  }

  if (CACHE.has(url)) {
    return CACHE.get(url);
  }

  return external_wp_apiFetch_default()({
    path: (0,external_wp_url_namespaceObject.addQueryArgs)(endpoint, args),
    ...options
  }).then(res => {
    CACHE.set(url, res);
    return res;
  });
};

/* harmony default export */ var _experimental_fetch_url_data = (fetchUrlData);
//# sourceMappingURL=__experimental-fetch-url-data.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/fetch/index.js


//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./packages/core-data/build-module/index.js
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */









 // The entity selectors/resolvers and actions are shortcuts to their generic equivalents
// (getEntityRecord, getEntityRecords, updateEntityRecord, updateEntityRecordss)
// Instead of getEntityRecord, the consumer could use more user-frieldly named selector: getPostType, getTaxonomy...
// The "kind" and the "name" of the entity are combined to generate these shortcuts.

const entitySelectors = defaultEntities.reduce((result, entity) => {
  const {
    kind,
    name
  } = entity;

  result[getMethodName(kind, name)] = (state, key, query) => getEntityRecord(state, kind, name, key, query);

  result[getMethodName(kind, name, 'get', true)] = (state, ...args) => getEntityRecords(state, kind, name, ...args);

  return result;
}, {});
const entityResolvers = defaultEntities.reduce((result, entity) => {
  const {
    kind,
    name
  } = entity;

  result[getMethodName(kind, name)] = (key, query) => resolvers_getEntityRecord(kind, name, key, query);

  const pluralMethodName = getMethodName(kind, name, 'get', true);

  result[pluralMethodName] = (...args) => resolvers_getEntityRecords(kind, name, ...args);

  result[pluralMethodName].shouldInvalidate = (action, ...args) => resolvers_getEntityRecords.shouldInvalidate(action, kind, name, ...args);

  return result;
}, {});
const entityActions = defaultEntities.reduce((result, entity) => {
  const {
    kind,
    name
  } = entity;

  result[getMethodName(kind, name, 'save')] = key => saveEntityRecord(kind, name, key);

  result[getMethodName(kind, name, 'delete')] = (key, query) => deleteEntityRecord(kind, name, key, query);

  return result;
}, {});
const storeConfig = {
  reducer: build_module_reducer,
  controls: { ...build_module_controls,
    ...external_wp_dataControls_namespaceObject.controls
  },
  actions: { ...build_module_actions_namespaceObject,
    ...entityActions,
    ...locks_actions_namespaceObject
  },
  selectors: { ...build_module_selectors_namespaceObject,
    ...entitySelectors,
    ...locks_selectors_namespaceObject
  },
  resolvers: { ...resolvers_namespaceObject,
    ...entityResolvers
  }
};
/**
 * Store definition for the code data namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @type {Object}
 */

const store = (0,external_wp_data_namespaceObject.createReduxStore)(STORE_NAME, storeConfig);
(0,external_wp_data_namespaceObject.register)(store);



//# sourceMappingURL=index.js.map
}();
(window.wp = window.wp || {}).coreData = __webpack_exports__;
/******/ })()
;