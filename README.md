![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/frugan-dev/acf-uppy/total)
![Build Status](https://github.com/frugan-dev/acf-uppy/actions/workflows/ci.yml/badge.svg)
![Open Issues](https://img.shields.io/github/issues/frugan-dev/acf-uppy)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![Version](https://img.shields.io/github/v/release/frugan-dev/acf-uppy)
![License](https://img.shields.io/github/license/frugan-dev/acf-uppy)
<!--
![PHP Version](https://img.shields.io/packagist/php-v/frugan-dev/acf-uppy)
![Coverage Status](https://img.shields.io/codecov/c/github/frugan-dev/acf-uppy)
![Code Climate](https://img.shields.io/codeclimate/maintainability/frugan-dev/acf-uppy)
-->

# ACF Uppy Field (WordPress Plugin)

__ACF Uppy Field__ is a WordPress plugin that adds a new `Uppy` custom field to the list of fields of the [Advanced Custom Fields](https://www.advancedcustomfields.com) plugin. This custom field allows you to __upload files of all types and sizes__ using the [TUS protocol](https://tus.io) and the [Uppy JS uploader](https://uppy.io), overcoming the limitations of the default ACF `File` field. With __ACF Uppy Field__, you no longer need to increase server-side INI parameters such as `upload_max_filesize`, `post_max_size`, `max_execution_time` and `memory_limit`.

![](docs/img/demo.gif)

## Requirements

- PHP ^7.4
- WordPress ^5.7 || ^6.0
- [Advanced Custom Fields](https://www.advancedcustomfields.com) ^5.9 || ^6.0
- APCu *

<sub><i>
_* Note: If your environment doesn't support APCu, you can try setting the cache to `file` with the `acf_uppy/cache` filter, although `file` is not recommended in production (see [here](https://github.com/ankitpokhrel/tus-php/issues/408#issuecomment-1250229371))._
</i></sub>

## Features

- use official [Advanced Custom Fields - Field Type Template](https://github.com/AdvancedCustomFields/acf-field-type-template)
- use [TUS protocol](https://tus.io)
- use [Uppy JS uploader](https://uppy.io)
- made with [Vanilla JS](http://vanilla-js.com) (no jQuery)
- autoload classes with Composer and PSR-4
- assets built with Webpack
- support ACF nested repeater
- no limits by default for upload file size and types
- support setting per-field size limit, mime-types and upload path
- support uploads outside public directory (for private files)
- download file using symlinks (no memory problems with large downloads)
- many WP hooks available

## Installation

You can install the plugin in three ways: manually, via Composer (package) or via Composer (wpackagist) _(coming soon)_.

<details>
<summary>Manual Installation</summary>

1. Go to the [Releases](releases) section of this repository.
2. Download the latest release zip file.
3. Log in to your WordPress admin dashboard.
4. Navigate to `Plugins` > `Add New`.
5. Click `Upload Plugin`.
6. Choose the downloaded zip file and click `Install Now`.

</details>

<details>
<summary>Installation via Composer (package)</summary>

If you use Composer to manage WordPress plugins, you can install it from this repository directly:

1. Open your terminal.
2. Navigate to the root directory of your WordPress installation.
3. Ensure your `composer.json` file has the following configuration: *

```json
{
    "require": {
        "composer/installers": "^1.0 || ^2.0",
        "frugan-dev/acf-uppy": "^1.0"
    },
    "repositories": [
        {
            "type": "package",
            "package": {
                "name": "frugan-dev/acf-uppy",
                "version": "1.0.0",
                "type": "wordpress-plugin",
                "dist": {
                    "url": "https://github.com/frugan-dev/acf-uppy/archive/v1.0.0.zip",
                    "type": "zip"
                }
            }
        }
    ],
    "extra": {
        "installer-paths": {
            "wp-content/plugins/{$name}/": [
               "type:wordpress-plugin"
            ]
        }
    }
}
```
4. Run the following command:

```sh
composer update
```

<sub><i>
_* Note: `composer/installers` might already be required by another dependency._
</i></sub>
</details>

<details>
<summary>Installation via Composer (wpackagist) (coming soon)</summary>

If you use Composer to manage WordPress plugins, you can install it from [WordPress Packagist](https://wpackagist.org):

1. Open your terminal.
2. Navigate to the root directory of your WordPress installation.
3. Ensure your `composer.json` file has the following configuration: *

```json
{
    "require": {
        "composer/installers": "^1.0 || ^2.0",
        "wpackagist-plugin/acf-uppy": "^1.0"
    },
    "extra": {
        "installer-paths": {
            "wp-content/plugins/{$name}/": [
               "type:wordpress-plugin"
            ]
        }
    }
}
```
4. Run the following command:

```sh
composer update
```

<sub><i>
_* Note: `composer/installers` might already be required by another dependency._
</i></sub>
</details>

## Configuration

Once installed:

1. In your WordPress admin dashboard, navigate to the `Plugins` section and click `Activate Plugin`.
2. Create a new field via ACF and select the `Uppy` type.
3. Read the description above for advanced usage instructions.

## Actions

<details>
<summary>acf_uppy/download_fallback</summary>

```php
do_action( 'acf_uppy/download_fallback', $postId );
```
- `$postId` _(int)_: The ID of the post containing _ACF Uppy Field_.

</details>

<details>
<summary>acf_uppy/download_fallback/type={$postType}</summary>

```php
do_action( 'acf_uppy/download_fallback/type={$postType}', $postId );
```
- `$postId` _(int)_: The ID of the post containing _ACF Uppy Field_.
- `$postType` _(string)_: The type of the post containing _ACF Uppy Field_.

</details>

## Filters

<details>
<summary>acf_uppy/dest_path</summary>

```php
apply_filters( 'acf_uppy/dest_path', $destPath );
```
- `$destPath` _(string)_: The file destination absolute base path.  
Default: `{ABSPATH}wp-content/uploads/acf-uppy`.

</details>

<details>
<summary>acf_uppy/dest_path/type={$postType}</summary>

```php
apply_filters( 'acf_uppy/dest_path/type={$postType}', $destPath, $postId, $field );
```
- `$destPath` _(string)_: The file destination absolute base path.  
Default: `{ABSPATH}wp-content/uploads/acf-uppy`.
- `$postType` _(string)_: The type of the post containing _ACF Uppy Field_.
- `$postId` _(int)_: The ID of the post containing _ACF Uppy Field_.
- `$field` _(array)_: The field array holding all the field options.

</details>

<details>
<summary>acf_uppy/tmp_path</summary>

```php
apply_filters( 'acf_uppy/tmp_path', $tmpPath );
```
- `$tmpPath` _(string)_: The file temporary absolute path.  
Default: `{sys_get_temp_dir()}/acf-uppy/{get_current_user_id()}`.

</details>

<details>
<summary>acf_uppy/symlink_url</summary>

```php
apply_filters( 'acf_uppy/symlink_url', $symlinkUrl );
```
- `$symlinkUrl` _(string)_: The symlinks absolute base url.  
Default: `{site_url()}/wp-content/plugins/acf-uppy/symlink`.

</details>

<details>
<summary>acf_uppy/symlink_path</summary>

```php
apply_filters( 'acf_uppy/symlink_path', $symlinkPath );
```
- `$symlinkPath` _(string)_: The symlinks absolute base path.  
Default: `{ABSPATH}wp-content/plugins/acf-uppy/symlink`.

</details>

<details>
<summary>acf_uppy/base_path</summary>

```php
apply_filters( 'acf_uppy/base_path', $basePath );
```
- `$basePath` _(string)_: The base url endpoint.  
Default: `acf-uppy`.

</details>

<details>
<summary>acf_uppy/api_path</summary>

```php
apply_filters( 'acf_uppy/api_path', $apiPath );
```
- `$apiPath` _(string)_: The TUS base url endpoint.  
Default: `wp-tus`.

</details>

<details>
<summary>acf_uppy/cache</summary>

```php
apply_filters( 'acf_uppy/cache', $cacheType );
```
- `$cacheType` _(string)_: The TUS cache type.  
Options: `redis`, `apcu` or `file`.  
Default: `apcu`.

</details>

<details>
<summary>acf_uppy/cache_ttl</summary>

```php
apply_filters( 'acf_uppy/cache_ttl', $cacheTtl );
```
- `$cacheTtl` _(string)_: The TUS cache TTL in secs.  
Default: `86400`.

</details>

<details>
<summary>acf_uppy/file_name_exists</summary>

```php
apply_filters( 'acf_uppy/file_name_exists', $fileName, $destPath, $pathinfo, $counter );
```
- `$fileName` _(string)_: The file name renamed.  
Default: `{$pathinfo['filename']}-{$counter}.{$pathinfo['extension']}`.
- `$destPath` _(string)_: The directory absolute path to the file. 
- `$pathinfo` _(array)_: The [pathinfo](https://www.php.net/manual/en/function.pathinfo.php) of the file. 
- `$counter` _(int)_: The incremented counter. 

</details>

<details>
<summary>acf_uppy/file_name</summary>

```php
apply_filters( 'acf_uppy/file_name', $fileName, $destPath );
```
- `$fileName` _(string)_: The file name. 
- `$destPath` _(string)_: The directory absolute path to the file. 

</details>

<details>
<summary>acf_uppy/download_hash</summary>

```php
apply_filters( 'acf_uppy/download_hash', $hash, $destFile, $postId );
```
- `$hash` _(int|string)_: The hash used in download url.  
Default: `wp_hash( $destFile )`.
- `$destFile` _(string)_: The absolute path of the file. 
- `$postId` _(int)_: The ID of the post containing _ACF Uppy Field_.

</details>

<details>
<summary>acf_uppy/download_hash/type={$postType}</summary>

```php
apply_filters( 'acf_uppy/download_hash/type={$postType}', $hash, $destFile, $postId );
```
- `$hash` _(string)_: The hash used in download url.  
Default: `wp_hash( $destFile )`.
- `$postType` _(string)_: The type of the post containing _ACF Uppy Field_.
- `$destFile` _(string)_: The absolute path of the file. 
- `$postId` _(int)_: The ID of the post containing _ACF Uppy Field_.

</details>

<details>
<summary>acf_uppy/download_allow</summary>

```php
apply_filters( 'acf_uppy/download_allow', $allow, $destFile, $postId );
```
- `$allow` _(bool)_: Whether or not to allow the file download. 
- `$destFile` _(string)_: The absolute path of the file. 
- `$postId` _(int)_: The ID of the post containing _ACF Uppy Field_.

</details>

<details>
<summary>acf_uppy/download_allow/type={$postType}</summary>

```php
apply_filters( 'acf_uppy/download_allow/type={$postType}', $allow, $destFile, $postId );
```
- `$allow` _(bool)_: Whether or not to allow the file download. 
- `$postType` _(string)_: The type of the post containing _ACF Uppy Field_.
- `$destFile` _(string)_: The absolute path of the file. 
- `$postId` _(int)_: The ID of the post containing _ACF Uppy Field_.

</details>

<details>
<summary>acf_uppy/download_symlink_delete_days</summary>

```php
apply_filters( 'acf_uppy/download_symlink_delete_days', $days );
```
- `$days` _(int)_: Number of days before old symlinks are deleted.  
Default: `1`.

</details>

<details>
<summary>acf_uppy/download_symlink_delete_max</summary>

```php
apply_filters( 'acf_uppy/download_symlink_delete_max', $max );
```
- `$max` _(int)_: How many old symlinks need to be deleted on each request.  
Default: `10`.

</details>

## More info

See [LINKS](docs/LINKS.md) file.

## Changelog

See auto-[CHANGELOG](CHANGELOG.md) file.

## Contributing

For your contributions please use:

- [git-flow workflow](https://danielkummer.github.io/git-flow-cheatsheet/)
- [conventional commits](https://www.conventionalcommits.org)

## Support

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="200" alt="Buy Me A Coffee">](https://buymeacoff.ee/frugan)

<<<<<<< HEAD
### Usefull links

- https://www.advancedcustomfields.com/resources/creating-a-new-field-type/
- https://github.com/AdvancedCustomFields/acf-field-type-template
- http://youmightnotneedjquery.com
- http://vanilla-js.com/
- https://vanillajstoolkit.com
- https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/
- https://dmitripavlutin.com/string-interpolation-in-javascript/
- https://github.com/ankitpokhrel/tus-php/wiki/WordPress-Integration
- https://github.com/transloadit/uppy/issues/179
- https://dev.to/konsole/resumable-file-upload-in-php-handle-large-file-uploads-in-an-elegant-way-4a84
- https://dev.to/oyetoket/fastest-way-to-generate-random-strings-in-javascript-2k5a
- https://mortoray.com/2014/04/09/allowing-unlimited-access-with-cors/
- https://www.html5rocks.com/en/tutorials/cors//
- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSNotSupportingCredentials#What_went_wrong
- https://choosealicense.com
- https://learnwithdaniel.com/2019/09/publishing-your-first-wordpress-plugin-with-git-and-svn/

### License

(ɔ) Copyleft 2021 [Frugan](https://about.me/frugan)
[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/), see [COPYING](COPYING) file.
=======
## License

(ɔ) Copyleft 2024 [Frugan](https://frugan.it).  
[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/), see [LICENSE](LICENSE) file.
>>>>>>> release/v1.0.0
