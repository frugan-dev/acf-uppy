<?php declare(strict_types=1);

/*
 * This file is part of the ACF Uppy Field WordPress plugin.
 *
 * (ɔ) Frugan <dev@frugan.it>
 *
 * This source file is subject to the GPLv3 or later license that is bundled
 * with this source code in the file COPYING.
 */

namespace AcfUppy;

use AcfUppy\Exception\ReadErrorException;
use Apfelbox\FileDownload\FileDownload;
use TusPhp\Cache\AbstractCache;
use TusPhp\Tus\Server;

class AcfUppy
{
    /**
     * @var array{version:string,fieldType:string,url:string,path:string,destPath:mixed,tmpPath:mixed,symlinkUrl:mixed,symlinkPath:mixed,cacheTtl:mixed}
     */
    public $settings;

    /**
     * @var Server
     */
    public $server;

    /**
     *  __construct
     *
     *  This function will setup the class functionality
     *
     * @type    function
     * @date    17/02/2016
     * @throws ReadErrorException
     * @throws \ReflectionException
     * @since    1.0.0
     */
    public function __construct()
    {
        add_action('plugins_loaded', function (): void {
            $this->server = new \TusPhp\Tus\Server(
                // Either redis, file or apcu. Leave empty for file based cache.
                apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/cache', 'file')
            );

            $this->server
                ->setApiPath(
                    // tus server endpoint.
                    '/' . apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/api_path', 'wp-tus')
                )
            ;

            $wp_upload_dir = wp_upload_dir();

            // settings
            // - these will be passed into the field class.
            $this->settings = array(
                'version'       => ACF_UPPY_VERSION,
                'fieldType'     => ACF_UPPY_FIELD_TYPE,
                'url'           => plugin_dir_url(__DIR__),
                'path'          => plugin_dir_path(__DIR__),
                'destPath'      => apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/dest_path', trailingslashit($wp_upload_dir['basedir']) . ACF_UPPY_NAME),
                'tmpPath'       => apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/tmp_path', trailingslashit(sys_get_temp_dir()) . trailingslashit(ACF_UPPY_NAME) . get_current_user_id()),
                'symlinkUrl'    => apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/symlink_url', plugin_dir_url(__DIR__) . 'symlink'),
                'symlinkPath'   => apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/symlink_path', plugin_dir_path(__DIR__) . 'symlink'),
                'cacheTtl'      => apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/cache_ttl', $this->server->getCache()->getTtl()),
            );

            //https://github.com/ankitpokhrel/tus-php/issues/102
            $cache = $this->server->getCache();
            if ($cache instanceof AbstractCache) {
                $cache->setTtl($this->settings['cacheTtl']);
            }

            $this->server->middleware()->add(
                \AcfUppy\Middleware\Auth::class,
                \AcfUppy\Middleware\UploadMetadata::class,
                ( new \AcfUppy\Middleware\UploadDir($this->settings, $this->server) )
            );

            $this->server->event()->addListener('tus-server.upload.complete', function (\TusPhp\Events\TusEvent $event): void {
                $fileMeta = $event->getFile()->details();
                $fieldName = basename(dirname($fileMeta['file_path']));

                $dirs = glob(trailingslashit($this->server->getUploadDir()) . '*');
                if (false === $dirs) {
                    throw new ReadErrorException('error reading ' . trailingslashit($this->server->getUploadDir()) . '*');
                }

                foreach ($dirs as $path) {
                    if ($fileMeta['file_path'] === $path) {
                        continue;
                    }

                    if (is_file($path)) {
                        @unlink($path);
                    }
                }

                $requestKey = $event->getRequest()->key();

                $cache = $this->server->getCache();
                if (!method_exists($cache, 'getActualCacheKey')) {
                    return;
                }

                //https://github.com/ankitpokhrel/tus-php/issues/102
                foreach ($cache->keys() as $cacheKey) {
                    if ($cache->getActualCacheKey($requestKey) === $cacheKey) {
                        continue;
                    }

                    if ($oldFileMeta = $cache->get($cacheKey)) {
                        if (preg_match('~'.preg_quote('/'.get_current_user_id().'/'.$fieldName.'/').'~', $oldFileMeta['file_path'])) {
                            $cache->delete($cacheKey);
                        }
                    }
                }
            });
        }, 0);

        //https://github.com/ankitpokhrel/tus-php/wiki/WordPress-Integration
        add_action('init', function (): void {
            global $wp;

            $wp->add_query_var('tus');
            $wp->add_query_var(ACF_UPPY_NAME_UNDERSCORE . '_action');
            $wp->add_query_var(ACF_UPPY_NAME_UNDERSCORE . '_pubkey');

            //add_rewrite_tag( '%tus%', '([^&]+)' );
            add_rewrite_rule('^'.apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/api_path', 'wp-tus').'/([^/]*)/?([^/]*)/?$', 'index.php?tus=$matches[1]', 'top');
            add_rewrite_rule('^'.apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/base_path', ACF_UPPY_NAME).'/([^/]*)/?([0-9]{1,})/?([^/]*)/?$', 'index.php?'.ACF_UPPY_NAME_UNDERSCORE . '_action=$matches[1]&page_id=$matches[2]&'.ACF_UPPY_NAME_UNDERSCORE . '_pubkey=$matches[3]', 'top');
        }, 0);

        add_action('parse_request', function ($wp): void {
            if (!empty($wp->query_vars['name']) && $wp->query_vars['name'] !== apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/api_path', 'wp-tus')) {
                return;
            }

            if (empty($wp->query_vars['name']) && empty($wp->query_vars['tus'])) {
                return;
            }

            $response = $this->server->serve();

            $response->send();

            exit(0);
        }, 0);

        add_action('parse_request', function ($wp): void {
            if (!empty($wp->query_vars['name']) && $wp->query_vars['name'] !== apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/base_path', ACF_UPPY_NAME)) {
                return;
            }

            if (empty($wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_action']) || empty($wp->query_vars['page_id']) || empty($wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_pubkey'])) {
                return;
            }

            $postId = (int) $wp->query_vars['page_id'];
            $postType = get_post_type($postId);

            switch ($wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_action']) {

                case 'download':

                    $fieldsObj = get_field_objects($postId);

                    if (!empty($fieldsObj)) {
                        $destFiles = $this->getDestFiles($fieldsObj, $postId);

                        if (!empty($destFiles)) {
                            foreach ($destFiles as $destFile) {
                                $hash = apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/'.$wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_action'].'_hash', wp_hash($destFile), $destFile, $postId);

                                if (!empty($postType)) {
                                    $hash = apply_filters(ACF_UPPY_NAME_UNDERSCORE . '/' . $wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_action'] . '_hash/type='.$postType, $hash, $destFile, $postId);
                                }

                                if ($wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_pubkey'] === $hash) {
                                    $found = true;
                                    break;
                                }
                            }

                            if (!empty($found)) {
                                $allow = apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/'.$wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_action'].'_allow', true, $destFile, $postId);

                                if (!empty($postType)) {
                                    $allow = apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/'.$wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_action'].'_allow/type='.$postType, $allow, $destFile, $postId);
                                }

                                if (!empty($allow)) {
                                    require_once(ABSPATH . '/wp-admin/includes/file.php');
                                    WP_Filesystem();

                                    global $wp_filesystem;

                                    $i=0;
                                    $paths = glob(trailingslashit($this->settings['symlinkPath']).'*');
                                    if (false === $paths) {
                                        throw new ReadErrorException('error reading ' . trailingslashit($this->settings['symlinkPath']).'*');
                                    }
                                    foreach ($paths as $path) {
                                        if (is_dir($path)) {
                                            if (basename($path) === $wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_pubkey']) {
                                                continue;
                                            }

                                            //https://stackoverflow.com/a/34512584
                                            $stat = stat($path);

                                            if (false !== $stat && isset($stat['mtime'])) {
                                                $diff = ((time() - $stat['mtime']) / (60 * 60 * 24));

                                                if ($diff >= apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/'.$wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_action'].'_symlink_delete_days', 1)) {
                                                    @$wp_filesystem->rmdir($path, true);
                                                }
                                            }

                                            $i++;
                                            if ($i > apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/'.$wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_action'].'_symlink_delete_max', 10)) {
                                                break;
                                            }
                                        }
                                    }

                                    $symlinkPath = trailingslashit($this->settings['symlinkPath']) . trailingslashit($wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_pubkey']);
                                    $symlinkFile = $symlinkPath . basename($destFile);

                                    if (wp_mkdir_p($symlinkPath) === false) {
                                        wp_die(
                                            sprintf(
                                                __('Error creating symlinkPath (%1$s)', ACF_UPPY_NAME),
                                                $symlinkPath
                                            ),
                                            500,
                                            array('back_link' => true)
                                        );
                                    }

                                    if (!is_link($symlinkFile)) {
                                        if (true !== @symlink($destFile, $symlinkFile)) {
                                            @exec('ln -s '.escapeshellcmd($destFile).' '.escapeshellcmd($symlinkFile), $out, $status);
                                        }
                                    }

                                    if (is_link($symlinkFile)) {
                                        wp_safe_redirect(trailingslashit($this->settings['symlinkUrl']) . trailingslashit($wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_pubkey']) . basename($destFile));
                                        exit;
                                    }

                                    //https://stackoverflow.com/a/1395173/3929620
                                    //https://zinoui.com/blog/download-large-files-with-php
                                    $fileDownload = FileDownload::createFromFilePath($destFile);
                                    $fileDownload->sendDownload(basename($destFile));

                                    exit;
                                }
                            }
                        }
                    }

                    break;
            }

            do_action(ACF_UPPY_NAME_UNDERSCORE.'/'.$wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_action'].'_fallback', $postId);
            do_action(ACF_UPPY_NAME_UNDERSCORE.'/'.$wp->query_vars[ACF_UPPY_NAME_UNDERSCORE . '_action'].'_fallback/type='.$postType, $postId);
        }, 0);

        add_action('wp', function ($wp): void {
            if (!is_user_logged_in()) {
                return;
            }
            if (defined('DOING_AJAX') && DOING_AJAX) {
                return;
            }
            if (is_dir($this->settings['tmpPath'])) {
                require_once(ABSPATH . '/wp-admin/includes/file.php');
                WP_Filesystem();

                global $wp_filesystem;

                $paths = glob(trailingslashit($this->settings['tmpPath']) . '*');
                if (false === $paths) {
                    throw new ReadErrorException('error reading ' . trailingslashit($this->settings['tmpPath']) . '*');
                }
                foreach ($paths as $path) {
                    if (is_dir($path)) {
                        @$wp_filesystem->rmdir($path, true);
                    }
                }
            }

            //https://github.com/ankitpokhrel/tus-php/issues/102
            $cacheKeys = $this->server->getCache()->keys();
            //$this->server->getCache()->deleteAll( $cacheKeys );

            foreach ($cacheKeys as $cacheKey) {
                if ($oldFileMeta = $this->server->getCache()->get($cacheKey)) {
                    if (preg_match('~^'.preg_quote(trailingslashit($this->settings['tmpPath'])).'~', $oldFileMeta['file_path'])) {
                        $this->server->getCache()->delete($cacheKey);
                    }
                }
            }
        });

        add_action('acf/save_post', function ($postId): void {
            $fieldsObj = get_field_objects($postId);

            if (!empty($fieldsObj)) {
                $destPaths = $this->getDestPaths($fieldsObj, $postId);

                if (!empty($destPaths)) {
                    $destFiles = $this->getDestFiles($fieldsObj, $postId);

                    foreach ($destPaths as $destPath) {
                        if (is_dir($destPath)) {
                            $paths = glob(trailingslashit($destPath) . '*');
                            if (false === $paths) {
                                throw new ReadErrorException('error reading ' . trailingslashit($destPath) . '*');
                            }
                            foreach ($paths as $path) {
                                if (is_file($path)) {
                                    if (in_array($path, $destFiles, true)) {
                                        continue;
                                    }

                                    @unlink($path);
                                }
                            }
                        }
                    }
                }
            }
        });

        // the hook runs only when the WordPress user empties the Trash
        add_action('before_delete_post', function ($postId, $post): void {
            if ($post->post_type === 'acf-field-group') {
                return;
            } elseif ($post->post_type === 'acf-field') {
                $field = get_field_object($post->post_name, $postId);

                if (!empty($field)) {
                    require_once(ABSPATH . '/wp-admin/includes/file.php');
                    WP_Filesystem();

                    global $wp_filesystem;

                    $args = array(
                        'post_type'     => 'any', // retrieves any type except revisions and types with ‘exclude_from_search’ set to true.
                        'meta_key'      => '_' . $field['name'],
                        'meta_value'    => $field['key'],
                        'nopaging'      => true
                    );

                    $query = new \WP_Query($args);

                    if ($query->have_posts()) {
                        while ($query->have_posts()) {
                            $query->the_post();

                            $destPath = !empty($field['destPath']) ? trailingslashit($field['destPath']) : apply_filters(ACF_UPPY_NAME_UNDERSCORE . '/dest_path/type=' . get_post_type(), trailingslashit($this->settings['destPath']), get_the_ID(), $field);
                            $destPath .= trailingslashit((string)get_the_ID()) . trailingslashit(sanitize_file_name($field['key']));

                            if (is_dir($destPath)) {
                                @$wp_filesystem->rmdir($destPath, true);
                            }
                        }
                    }

                    wp_reset_postdata();
                }
            } else {
                $fieldsObj = get_field_objects($postId);

                if (!empty($fieldsObj)) {
                    $destPaths = $this->getDestPaths($fieldsObj, $postId, false);

                    if (!empty($destPaths)) {
                        require_once(ABSPATH . '/wp-admin/includes/file.php');
                        WP_Filesystem();

                        global $wp_filesystem;

                        foreach ($destPaths as $destPath) {
                            if (is_dir($destPath)) {
                                @$wp_filesystem->rmdir($destPath, true);
                            }
                        }
                    }
                }
            }
        }, 10, 2);
        
        // include field
        add_action('acf/include_field_types', array($this, 'include_field')); // v5
        add_action('acf/register_fields', array($this, 'include_field')); // v4
    }

    /**
    *  include_field
    *
    *  This function will include the field type class
    *
    *  @type	function
    *  @date	17/02/2016
    *  @since	1.0.0
    *
    *  @param	int|false $version major ACF version. Defaults to false
    */
    public function include_field($version = false): void
    {
        // support empty $version
        if (empty($version)) {
            $version = 5;
        }

        if (basename(dirname($this->settings['path'])) === 'mu-plugins') {
            load_muplugin_textdomain(
                ACF_UPPY_NAME,
                trailingslashit(ACF_UPPY_NAME) . 'lang'
            );
        } else {
            load_plugin_textdomain(
                ACF_UPPY_NAME,
                false,
                trailingslashit(ACF_UPPY_NAME) . 'lang'
            );
        }

        if (class_exists($class = '\AcfUppy\AcfUppyFieldV'.$version)) {
            new $class($this->settings, $this->server);
        }
    }

    public function getSubValues(array $values, string $fieldName, array $returns = array()): array
    {
        if (!empty($values) && !empty($fieldName)) {
            foreach ($values as $id => $subValues) {
                foreach ($subValues as $name => $value) {
                    if ($name === $fieldName && !empty($value)) {
                        $returns[] = $value;
                    } elseif (is_array($value)) {
                        $returns += $this->getSubValues($value, $fieldName, $returns);
                    }
                }
            }
        }

        return $returns;
    }

    public function getDestFiles(array $fieldsObj, int $postId, array $values = array(), array $returns = array()): array
    {
        if (!empty($fieldsObj)) {
            $postType = get_post_type($postId);

            foreach ($fieldsObj as $field) {
                if ($field['type'] === $this->settings['fieldType']) {
                    $destPath = !empty($field['destPath']) ? trailingslashit($field['destPath']) : apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/dest_path/type='.$postType, trailingslashit($this->settings['destPath']), $postId, $field);
                    $destPath .= trailingslashit((string)$postId);
                    $destPath .= trailingslashit(sanitize_file_name($field['key']));

                    if (!empty($field['value'])) {
                        $returns[] = $destPath . $field['value'];
                    } elseif (!empty($values)) {
                        foreach ($this->getSubValues($values, $field['name']) as $value) {
                            $returns[] = $destPath . $value;
                        }
                    }
                } elseif (!empty($field['sub_fields'])) {
                    if (!empty($field['value'])) {
                        $values = $field['value'];
                    }

                    $returns += $this->getDestFiles($field['sub_fields'], $postId, $values, $returns);
                }
            }
        }

        return $returns;
    }

    public function getDestPaths(array $fieldsObj, int $postId, bool $fullPath = true, array $returns = array()): array
    {
        if (!empty($fieldsObj)) {
            $postType = get_post_type($postId);

            foreach ($fieldsObj as $field) {
                if ($field['type'] === $this->settings['fieldType']) {
                    $destPath = !empty($field['destPath']) ? trailingslashit($field['destPath']) : apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/dest_path/type='.$postType, trailingslashit($this->settings['destPath']), $postId, $field);
                    $destPath .= trailingslashit((string)$postId);

                    if ($fullPath) {
                        $destPath .= trailingslashit(sanitize_file_name($field['key']));
                    }

                    $returns[] = $destPath;
                } elseif (!empty($field['sub_fields'])) {
                    $returns += $this->getDestPaths($field['sub_fields'], $postId, $fullPath, $returns);
                }
            }
        }

        //http://stackoverflow.com/a/8321709
        return array_flip(array_flip($returns));
    }
}
