=== Advanced Custom Fields: Uppy Field ===
Contributors: Frugan (https://about.me/frugan)
Tags:
Requires at least: 3.6.0
Tested up to: 5.6.0
Stable tag: trunk
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Uppy Field for Advanced Custom Fields

== Description ==

_ACF Uppy Field_ is a WordPress plugin that adds a new "Uppy" custom field to the list of fields of the [Advanced Custom Fields](https://www.advancedcustomfields.com) plugin.
This "Uppy" custom field allows you to overcome the limits of the default "File" field present in ACF, and to __upload files of all types and sizes__ via the [TUS protocol](https://tus.io) and the [Uppy JS uploader](https://uppy.io), regardless of the limits set on the server side (there is no need to increase the parameters _upload_max_filesize_, _post_max_size_, _max_execution_time_, _memory_limit_, etc.).

= Compatibility =

This ACF field type is compatible with:
* ACF 5

== Installation ==

1. Copy the `acf-uppy` folder into your `wp-content/plugins` folder
2. Activate the `Advanced Custom Fields: Uppy` plugin via the plugins admin page
3. Create a new field via ACF and select the `Uppy` type
4. Read the description above for usage instructions

== Changelog ==

= 0.1.0 =
* Initial release.