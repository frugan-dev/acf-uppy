require('es6-promise/auto')
require('whatwg-fetch')

import Uppy from '@uppy/core';
window.Uppy = Uppy

import FileInput from '@uppy/file-input';
import Tus from '@uppy/tus';
import StatusBar from '@uppy/status-bar';
import Informer from '@uppy/informer';
import prettierBytes from '@transloadit/prettier-bytes';

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
    if (!search || (search.constructor !== Array && search.constructor !== Object)) {
        return false
    }
    return key in search
}

//https://developer.mozilla.org/it/docs/Web/API/Element/closest
function getParentsDataIds(el, parentSelector = 'tr.acf-row', ids = []) {
    //https://stackoverflow.com/a/57449073/3929620
    var parent = el.parentElement.closest(parentSelector)

    if( parent && parent !== el ) {

        ids.push(parent.dataset.id)

        return getParentsDataIds(parent, parentSelector, ids)
    }

    ids.reverse()

    if(uppyL10n.debug) {
        console.log(ids)
    }

    return ids
}

//https://github.com/transloadit/uppy/issues/1575#issuecomment-500245017
function resetFilesObj(files) {
    Object.keys(files).forEach(function(key){
        delete files[key];
    })
}

(function($) {

    //https://stackoverflow.com/a/47647799/3929620
    var uppyObj = {}
    var uppyCounter = 0

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

    function initialize_field( $field ) {

        if(uppyL10n.debug) {
            console.log($field)
        }

        var uppyFileInputSelector = $field[0].querySelector('.UppyFileInput')

        if( uppyFileInputSelector ) {

            var uppyStatusBarSelector = $field[0].querySelector('.UppyStatusBar')
            var uppyInformerSelector = $field[0].querySelector('.UppyInformer')

            //https://developer.mozilla.org/it/docs/Learn/HTML/Howto/Uso_attributi_data
            var fieldName = uppyFileInputSelector.getAttribute('data-fieldName')

            //https://koukia.ca/top-6-ways-to-search-for-a-string-in-javascript-and-performance-benchmarks-ce3e9b81ad31
            var expr = /acfcloneindex/

            if( expr.test(fieldName) ) {

                var ids = getParentsDataIds($field[0])

                if( ids.length > 0 ) {

                    var fieldNameArr = fieldName.split(expr)

                    var slicedIds = ids.slice(-(fieldNameArr.length - 1))

                    var fieldName = ''

                    //https://stackoverflow.com/a/44475397/3929620
                    //https://dmitripavlutin.com/replace-all-string-occurrences-javascript/
                    fieldNameArr.forEach(function(item, i){
                        fieldName += item

                        if(array_key_exists(i, slicedIds)) {
                            fieldName += slicedIds[i]
                        }
                    })
                }
            }

            if( !expr.test(fieldName) ) {

                //https://stackoverflow.com/a/3261380/3929620
                var maxFileSize = uppyFileInputSelector.getAttribute('data-maxFileSize')
                maxFileSize = maxFileSize.length !== 0 ? parseInt(maxFileSize) : null

                var allowedFileTypes = uppyFileInputSelector.getAttribute('data-allowedFileTypes')
                allowedFileTypes = allowedFileTypes.length !== 0 ? JSON.parse(allowedFileTypes) : null

                uppyObj[uppyCounter] = new Uppy({
                    id: 'uppy' + uppyCounter,
                    debug: uppyL10n.debug,
                    logger: Uppy.debugLogger,
                    locale: Uppy.locales[uppyL10n.locale],
                    //https://github.com/transloadit/uppy/issues/1575#issuecomment-700584697
                    autoProceed: true,
                    allowMultipleUploads: true,
                    restrictions: {
                        maxFileSize: maxFileSize,
                        allowedFileTypes: allowedFileTypes,
                        //maxNumberOfFiles: 1,
                    },
                    //https://github.com/transloadit/uppy/issues/1575#issuecomment-500245017
                    //onBeforeFileAdded: (currentFile, files) => resetFilesObj(files)
                })

                uppyObj[uppyCounter]
                    .use(FileInput, {
                        id: 'FileInput' + uppyCounter,
                        target: uppyFileInputSelector,
                        replaceTargetContent: true,
                        //pretty: false,
                    })
                    .use(Tus, {
                        endpoint: uppyL10n.apiPath,
                        limit: 1,
                        headers: {
                            'Field-Name': fieldName,
                            //'Upload-Key': fieldName,
                        },
                    })
                    .use(StatusBar, {
                        target: uppyStatusBarSelector,
                        hideUploadButton: true,
                        hideAfterFinish: true,
                    })
                    //https://community.transloadit.com/t/launching-uppy-informer-errors-manually/14907/2
                    .use(Informer, {
                        target: uppyInformerSelector,
                    })

                uppyObj[uppyCounter]
                    .on('upload-success', (file, response) => {

                        //https://developer.mozilla.org/it/docs/Web/HTML/Element/input/file#Note
                        //https://stackoverflow.com/a/8714421/3929620
                        document.querySelector('input[name="' + fieldName + '"]').value = file.name

                        var span = document.createElement('span')
                        span.classList.add('dashicons', 'dashicons-trash')

                        var a1 = document.createElement('a')
                        //https://developer.mozilla.org/it/docs/Learn/HTML/Howto/Uso_attributi_data
                        a1.dataset.fieldName = fieldName
                        a1.className = 'UppyDelete'
                        a1.href = 'javascript:;'
                        a1.appendChild(span)

                        var a2 = document.createElement('a')

                        //FIXME - same uploaded files with different Upload-Key return same uploadURL
                        //https://github.com/ankitpokhrel/tus-php/blob/37e6527b97d0ff44e730064c2c9fddcc0f9f90c5/src/Tus/Server.php#L545
                        //https://github.com/transloadit/uppy/issues/1520
                        a2.href = response.uploadURL + '/get'

                        //a2.target = '_blank'
                        a2.appendChild(document.createTextNode(file.name))

                        var html = a1.outerHTML + ' ' + a2.outerHTML + ` (${prettierBytes(file.size)})`

                        $field[0].querySelector('.UppyResponse').innerHTML = html
                    })

                //https://github.com/transloadit/uppy/issues/179#issuecomment-312543794
                uppyObj[uppyCounter].reset()

                uppyCounter++
            }
        }
    }

    //http://youmightnotneedjquery.com/
    //https://gomakethings.com/listening-for-click-events-with-vanilla-javascript/
    //https://medium.com/@florenceliang/javascript-event-delegation-and-event-target-vs-event-currenttarget-c9680c3a46d1
    //https://stackoverflow.com/a/55470424/3929620
    document.addEventListener('click', function(e) {
        for (var target = e.target; target && target != this; target = target.parentNode) {
            if (target.matches('.UppyDelete')) {
                e.preventDefault();

                var fieldName = target.dataset.fieldName

                if( fieldName ) {

                    //https://koukia.ca/top-6-ways-to-search-for-a-string-in-javascript-and-performance-benchmarks-ce3e9b81ad31
                    var expr = /acfcloneindex/

                    if( expr.test(fieldName) ) {

                        var ids = getParentsDataIds(target)

                        if( ids.length > 0 ) {

                            var fieldNameArr = fieldName.split(expr)

                            var slicedIds = ids.slice(-(fieldNameArr.length - 1))

                            var fieldName = ''

                            //https://stackoverflow.com/a/44475397/3929620
                            //https://dmitripavlutin.com/replace-all-string-occurrences-javascript/
                            fieldNameArr.forEach(function(item, i){
                                fieldName += item

                                if(array_key_exists(i, slicedIds)) {
                                    fieldName += slicedIds[i]
                                }
                            })
                        }
                    }

                    if( !expr.test(fieldName) ) {

                        //https://stackoverflow.com/a/8714421/3929620
                        document.querySelector('input[name="' + fieldName + '"]').value = ''
                    }
                }

                target.parentNode.innerHTML = ''

                break;
            }
        }
    }, false);

    if( typeof acf.add_action !== 'undefined' ) {

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

        $(document).on('acf/setup_fields', function(e, postbox){

            // find all relevant fields
            $(postbox).find('.field[data-field_type="uppy"]').each(function(){

                // initialize
                initialize_field( $(this) );

            });

        });

    }

})(jQuery);
