(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./js/index.js":
/*!*********************!*\
  !*** ./js/index.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(jQuery) {/* harmony import */ var _uppy_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @uppy/core */ "../node_modules/@uppy/core/lib/index.js");
/* harmony import */ var _uppy_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_uppy_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _uppy_file_input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @uppy/file-input */ "../node_modules/@uppy/file-input/lib/index.js");
/* harmony import */ var _uppy_file_input__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_uppy_file_input__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _uppy_tus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @uppy/tus */ "../node_modules/@uppy/tus/lib/index.js");
/* harmony import */ var _uppy_tus__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_uppy_tus__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _uppy_status_bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @uppy/status-bar */ "../node_modules/@uppy/status-bar/lib/index.js");
/* harmony import */ var _uppy_status_bar__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_uppy_status_bar__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _uppy_informer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @uppy/informer */ "../node_modules/@uppy/informer/lib/index.js");
/* harmony import */ var _uppy_informer__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_uppy_informer__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _transloadit_prettier_bytes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @transloadit/prettier-bytes */ "../node_modules/@transloadit/prettier-bytes/prettierBytes.js");
/* harmony import */ var _transloadit_prettier_bytes__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_transloadit_prettier_bytes__WEBPACK_IMPORTED_MODULE_5__);
__webpack_require__(/*! es6-promise/auto */ "../node_modules/es6-promise/auto.js");

__webpack_require__(/*! whatwg-fetch */ "../node_modules/whatwg-fetch/fetch.js");


window.Uppy = _uppy_core__WEBPACK_IMPORTED_MODULE_0___default.a;





/**
 * https://locutus.io/php/array/array_key_exists/
 * eslint-disable-line camelcase
 * discuss at: https://locutus.io/php/array_key_exists/
 * original by: Kevin van Zonneveld (https://kvz.io)
 * improved by: Felix Geisendoerfer (https://www.debuggable.com/felix)
 * example 1: array_key_exists('kevin', {'kevin': 'van Zonneveld'})
 * returns 1: true
 */

function array_key_exists(key, search) {
  if (!search || search.constructor !== Array && search.constructor !== Object) {
    return false;
  }

  return key in search;
} //https://developer.mozilla.org/it/docs/Web/API/Element/closest


function getParentsDataIds(el, parentSelector = 'tr.acf-row', ids = []) {
  //https://stackoverflow.com/a/57449073/3929620
  var parent = el.parentElement.closest(parentSelector);

  if (parent && parent !== el) {
    ids.push(parent.dataset.id);
    return getParentsDataIds(parent, parentSelector, ids);
  }

  ids.reverse();

  if (uppyL10n.debug) {
    console.log(ids);
  }

  return ids;
} //https://github.com/transloadit/uppy/issues/1575#issuecomment-500245017


function resetFilesObj(files) {
  Object.keys(files).forEach(function (key) {
    delete files[key];
  });
}

(function ($) {
  //https://stackoverflow.com/a/47647799/3929620
  var uppyObj = {};
  var uppyCounter = 0;
  /**
   *  initialize_field
   *
   *  This function will initialize the $field.
   *
   *  @date	30/11/17
   *  @since	5.6.5
   *
   *  @param	n/a
   *  @return	n/a
   */

  function initialize_field($field) {
    if (uppyL10n.debug) {
      console.log($field);
    }

    var uppyFileInputSelector = $field[0].querySelector('.UppyFileInput');

    if (uppyFileInputSelector) {
      var uppyStatusBarSelector = $field[0].querySelector('.UppyStatusBar');
      var uppyInformerSelector = $field[0].querySelector('.UppyInformer'); //https://developer.mozilla.org/it/docs/Learn/HTML/Howto/Uso_attributi_data

      var fieldName = uppyFileInputSelector.getAttribute('data-fieldName'); //https://koukia.ca/top-6-ways-to-search-for-a-string-in-javascript-and-performance-benchmarks-ce3e9b81ad31

      var expr = /acfcloneindex/;

      if (expr.test(fieldName)) {
        var ids = getParentsDataIds($field[0]);

        if (ids.length > 0) {
          var fieldNameArr = fieldName.split(expr);
          var slicedIds = ids.slice(-(fieldNameArr.length - 1));
          var fieldName = ''; //https://stackoverflow.com/a/44475397/3929620
          //https://dmitripavlutin.com/replace-all-string-occurrences-javascript/

          fieldNameArr.forEach(function (item, i) {
            fieldName += item;

            if (array_key_exists(i, slicedIds)) {
              fieldName += slicedIds[i];
            }
          });
        }
      }

      if (!expr.test(fieldName)) {
        //https://stackoverflow.com/a/3261380/3929620
        var maxFileSize = uppyFileInputSelector.getAttribute('data-maxFileSize');
        maxFileSize = maxFileSize.length !== 0 ? parseInt(maxFileSize) : null;
        var allowedFileTypes = uppyFileInputSelector.getAttribute('data-allowedFileTypes');
        allowedFileTypes = allowedFileTypes.length !== 0 ? JSON.parse(allowedFileTypes) : null;
        uppyObj[uppyCounter] = new _uppy_core__WEBPACK_IMPORTED_MODULE_0___default.a({
          id: 'uppy' + uppyCounter,
          debug: uppyL10n.debug,
          logger: _uppy_core__WEBPACK_IMPORTED_MODULE_0___default.a.debugLogger,
          locale: _uppy_core__WEBPACK_IMPORTED_MODULE_0___default.a.locales[uppyL10n.locale],
          //https://github.com/transloadit/uppy/issues/1575#issuecomment-700584697
          autoProceed: true,
          allowMultipleUploads: true,
          restrictions: {
            maxFileSize: maxFileSize,
            allowedFileTypes: allowedFileTypes //maxNumberOfFiles: 1,

          } //https://github.com/transloadit/uppy/issues/1575#issuecomment-500245017
          //onBeforeFileAdded: (currentFile, files) => resetFilesObj(files)

        });
        uppyObj[uppyCounter].use(_uppy_file_input__WEBPACK_IMPORTED_MODULE_1___default.a, {
          id: 'FileInput' + uppyCounter,
          target: uppyFileInputSelector,
          replaceTargetContent: true //pretty: false,

        }).use(_uppy_tus__WEBPACK_IMPORTED_MODULE_2___default.a, {
          endpoint: uppyL10n.apiPath,
          limit: 1,
          headers: {
            'Field-Name': fieldName //'Upload-Key': fieldName,

          }
        }).use(_uppy_status_bar__WEBPACK_IMPORTED_MODULE_3___default.a, {
          target: uppyStatusBarSelector,
          hideUploadButton: true,
          hideAfterFinish: true
        }) //https://community.transloadit.com/t/launching-uppy-informer-errors-manually/14907/2
        .use(_uppy_informer__WEBPACK_IMPORTED_MODULE_4___default.a, {
          target: uppyInformerSelector
        });
        uppyObj[uppyCounter].on('upload-success', (file, response) => {
          //https://developer.mozilla.org/it/docs/Web/HTML/Element/input/file#Note
          //https://stackoverflow.com/a/8714421/3929620
          document.querySelector('input[name="' + fieldName + '"]').value = file.name;
          var span = document.createElement('span');
          span.classList.add('dashicons', 'dashicons-trash');
          var a1 = document.createElement('a'); //https://developer.mozilla.org/it/docs/Learn/HTML/Howto/Uso_attributi_data

          a1.dataset.fieldName = fieldName;
          a1.className = 'UppyDelete';
          a1.href = 'javascript:;';
          a1.appendChild(span);
          var a2 = document.createElement('a'); //FIXME - same uploaded files with different Upload-Key return same uploadURL
          //https://github.com/ankitpokhrel/tus-php/blob/37e6527b97d0ff44e730064c2c9fddcc0f9f90c5/src/Tus/Server.php#L545
          //https://github.com/transloadit/uppy/issues/1520

          a2.href = response.uploadURL + '/get'; //a2.target = '_blank'

          a2.appendChild(document.createTextNode(file.name));
          var html = a1.outerHTML + ' ' + a2.outerHTML + ` (${_transloadit_prettier_bytes__WEBPACK_IMPORTED_MODULE_5___default()(file.size)})`;
          $field[0].querySelector('.UppyResponse').innerHTML = html;
        }); //https://github.com/transloadit/uppy/issues/179#issuecomment-312543794

        uppyObj[uppyCounter].reset();
        uppyCounter++;
      }
    }
  } //http://youmightnotneedjquery.com/
  //https://gomakethings.com/listening-for-click-events-with-vanilla-javascript/
  //https://medium.com/@florenceliang/javascript-event-delegation-and-event-target-vs-event-currenttarget-c9680c3a46d1
  //https://stackoverflow.com/a/55470424/3929620


  document.addEventListener('click', function (e) {
    for (var target = e.target; target && target != this; target = target.parentNode) {
      if (target.matches('.UppyDelete')) {
        e.preventDefault();
        var fieldName = target.dataset.fieldName;

        if (fieldName) {
          //https://koukia.ca/top-6-ways-to-search-for-a-string-in-javascript-and-performance-benchmarks-ce3e9b81ad31
          var expr = /acfcloneindex/;

          if (expr.test(fieldName)) {
            var ids = getParentsDataIds(target);

            if (ids.length > 0) {
              var fieldNameArr = fieldName.split(expr);
              var slicedIds = ids.slice(-(fieldNameArr.length - 1));
              var fieldName = ''; //https://stackoverflow.com/a/44475397/3929620
              //https://dmitripavlutin.com/replace-all-string-occurrences-javascript/

              fieldNameArr.forEach(function (item, i) {
                fieldName += item;

                if (array_key_exists(i, slicedIds)) {
                  fieldName += slicedIds[i];
                }
              });
            }
          }

          if (!expr.test(fieldName)) {
            //https://stackoverflow.com/a/8714421/3929620
            document.querySelector('input[name="' + fieldName + '"]').value = '';
          }
        }

        target.parentNode.innerHTML = '';
        break;
      }
    }
  }, false);

  if (typeof acf.add_action !== 'undefined') {
    /*
    *  ready & append (ACF5)
    *
    *  These two events are called when a field element is ready for initizliation.
    *  - ready: on page load similar to $(document).ready()
    *  - append: on new DOM elements appended via repeater field or other AJAX calls
    *
    *  @param	n/a
    *  @return	n/a
    */
    acf.add_action('ready_field/type=uppy', initialize_field);
    acf.add_action('append_field/type=uppy', initialize_field);
  } else {
    /*
    *  acf/setup_fields (ACF4)
    *
    *  These single event is called when a field element is ready for initizliation.
    *
    *  @param	event		an event object. This can be ignored
    *  @param	element		An element which contains the new HTML
    *  @return	n/a
    */
    $(document).on('acf/setup_fields', function (e, postbox) {
      // find all relevant fields
      $(postbox).find('.field[data-field_type="uppy"]').each(function () {
        // initialize
        initialize_field($(this));
      });
    });
  }
})(jQuery);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "jquery")))

/***/ }),

/***/ "./scss/index.scss":
/*!*************************!*\
  !*** ./scss/index.scss ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 0:
/*!*********************************************!*\
  !*** multi ./js/index.js ./scss/index.scss ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./js/index.js */"./js/index.js");
module.exports = __webpack_require__(/*! ./scss/index.scss */"./scss/index.scss");


/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })

},[[0,"runtime~acf-uppy","npm/uppy","npm/tus-js-client","npm/cuid","npm/es6-promise","npm/transloadit","npm/classnames","npm/js-base64","npm/lodash.throttle","npm/mime-match","npm/namespace-emitter","npm/preact","npm/process","npm/querystringify","npm/requires-port","npm/url-parse","npm/webpack","npm/whatwg-fetch","npm/wildcard"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zY3NzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwialF1ZXJ5XCIiXSwibmFtZXMiOlsicmVxdWlyZSIsIndpbmRvdyIsIlVwcHkiLCJhcnJheV9rZXlfZXhpc3RzIiwia2V5Iiwic2VhcmNoIiwiY29uc3RydWN0b3IiLCJBcnJheSIsIk9iamVjdCIsImdldFBhcmVudHNEYXRhSWRzIiwiZWwiLCJwYXJlbnRTZWxlY3RvciIsImlkcyIsInBhcmVudCIsInBhcmVudEVsZW1lbnQiLCJjbG9zZXN0IiwicHVzaCIsImRhdGFzZXQiLCJpZCIsInJldmVyc2UiLCJ1cHB5TDEwbiIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsInJlc2V0RmlsZXNPYmoiLCJmaWxlcyIsImtleXMiLCJmb3JFYWNoIiwiJCIsInVwcHlPYmoiLCJ1cHB5Q291bnRlciIsImluaXRpYWxpemVfZmllbGQiLCIkZmllbGQiLCJ1cHB5RmlsZUlucHV0U2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yIiwidXBweVN0YXR1c0JhclNlbGVjdG9yIiwidXBweUluZm9ybWVyU2VsZWN0b3IiLCJmaWVsZE5hbWUiLCJnZXRBdHRyaWJ1dGUiLCJleHByIiwidGVzdCIsImxlbmd0aCIsImZpZWxkTmFtZUFyciIsInNwbGl0Iiwic2xpY2VkSWRzIiwic2xpY2UiLCJpdGVtIiwiaSIsIm1heEZpbGVTaXplIiwicGFyc2VJbnQiLCJhbGxvd2VkRmlsZVR5cGVzIiwiSlNPTiIsInBhcnNlIiwibG9nZ2VyIiwiZGVidWdMb2dnZXIiLCJsb2NhbGUiLCJsb2NhbGVzIiwiYXV0b1Byb2NlZWQiLCJhbGxvd011bHRpcGxlVXBsb2FkcyIsInJlc3RyaWN0aW9ucyIsInVzZSIsIkZpbGVJbnB1dCIsInRhcmdldCIsInJlcGxhY2VUYXJnZXRDb250ZW50IiwiVHVzIiwiZW5kcG9pbnQiLCJhcGlQYXRoIiwibGltaXQiLCJoZWFkZXJzIiwiU3RhdHVzQmFyIiwiaGlkZVVwbG9hZEJ1dHRvbiIsImhpZGVBZnRlckZpbmlzaCIsIkluZm9ybWVyIiwib24iLCJmaWxlIiwicmVzcG9uc2UiLCJkb2N1bWVudCIsInZhbHVlIiwibmFtZSIsInNwYW4iLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiYTEiLCJjbGFzc05hbWUiLCJocmVmIiwiYXBwZW5kQ2hpbGQiLCJhMiIsInVwbG9hZFVSTCIsImNyZWF0ZVRleHROb2RlIiwiaHRtbCIsIm91dGVySFRNTCIsInByZXR0aWVyQnl0ZXMiLCJzaXplIiwiaW5uZXJIVE1MIiwicmVzZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInBhcmVudE5vZGUiLCJtYXRjaGVzIiwicHJldmVudERlZmF1bHQiLCJhY2YiLCJhZGRfYWN0aW9uIiwicG9zdGJveCIsImZpbmQiLCJlYWNoIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBLG1CQUFPLENBQUMsNkRBQUQsQ0FBUDs7QUFDQUEsbUJBQU8sQ0FBQywyREFBRCxDQUFQOztBQUVBO0FBQ0FDLE1BQU0sQ0FBQ0MsSUFBUCxHQUFjQSxpREFBZDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsU0FBU0MsZ0JBQVQsQ0FBMEJDLEdBQTFCLEVBQStCQyxNQUEvQixFQUF1QztBQUNuQyxNQUFJLENBQUNBLE1BQUQsSUFBWUEsTUFBTSxDQUFDQyxXQUFQLEtBQXVCQyxLQUF2QixJQUFnQ0YsTUFBTSxDQUFDQyxXQUFQLEtBQXVCRSxNQUF2RSxFQUFnRjtBQUM1RSxXQUFPLEtBQVA7QUFDSDs7QUFDRCxTQUFPSixHQUFHLElBQUlDLE1BQWQ7QUFDSCxDLENBRUQ7OztBQUNBLFNBQVNJLGlCQUFULENB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ZixFQUF5Q3ZFLGdCQUF6QztBQUdILEdBakJELE1BaUJPO0FBRUg7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRVFILEtBQUMsQ0FBQ2dELFFBQUQsQ0FBRCxDQUFZSCxFQUFaLENBQWUsa0JBQWYsRUFBbUMsVUFBU3dCLENBQVQsRUFBWU0sT0FBWixFQUFvQjtBQUVuRDtBQUNBM0UsT0FBQyxDQUFDMkUsT0FBRCxDQUFELENBQVdDLElBQVgsQ0FBZ0IsZ0NBQWhCLEVBQWtEQyxJQUFsRCxDQUF1RCxZQUFVO0FBRTdEO0FBQ0ExRSx3QkFBZ0IsQ0FBRUgsQ0FBQyxDQUFDLElBQUQsQ0FBSCxDQUFoQjtBQUVILE9BTEQ7QUFPSCxLQVZEO0FBWUg7QUFFSixDQXpQRCxFQXlQRzhFLE1BelBILEU7Ozs7Ozs7Ozs7OztBQ3hEQSx1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsd0IiLCJmaWxlIjoianMvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJ2VzNi1wcm9taXNlL2F1dG8nKVxucmVxdWlyZSgnd2hhdHdnLWZldGNoJylcblxuaW1wb3J0IFVwcHkgZnJvbSAnQHVwcHkvY29yZSc7XG53aW5kb3cuVXBweSA9IFVwcHlcblxuaW1wb3J0IEZpbGVJbnB1dCBmcm9tICdAdXBweS9maWxlLWlucHV0JztcbmltcG9ydCBUdXMgZnJvbSAnQHVwcHkvdHVzJztcbmltcG9ydCBTdGF0dXNCYXIgZnJvbSAnQHVwcHkvc3RhdHVzLWJhcic7XG5pbXBvcnQgSW5mb3JtZXIgZnJvbSAnQHVwcHkvaW5mb3JtZXInO1xuaW1wb3J0IHByZXR0aWVyQnl0ZXMgZnJvbSAnQHRyYW5zbG9hZGl0L3ByZXR0aWVyLWJ5dGVzJztcblxuLyoqXG4gKiBodHRwczovL2xvY3V0dXMuaW8vcGhwL2FycmF5L2FycmF5X2tleV9leGlzdHMvXG4gKiBlc2xpbnQtZGlzYWJsZS1saW5lIGNhbWVsY2FzZVxuICogZGlzY3VzcyBhdDogaHR0cHM6Ly9sb2N1dHVzLmlvL3BocC9hcnJheV9rZXlfZXhpc3RzL1xuICogb3JpZ2luYWwgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHBzOi8va3Z6LmlvKVxuICogaW1wcm92ZWQgYnk6IEZlbGl4IEdlaXNlbmRvZXJmZXIgKGh0dHBzOi8vd3d3LmRlYnVnZ2FibGUuY29tL2ZlbGl4KVxuICogZXhhbXBsZSAxOiBhcnJheV9rZXlfZXhpc3RzKCdrZXZpbicsIHsna2V2aW4nOiAndmFuIFpvbm5ldmVsZCd9KVxuICogcmV0dXJucyAxOiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGFycmF5X2tleV9leGlzdHMoa2V5LCBzZWFyY2gpIHtcbiAgICBpZiAoIXNlYXJjaCB8fCAoc2VhcmNoLmNvbnN0cnVjdG9yICE9PSBBcnJheSAmJiBzZWFyY2guY29uc3RydWN0b3IgIT09IE9iamVjdCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiBrZXkgaW4gc2VhcmNoXG59XG5cbi8vaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvaXQvZG9jcy9XZWIvQVBJL0VsZW1lbnQvY2xvc2VzdFxuZnVuY3Rpb24gZ2V0UGFyZW50c0RhdGFJZHMoZWwsIHBhcmVudFNlbGVjdG9yID0gJ3RyLmFjZi1yb3cnLCBpZHMgPSBbXSkge1xuICAgIC8vaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU3NDQ5MDczLzM5Mjk2MjBcbiAgICB2YXIgcGFyZW50ID0gZWwucGFyZW50RWxlbWVudC5jbG9zZXN0KHBhcmVudFNlbGVjdG9yKVxuXG4gICAgaWYoIHBhcmVudCAmJiBwYXJlbnQgIT09IGVsICkge1xuXG4gICAgICAgIGlkcy5wdXNoKHBhcmVudC5kYXRhc2V0LmlkKVxuXG4gICAgICAgIHJldHVybiBnZXRQYXJlbnRzRGF0YUlkcyhwYXJlbnQsIHBhcmVudFNlbGVjdG9yLCBpZHMpXG4gICAgfVxuXG4gICAgaWRzLnJldmVyc2UoKVxuXG4gICAgaWYodXBweUwxMG4uZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coaWRzKVxuICAgIH1cblxuICAgIHJldHVybiBpZHNcbn1cblxuLy9odHRwczovL2dpdGh1Yi5jb20vdHJhbnNsb2FkaXQvdXBweS9pc3N1ZXMvMTU3NSNpc3N1ZWNvbW1lbnQtNTAwMjQ1MDE3XG5mdW5jdGlvbiByZXNldEZpbGVzT2JqKGZpbGVzKSB7XG4gICAgT2JqZWN0LmtleXMoZmlsZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgZGVsZXRlIGZpbGVzW2tleV07XG4gICAgfSlcbn1cblxuKGZ1bmN0aW9uKCQpIHtcblxuICAgIC8vaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ3NjQ3Nzk5LzM5Mjk2MjBcbiAgICB2YXIgdXBweU9iaiA9IHt9XG4gICAgdmFyIHVwcHlDb3VudGVyID0gMFxuXG4gICAgLyoqXG4gICAgICogIGluaXRpYWxpemVfZmllbGRcbiAgICAgKlxuICAgICAqICBUaGlzIGZ1bmN0aW9uIHdpbGwgaW5pdGlhbGl6ZSB0aGUgJGZpZWxkLlxuICAgICAqXG4gICAgICogIEBkYXRlXHQzMC8xMS8xN1xuICAgICAqICBAc2luY2VcdDUuNi41XG4gICAgICpcbiAgICAgKiAgQHBhcmFtXHRuL2FcbiAgICAgKiAgQHJldHVyblx0bi9hXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplX2ZpZWxkKCAkZmllbGQgKSB7XG5cbiAgICAgICAgaWYodXBweUwxMG4uZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRmaWVsZClcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB1cHB5RmlsZUlucHV0U2VsZWN0b3IgPSAkZmllbGRbMF0ucXVlcnlTZWxlY3RvcignLlVwcHlGaWxlSW5wdXQnKVxuXG4gICAgICAgIGlmKCB1cHB5RmlsZUlucHV0U2VsZWN0b3IgKSB7XG5cbiAgICAgICAgICAgIHZhciB1cHB5U3RhdHVzQmFyU2VsZWN0b3IgPSAkZmllbGRbMF0ucXVlcnlTZWxlY3RvcignLlVwcHlTdGF0dXNCYXInKVxuICAgICAgICAgICAgdmFyIHVwcHlJbmZvcm1lclNlbGVjdG9yID0gJGZpZWxkWzBdLnF1ZXJ5U2VsZWN0b3IoJy5VcHB5SW5mb3JtZXInKVxuXG4gICAgICAgICAgICAvL2h0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2l0L2RvY3MvTGVhcm4vSFRNTC9Ib3d0by9Vc29fYXR0cmlidXRpX2RhdGFcbiAgICAgICAgICAgIHZhciBmaWVsZE5hbWUgPSB1cHB5RmlsZUlucHV0U2VsZWN0b3IuZ2V0QXR0cmlidXRlKCdkYXRhLWZpZWxkTmFtZScpXG5cbiAgICAgICAgICAgIC8vaHR0cHM6Ly9rb3VraWEuY2EvdG9wLTYtd2F5cy10by1zZWFyY2gtZm9yLWEtc3RyaW5nLWluLWphdmFzY3JpcHQtYW5kLXBlcmZvcm1hbmNlLWJlbmNobWFya3MtY2UzZTliODFhZDMxXG4gICAgICAgICAgICB2YXIgZXhwciA9IC9hY2ZjbG9uZWluZGV4L1xuXG4gICAgICAgICAgICBpZiggZXhwci50ZXN0KGZpZWxkTmFtZSkgKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgaWRzID0gZ2V0UGFyZW50c0RhdGFJZHMoJGZpZWxkWzBdKVxuXG4gICAgICAgICAgICAgICAgaWYoIGlkcy5sZW5ndGggPiAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZE5hbWVBcnIgPSBmaWVsZE5hbWUuc3BsaXQoZXhwcilcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc2xpY2VkSWRzID0gaWRzLnNsaWNlKC0oZmllbGROYW1lQXJyLmxlbmd0aCAtIDEpKVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZE5hbWUgPSAnJ1xuXG4gICAgICAgICAgICAgICAgICAgIC8vaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ0NDc1Mzk3LzM5Mjk2MjBcbiAgICAgICAgICAgICAgICAgICAgLy9odHRwczovL2RtaXRyaXBhdmx1dGluLmNvbS9yZXBsYWNlLWFsbC1zdHJpbmctb2NjdXJyZW5jZXMtamF2YXNjcmlwdC9cbiAgICAgICAgICAgICAgICAgICAgZmllbGROYW1lQXJyLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZE5hbWUgKz0gaXRlbVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihhcnJheV9rZXlfZXhpc3RzKGksIHNsaWNlZElkcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZE5hbWUgKz0gc2xpY2VkSWRzW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiggIWV4cHIudGVzdChmaWVsZE5hbWUpICkge1xuXG4gICAgICAgICAgICAgICAgLy9odHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzI2MTM4MC8zOTI5NjIwXG4gICAgICAgICAgICAgICAgdmFyIG1heEZpbGVTaXplID0gdXBweUZpbGVJbnB1dFNlbGVjdG9yLmdldEF0dHJpYnV0ZSgnZGF0YS1tYXhGaWxlU2l6ZScpXG4gICAgICAgICAgICAgICAgbWF4RmlsZVNpemUgPSBtYXhGaWxlU2l6ZS5sZW5ndGggIT09IDAgPyBwYXJzZUludChtYXhGaWxlU2l6ZSkgOiBudWxsXG5cbiAgICAgICAgICAgICAgICB2YXIgYWxsb3dlZEZpbGVUeXBlcyA9IHVwcHlGaWxlSW5wdXRTZWxlY3Rvci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWxsb3dlZEZpbGVUeXBlcycpXG4gICAgICAgICAgICAgICAgYWxsb3dlZEZpbGVUeXBlcyA9IGFsbG93ZWRGaWxlVHlwZXMubGVuZ3RoICE9PSAwID8gSlNPTi5wYXJzZShhbGxvd2VkRmlsZVR5cGVzKSA6IG51bGxcblxuICAgICAgICAgICAgICAgIHVwcHlPYmpbdXBweUNvdW50ZXJdID0gbmV3IFVwcHkoe1xuICAgICAgICAgICAgICAgICAgICBpZDogJ3VwcHknICsgdXBweUNvdW50ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnOiB1cHB5TDEwbi5kZWJ1ZyxcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyOiBVcHB5LmRlYnVnTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICBsb2NhbGU6IFVwcHkubG9jYWxlc1t1cHB5TDEwbi5sb2NhbGVdLFxuICAgICAgICAgICAgICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS90cmFuc2xvYWRpdC91cHB5L2lzc3Vlcy8xNTc1I2lzc3VlY29tbWVudC03MDA1ODQ2OTdcbiAgICAgICAgICAgICAgICAgICAgYXV0b1Byb2NlZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGFsbG93TXVsdGlwbGVVcGxvYWRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICByZXN0cmljdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEZpbGVTaXplOiBtYXhGaWxlU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93ZWRGaWxlVHlwZXM6IGFsbG93ZWRGaWxlVHlwZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAvL21heE51bWJlck9mRmlsZXM6IDEsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL3RyYW5zbG9hZGl0L3VwcHkvaXNzdWVzLzE1NzUjaXNzdWVjb21tZW50LTUwMDI0NTAxN1xuICAgICAgICAgICAgICAgICAgICAvL29uQmVmb3JlRmlsZUFkZGVkOiAoY3VycmVudEZpbGUsIGZpbGVzKSA9PiByZXNldEZpbGVzT2JqKGZpbGVzKVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICB1cHB5T2JqW3VwcHlDb3VudGVyXVxuICAgICAgICAgICAgICAgICAgICAudXNlKEZpbGVJbnB1dCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdGaWxlSW5wdXQnICsgdXBweUNvdW50ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHVwcHlGaWxlSW5wdXRTZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxhY2VUYXJnZXRDb250ZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy9wcmV0dHk6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudXNlKFR1cywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnQ6IHVwcHlMMTBuLmFwaVBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRmllbGQtTmFtZSc6IGZpZWxkTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLydVcGxvYWQtS2V5JzogZmllbGROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnVzZShTdGF0dXNCYXIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdXBweVN0YXR1c0JhclNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGlkZVVwbG9hZEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZGVBZnRlckZpbmlzaDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLy9odHRwczovL2NvbW11bml0eS50cmFuc2xvYWRpdC5jb20vdC9sYXVuY2hpbmctdXBweS1pbmZvcm1lci1lcnJvcnMtbWFudWFsbHkvMTQ5MDcvMlxuICAgICAgICAgICAgICAgICAgICAudXNlKEluZm9ybWVyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHVwcHlJbmZvcm1lclNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgdXBweU9ialt1cHB5Q291bnRlcl1cbiAgICAgICAgICAgICAgICAgICAgLm9uKCd1cGxvYWQtc3VjY2VzcycsIChmaWxlLCByZXNwb25zZSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2h0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2l0L2RvY3MvV2ViL0hUTUwvRWxlbWVudC9pbnB1dC9maWxlI05vdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg3MTQ0MjEvMzkyOTYyMFxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cIicgKyBmaWVsZE5hbWUgKyAnXCJdJykudmFsdWUgPSBmaWxlLm5hbWVcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW4uY2xhc3NMaXN0LmFkZCgnZGFzaGljb25zJywgJ2Rhc2hpY29ucy10cmFzaCcpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy9odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9pdC9kb2NzL0xlYXJuL0hUTUwvSG93dG8vVXNvX2F0dHJpYnV0aV9kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICBhMS5kYXRhc2V0LmZpZWxkTmFtZSA9IGZpZWxkTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgYTEuY2xhc3NOYW1lID0gJ1VwcHlEZWxldGUnXG4gICAgICAgICAgICAgICAgICAgICAgICBhMS5ocmVmID0gJ2phdmFzY3JpcHQ6OydcbiAgICAgICAgICAgICAgICAgICAgICAgIGExLmFwcGVuZENoaWxkKHNwYW4pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0ZJWE1FIC0gc2FtZSB1cGxvYWRlZCBmaWxlcyB3aXRoIGRpZmZlcmVudCBVcGxvYWQtS2V5IHJldHVybiBzYW1lIHVwbG9hZFVSTFxuICAgICAgICAgICAgICAgICAgICAgICAgLy9odHRwczovL2dpdGh1Yi5jb20vYW5raXRwb2tocmVsL3R1cy1waHAvYmxvYi8zN2U2NTI3Yjk3ZDBmZjQ0ZTczMDA2NGMyYzlmZGRjYzBmOWY5MGM1L3NyYy9UdXMvU2VydmVyLnBocCNMNTQ1XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS90cmFuc2xvYWRpdC91cHB5L2lzc3Vlcy8xNTIwXG4gICAgICAgICAgICAgICAgICAgICAgICBhMi5ocmVmID0gcmVzcG9uc2UudXBsb2FkVVJMICsgJy9nZXQnXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYTIudGFyZ2V0ID0gJ19ibGFuaydcbiAgICAgICAgICAgICAgICAgICAgICAgIGEyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGZpbGUubmFtZSkpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gYTEub3V0ZXJIVE1MICsgJyAnICsgYTIub3V0ZXJIVE1MICsgYCAoJHtwcmV0dGllckJ5dGVzKGZpbGUuc2l6ZSl9KWBcblxuICAgICAgICAgICAgICAgICAgICAgICAgJGZpZWxkWzBdLnF1ZXJ5U2VsZWN0b3IoJy5VcHB5UmVzcG9uc2UnKS5pbm5lckhUTUwgPSBodG1sXG4gICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS90cmFuc2xvYWRpdC91cHB5L2lzc3Vlcy8xNzkjaXNzdWVjb21tZW50LTMxMjU0Mzc5NFxuICAgICAgICAgICAgICAgIHVwcHlPYmpbdXBweUNvdW50ZXJdLnJlc2V0KClcblxuICAgICAgICAgICAgICAgIHVwcHlDb3VudGVyKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vaHR0cDovL3lvdW1pZ2h0bm90bmVlZGpxdWVyeS5jb20vXG4gICAgLy9odHRwczovL2dvbWFrZXRoaW5ncy5jb20vbGlzdGVuaW5nLWZvci1jbGljay1ldmVudHMtd2l0aC12YW5pbGxhLWphdmFzY3JpcHQvXG4gICAgLy9odHRwczovL21lZGl1bS5jb20vQGZsb3JlbmNlbGlhbmcvamF2YXNjcmlwdC1ldmVudC1kZWxlZ2F0aW9uLWFuZC1ldmVudC10YXJnZXQtdnMtZXZlbnQtY3VycmVudHRhcmdldC1jOTY4MGMzYTQ2ZDFcbiAgICAvL2h0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81NTQ3MDQyNC8zOTI5NjIwXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGZvciAodmFyIHRhcmdldCA9IGUudGFyZ2V0OyB0YXJnZXQgJiYgdGFyZ2V0ICE9IHRoaXM7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0Lm1hdGNoZXMoJy5VcHB5RGVsZXRlJykpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZmllbGROYW1lID0gdGFyZ2V0LmRhdGFzZXQuZmllbGROYW1lXG5cbiAgICAgICAgICAgICAgICBpZiggZmllbGROYW1lICkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vaHR0cHM6Ly9rb3VraWEuY2EvdG9wLTYtd2F5cy10by1zZWFyY2gtZm9yLWEtc3RyaW5nLWluLWphdmFzY3JpcHQtYW5kLXBlcmZvcm1hbmNlLWJlbmNobWFya3MtY2UzZTliODFhZDMxXG4gICAgICAgICAgICAgICAgICAgIHZhciBleHByID0gL2FjZmNsb25laW5kZXgvXG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIGV4cHIudGVzdChmaWVsZE5hbWUpICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWRzID0gZ2V0UGFyZW50c0RhdGFJZHModGFyZ2V0KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggaWRzLmxlbmd0aCA+IDAgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGROYW1lQXJyID0gZmllbGROYW1lLnNwbGl0KGV4cHIpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2xpY2VkSWRzID0gaWRzLnNsaWNlKC0oZmllbGROYW1lQXJyLmxlbmd0aCAtIDEpKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkTmFtZSA9ICcnXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2h0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80NDQ3NTM5Ny8zOTI5NjIwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9odHRwczovL2RtaXRyaXBhdmx1dGluLmNvbS9yZXBsYWNlLWFsbC1zdHJpbmctb2NjdXJyZW5jZXMtamF2YXNjcmlwdC9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZE5hbWVBcnIuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGROYW1lICs9IGl0ZW1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihhcnJheV9rZXlfZXhpc3RzKGksIHNsaWNlZElkcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkTmFtZSArPSBzbGljZWRJZHNbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiggIWV4cHIudGVzdChmaWVsZE5hbWUpICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2h0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84NzE0NDIxLzM5Mjk2MjBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCInICsgZmllbGROYW1lICsgJ1wiXScpLnZhbHVlID0gJydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRhcmdldC5wYXJlbnROb2RlLmlubmVySFRNTCA9ICcnXG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIGZhbHNlKTtcblxuICAgIGlmKCB0eXBlb2YgYWNmLmFkZF9hY3Rpb24gIT09ICd1bmRlZmluZWQnICkge1xuXG4gICAgICAgIC8qXG4gICAgICAgICogIHJlYWR5ICYgYXBwZW5kIChBQ0Y1KVxuICAgICAgICAqXG4gICAgICAgICogIFRoZXNlIHR3byBldmVudHMgYXJlIGNhbGxlZCB3aGVuIGEgZmllbGQgZWxlbWVudCBpcyByZWFkeSBmb3IgaW5pdGl6bGlhdGlvbi5cbiAgICAgICAgKiAgLSByZWFkeTogb24gcGFnZSBsb2FkIHNpbWlsYXIgdG8gJChkb2N1bWVudCkucmVhZHkoKVxuICAgICAgICAqICAtIGFwcGVuZDogb24gbmV3IERPTSBlbGVtZW50cyBhcHBlbmRlZCB2aWEgcmVwZWF0ZXIgZmllbGQgb3Igb3RoZXIgQUpBWCBjYWxsc1xuICAgICAgICAqXG4gICAgICAgICogIEBwYXJhbVx0bi9hXG4gICAgICAgICogIEByZXR1cm5cdG4vYVxuICAgICAgICAqL1xuXG4gICAgICAgIGFjZi5hZGRfYWN0aW9uKCdyZWFkeV9maWVsZC90eXBlPXVwcHknLCBpbml0aWFsaXplX2ZpZWxkKTtcbiAgICAgICAgYWNmLmFkZF9hY3Rpb24oJ2FwcGVuZF9maWVsZC90eXBlPXVwcHknLCBpbml0aWFsaXplX2ZpZWxkKTtcblxuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICAvKlxuICAgICAgICAqICBhY2Yvc2V0dXBfZmllbGRzIChBQ0Y0KVxuICAgICAgICAqXG4gICAgICAgICogIFRoZXNlIHNpbmdsZSBldmVudCBpcyBjYWxsZWQgd2hlbiBhIGZpZWxkIGVsZW1lbnQgaXMgcmVhZHkgZm9yIGluaXRpemxpYXRpb24uXG4gICAgICAgICpcbiAgICAgICAgKiAgQHBhcmFtXHRldmVudFx0XHRhbiBldmVudCBvYmplY3QuIFRoaXMgY2FuIGJlIGlnbm9yZWRcbiAgICAgICAgKiAgQHBhcmFtXHRlbGVtZW50XHRcdEFuIGVsZW1lbnQgd2hpY2ggY29udGFpbnMgdGhlIG5ldyBIVE1MXG4gICAgICAgICogIEByZXR1cm5cdG4vYVxuICAgICAgICAqL1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdhY2Yvc2V0dXBfZmllbGRzJywgZnVuY3Rpb24oZSwgcG9zdGJveCl7XG5cbiAgICAgICAgICAgIC8vIGZpbmQgYWxsIHJlbGV2YW50IGZpZWxkc1xuICAgICAgICAgICAgJChwb3N0Ym94KS5maW5kKCcuZmllbGRbZGF0YS1maWVsZF90eXBlPVwidXBweVwiXScpLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxpemVcbiAgICAgICAgICAgICAgICBpbml0aWFsaXplX2ZpZWxkKCAkKHRoaXMpICk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59KShqUXVlcnkpO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwibW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7Il0sInNvdXJjZVJvb3QiOiIifQ==