<?php declare(strict_types=1);

namespace AcfUppy;

use AcfUppy\Exception\ReadErrorException;
use TusPhp\Tus\Server;

class AcfUppyFieldV5 extends \acf_field
{
    /**
     * @var array{version:string,fieldType:string,url:string,path:string,destPath:string,tmpPath:string,symlinkUrl:string,symlinkPath:string,cacheTtl:string}
     */
    public $settings;

    /**
     * @var Server
     */
    public $server;

    /**
     * @var array
     */
    public $paths;

    /**
    *  __construct
    *
    *  This function will setup the field type data
    *
    *  @type	function
    *  @date	5/03/2014
    *  @since	5.0.0
    *
     * @param array{version:string,fieldType:string,url:string,path:string,destPath:string,tmpPath:string,symlinkUrl:string,symlinkPath:string,cacheTtl:string} $settings
    */
    public function __construct(
        array $settings,
        Server $server
    ) {
        /**
        *  settings (array) Store plugin settings (url, path, version) as a reference for later use with assets
        */
        $this->settings = $settings;
        
        /**
        *  name (string) Single word, no spaces. Underscores allowed
        */
        $this->name = $this->settings['fieldType'];
        
        /**
        *  label (string) Multiple words, can include spaces, visible when selecting a field type
        */
        $this->label = __('Uppy', ACF_UPPY_NAME);
        
        /**
        *  category (string) basic | content | choice | relational | jquery | layout | CUSTOM GROUP NAME
        */
        $this->category = 'content';

        /**
        *  defaults (array) Array of default settings which are merged into the field object. These are used later in settings
        */
        $this->defaults = array(
            'maxFileSize'       => 10,

            //https://www.iana.org/assignments/media-types/media-types.xhtml
            'allowedFileTypes'  => null,

            'destPath'          => $this->settings['destPath'],
        );

        /**
        *  l10n (array) Array of strings that are used in JavaScript. This allows JS strings to be translated in PHP and loaded via:
        *  var message = acf._e('uppy', 'error');
        */
        $this->l10n = array(
            'debug' => WP_DEBUG,
            'locale' => get_locale(),
            'apiPath' => site_url('/' . apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/api_path', 'wp-tus')),
            //'error'	=> __('Error! Please enter a higher value', ACF_UPPY_NAME),
        );

        $this->server = $server;

        $this->paths = array();

        // do not delete!
        parent::__construct();
    }

    /**
    *  render_field_settings()
    *
    *  Create extra settings for your field. These are visible when editing a field
    *
    *  @type	action
    *  @since	3.6
    *  @date	23/01/13
    *
    *  @param	array $field the $field being edited
    */
    public function render_field_settings($field): void
    {
        /**
        *  acf_render_field_setting
        *
        *  This function will create a setting for your field. Simply pass the $field parameter and an array of field settings.
        *  The array of settings does not require a `value` or `prefix`; These settings are found from the $field array.
        *
        *  More than one setting can be added by copy/paste the above code.
        *  Please note that you must also have a matching $defaults value for the field name (font_size)
        */
        acf_render_field_setting($field, array(
            'label'         => __('Max file size', ACF_UPPY_NAME),
            'instructions'  => implode('<br>'.PHP_EOL, array(
                sprintf(__('Default: %1$s', ACF_UPPY_NAME), '<code>' . (string) $this->defaults['maxFileSize'] . '</code>'),
            )),
            'type'          => 'number',
            'name'          => 'maxFileSize',
            'append'        => 'MB',
            'min'           => 0,
            'step'          => 1,
        ));

        acf_render_field_setting($field, array(
            'label'         => __('Allowed file types', ACF_UPPY_NAME),
            'instructions'  => implode('<br>'.PHP_EOL, array(
                __('Wildcards mime types (e.g. image/*), exact mime types (e.g. image/jpeg), or file extensions (e.g. .jpg).', ACF_UPPY_NAME),
                __('One value for each line.', ACF_UPPY_NAME),
                sprintf(__('Default: %1$s', ACF_UPPY_NAME), '<code>' . (string) $this->defaults['allowedFileTypes'] . '</code>'),
            )),
            'type'          => 'textarea',
            'name'          => 'allowedFileTypes',
        ));

        acf_render_field_setting($field, array(
            'label'         => __('Uploads path', ACF_UPPY_NAME),
            'instructions'  => implode('<br>'.PHP_EOL, array(
                __('Absolute path to the directory where to save all files.', ACF_UPPY_NAME),
                __('It can also be outside the public directory.', ACF_UPPY_NAME),
                sprintf(__('Default: %1$s', ACF_UPPY_NAME), '<code>' . (string) $this->defaults['destPath'] . '</code>'),
            )),
            'type'          => 'text',
            'name'          => 'destPath',
        ));
    }
    
    /**
    *  render_field()
    *
    *  Create the HTML interface for your field
    *
    *  @type	action
    *  @since	3.6
    *  @date	23/01/13
    *
    *  @param	array $field the $field being edited
    */
    public function render_field($field): void
    {
        global $post;

        $destFile = '';
        $hash = '';

        if (!empty($field['value'])) {
            $destPath = !empty($field['destPath']) ? trailingslashit($field['destPath']) : apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/dest_path/type='.$post->post_type, trailingslashit($this->settings['destPath']), $post->ID, $field);
            $destPath .= trailingslashit($post->ID) . trailingslashit(sanitize_file_name($field['key']));

            $destFile = $destPath . $field['value'];

            if (file_exists($destFile)) {
                $found = true;

                $hash = apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/download_hash', wp_hash($destFile), $destFile, $post->ID);
                $hash = apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/download_hash/type='.$post->post_type, $hash, $destFile, $post->ID);
            }
        }

        if (!empty($field['allowedFileTypes'])) {
            $array = preg_split('/\r\n|[\r\n]/', $field['allowedFileTypes']);

            if (false !== $array) {
                //http://stackoverflow.com/a/8321709
                $array = array_flip(array_flip($array));

                $field['allowedFileTypes'] = wp_json_encode($array);
            }
        } ?>
        <input type="hidden" name="<?php esc_attr_e($field['name']) ?>" value="<?php esc_attr_e(!empty($found) ? $field['value'] : '') ?>">
        <div class="UppyFileInput"
             data-fieldName="<?php esc_attr_e($field['name']) ?>"
             data-maxFileSize="<?php esc_attr_e((string)($field['maxFileSize'] * 1024 * 1024)) ?>"
             data-allowedFileTypes="<?php esc_attr_e($field['allowedFileTypes']) ?>">
        </div>
        <div class="UppyStatusBar"></div>
        <div class="UppyInformer"></div>
        <div class="UppyResponse">
            <?php if (!empty($found)) { ?>
                <a data-field-name="<?php esc_attr_e($field['name']) ?>" class="UppyDelete" href="javascript:;">
                    <span class="dashicons dashicons-trash"></span>
                </a>
                <a href="<?php echo esc_url(
            site_url('/' . apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/base_path', ACF_UPPY_NAME) . '/download/' . trailingslashit($post->ID) . trailingslashit($hash))
        ) ?>"><?php esc_html_e($field['value']) ?></a> (<?php echo size_format((int)filesize($destFile), 2) ?>)
            <?php } ?>
        </div>
        <?php
    }

    /**
    *  input_admin_enqueue_scripts()
    *
    *  This action is called in the admin_enqueue_scripts action on the edit screen where your field is created.
    *  Use this action to add CSS + JavaScript to assist your render_field() action.
    *
    *  @type	action (admin_enqueue_scripts)
    *  @since	3.6
    *  @date	23/01/13
     * @throws ReadErrorException
    */
    public function input_admin_enqueue_scripts(): void
    {
        // register & include JS
        $paths = glob($this->settings['path'].'/assets/js'.(!empty(WP_DEBUG) ? '' : '/min').'/npm/*.js');
        if (false === $paths) {
            throw new ReadErrorException('error reading ' . $this->settings['path'] . '/assets/js' . (!empty(WP_DEBUG) ? '' : '/min') . '/npm/*.js');
        }
        foreach ($paths as $file) {
            wp_register_script(
                $this->name . '-npm-' . basename($file, '.js'),
                $this->settings['url'] . 'assets/js' . (!empty(WP_DEBUG) ? '' : '/min') . '/npm/' . basename($file),
                array('acf-input'),
                $this->settings['version'],
                true
            );
            wp_enqueue_script($this->name . '-npm-' . basename($file, '.js'));
        }

        $paths = glob($this->settings['path'].'/assets/js'.(!empty(WP_DEBUG) ? '' : '/min').'/*.js');
        if (false === $paths) {
            throw new ReadErrorException('error reading ' . $this->settings['path'] . '/assets/js' . (!empty(WP_DEBUG) ? '' : '/min') . '/*.js');
        }
        foreach ($paths as $file) {
            wp_register_script(
                $this->name . '-' . basename($file, '.js'),
                $this->settings['url'] . 'assets/js' . (!empty(WP_DEBUG) ? '' : '/min') . '/' . basename($file),
                array('acf-input'),
                $this->settings['version'],
                true
            );

            if (basename($file, '.js') === 'main') {
                wp_localize_script($this->name . '-' . basename($file, '.js'), $this->name . 'L10n', $this->l10n);
            }

            wp_enqueue_script($this->name . '-' . basename($file, '.js'));
        }

        $files = array(
            'assets/js/locales/@uppy/'.get_locale().'.min.js',
        );

        foreach ($files as $file) {
            if (file_exists($this->settings['path'].'/'.$file)) {
                wp_register_script(
                    $this->name.'-'.basename(dirname($file)).'-'.basename($file, '.js'),
                    $this->settings['url'].$file,
                    array('acf-input'),
                    $this->settings['version'],
                    true
                );
                wp_enqueue_script($this->name.'-'.basename(dirname($file)).'-'.basename($file, '.js'));

                if (basename(dirname($file)) === '@uppy') {
                    wp_add_inline_script($this->name.'-'.basename(dirname($file)).'-'.basename($file, '.js'), "window.Uppy.locales = []", 'before');
                }
            }
        }

        // register & include CSS
        $paths = glob($this->settings['path'].'/assets/css'.(!empty(WP_DEBUG) ? '' : '/min').'/npm/*.css');
        if (false === $paths) {
            throw new ReadErrorException('error reading ' . $this->settings['path'].'/assets/css'.(!empty(WP_DEBUG) ? '' : '/min').'/npm/*.css');
        }
        foreach ($paths as $file) {
            wp_register_style(
                $this->name . '-npm-' . basename($file, '.css'),
                $this->settings['url'] . 'assets/css' . (!empty(WP_DEBUG) ? '' : '/min') . '/npm/' . basename($file),
                array('acf-input'),
                $this->settings['version']
            );
            wp_enqueue_style($this->name . '-npm-' . basename($file, '.css'));
        }

        $paths = glob($this->settings['path'].'/assets/css'.(!empty(WP_DEBUG) ? '' : '/min').'/*.css');
        if (false === $paths) {
            throw new ReadErrorException($this->settings['path'].'/assets/css'.(!empty(WP_DEBUG) ? '' : '/min').'/*.css');
        }
        foreach ($paths as $file) {
            wp_register_style(
                $this->name . '-' . basename($file, '.css'),
                $this->settings['url'] . 'assets/css' . (!empty(WP_DEBUG) ? '' : '/min') . '/' . basename($file),
                array('acf-input'),
                $this->settings['version']
            );
            wp_enqueue_style($this->name . '-' . basename($file, '.css'));
        }
    }

    /**
    *  update_value()
    *
    *  This filter is applied to the $value before it is saved in the db
    *
    *  @type	filter
    *  @since	3.6
    *  @date	23/01/13
    *
    *  @param	mixed $value the value found in the database
    *  @param	mixed $post_id the $post_id from which the value was loaded
    *  @param	array $field the field array holding all the field options
    *  @return	mixed
    */
    public function update_value($value, $post_id, $field)
    {
        if (!empty($value) && !empty($this->paths)) {
            $value = sanitize_file_name($value);

            $paths = array_shift($this->paths);

            if (!empty($paths['tmp'])) {
                if (basename($paths['tmp']) !== $value) {
                    wp_die(
                        sprintf(
                            __('Wrong tmpPath (%1$s) of file (%2$s)', ACF_UPPY_NAME),
                            $paths['tmp'],
                            $value
                        ),
                        500,
                        array('back_link' => true)
                    );
                }
            }

            if (!empty($paths['dest'])) {
                $destPath = dirname($paths['dest']);
                $value = basename($paths['dest']);

                if (wp_mkdir_p($destPath) === false) {
                    wp_die(
                        sprintf(
                            __('Error creating destPath (%1$s)', ACF_UPPY_NAME),
                            $destPath
                        ),
                        500,
                        array('back_link' => true)
                    );
                }

                if (!empty($paths['tmp'])) {
                    if (@rename($paths['tmp'], $paths['dest']) === false) {
                        wp_die(
                            sprintf(
                                __('Error moving file from (%1$s) to (%2$s)', ACF_UPPY_NAME),
                                $paths['tmp'],
                                $paths['dest']
                            ),
                            500,
                            array('back_link' => true)
                        );
                    }
                }
            }
        }

        return $value;
    }

    /**
    *  validate_value()
    *
    *  This filter is used to perform validation on the value prior to saving.
    *  All values are validated regardless of the field's required setting. This allows you to validate and return
    *  messages to the user if the value is not correct
    *
    *  @type	filter
    *  @date	11/02/2014
    *  @since	5.0.0
    *
    *  @param	bool $valid validation status based on the value and the field's required setting
    *  @param	mixed $value the $_POST value
    *  @param	array $field the field array holding all the field options
    *  @param	string $input the corresponding input name for $_POST value
    *  @return	bool
    */
    public function validate_value($valid, $value, $field, $input)
    {
        $value = sanitize_file_name($value);

        $postType = get_post_type($_POST['post_ID']);

        $tmpPath = trailingslashit($this->settings['tmpPath']) . trailingslashit(sanitize_file_name($input));

        $destPath = !empty($field['destPath']) ? trailingslashit($field['destPath']) : apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/dest_path/type='.$postType, trailingslashit($this->settings['destPath']), $_POST['post_ID'], $field);
        $destPath .= trailingslashit($_POST['post_ID']) . trailingslashit(sanitize_file_name($field['key']));

        if (!empty($field['required']) && empty($value)) {
            $valid = false;
        } elseif (!empty($value) && !file_exists($tmpPath . $value) && !file_exists($destPath . $value)) {

            // Basic usage
            $valid = false;

            // Advanced usage
            //$valid = __('File doesn\'t exists!', ACF_UPPY_NAME);
        }

        if ($valid === true && !empty($value)) {
            $paths = array();

            $paths['tmp'] = file_exists($tmpPath . $value) ? $tmpPath . $value : false;

            if (!empty($paths['tmp'])) {
                $pathinfo = pathinfo($value);

                $counter = 0;
                while (file_exists($destPath . $value)) {
                    $value = apply_filters(
                        ACF_UPPY_NAME_UNDERSCORE.'/file_name_exists',
                        $pathinfo['filename'] .
                        '-' .
                        ++$counter .
                        /** @phpstan-ignore-next-line */
                        isset($pathinfo['extension']) ? '.' . $pathinfo['extension'] : '',
                        $destPath,
                        $pathinfo,
                        $counter
                    );
                }
            }

            $paths['dest'] = $destPath . apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/file_name', $value, $destPath);

            $this->paths[] = $paths;
        }

        return $valid;
    }
}
