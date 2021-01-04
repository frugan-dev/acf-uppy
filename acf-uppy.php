<?php declare(strict_types=1);

/**
 * Plugin Name: Advanced Custom Fields: Uppy
 * Plugin URI: https://github.com/frugan-it/acf-uppy
 * Description: Uppy Field for Advanced Custom Fields
 * Version: 0.1.0
 * Requires PHP: 7.1
 * Author: Frugan
 * Author URI: https://about.me/frugan
 * License: GPLv3 or later
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 */

if (!defined('ABSPATH')) {
    exit;
}

if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__.'/vendor/autoload.php';
}

define('ACF_UPPY_VERSION', '0.1.0');
define('ACF_UPPY_NAME', dirname(plugin_basename(__FILE__)));
define('ACF_UPPY_NAME_UNDERSCORE', str_replace('-', '_', ACF_UPPY_NAME));
define('ACF_UPPY_FIELD_TYPE', 'uppy');

new \AcfUppy\AcfUppy;
