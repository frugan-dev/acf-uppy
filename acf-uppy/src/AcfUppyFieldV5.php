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
    public $paths = [];

    /**
     * This function will setup the field type data.
     *
     * @param array{version:string,fieldType:string,url:string,path:string,destPath:string,tmpPath:string,symlinkUrl:string,symlinkPath:string,cacheTtl:string} $settings
     */
    public function __construct(
        array $settings,
        Server $server
    ) {
        // settings (array) Store plugin settings (url, path, version) as a reference for later use with assets
        $this->settings = $settings;

        // name (string) Single word, no spaces. Underscores allowed
        $this->name = $this->settings['fieldType'];

        // label (string) Multiple words, can include spaces, visible when selecting a field type
        $this->label = __('Uppy', ACF_UPPY_NAME);

        // category (string) basic | content | choice | relational | jquery | layout | CUSTOM GROUP NAME
        $this->category = 'content';

        // defaults (array) Array of default settings which are merged into the field object. These are used later in settings
        $this->defaults = [
            'maxFileSize' => 10,

            // https://www.iana.org/assignments/media-types/media-types.xhtml
            'allowedFileTypes' => null,

            'destPath' => $this->settings['destPath'],
        ];

        /*
         *  l10n (array) Array of strings that are used in JavaScript. This allows JS strings to be translated in PHP and loaded via:
         *  var message = acf._e('uppy', 'error');
         */
        $this->l10n = [
            'debug' => WP_DEBUG,
            'locale' => get_locale(),
            'apiPath' => home_url('/'.apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/api_path', 'wp-tus')),
            // 'error'  => __('Error! Please enter a higher value', ACF_UPPY_NAME),
        ];

        $this->server = $server;

        // do not delete!
        parent::__construct();
    }

    /**
     * Create extra settings for your field. These are visible when editing a field.
     *
     * @param array $field the $field being edited
     */
    public function render_field_settings($field): void
    {
        // acf_render_field_setting
        //
        // This function will create a setting for your field. Simply pass the $field parameter and an array of field settings.
        // The array of settings does not require a `value` or `prefix`; These settings are found from the $field array.
        //
        // More than one setting can be added by copy/paste the above code.
        // Please note that you must also have a matching $defaults value for the field name (font_size)
        acf_render_field_setting(
            $field,
            [
                'label' => __('Max file size', ACF_UPPY_NAME),
                'instructions' => implode(
                    '<br>'.PHP_EOL,
                    [
                        // translators: %1$s: maxFileSize
                        \sprintf(__('Default: %1$s', ACF_UPPY_NAME), '<code>'.$this->defaults['maxFileSize'].'</code>'),
                    ]
                ),
                'type' => 'number',
                'name' => 'maxFileSize',
                'append' => 'MB',
                'min' => 0,
                'step' => 1,
            ]
        );

        acf_render_field_setting(
            $field,
            [
                'label' => __('Allowed file types', ACF_UPPY_NAME),
                'instructions' => implode(
                    '<br>'.PHP_EOL,
                    [
                        __('Wildcards mime types (e.g. image/*), exact mime types (e.g. image/jpeg), or file extensions (e.g. .jpg).', ACF_UPPY_NAME),
                        __('One value for each line.', ACF_UPPY_NAME),
                        // translators: %1$s: allowedFileTypes
                        \sprintf(__('Default: %1$s', ACF_UPPY_NAME), '<code>'.$this->defaults['allowedFileTypes'].'</code>'),
                    ]
                ),
                'type' => 'textarea',
                'name' => 'allowedFileTypes',
            ]
        );

        acf_render_field_setting(
            $field,
            [
                'label' => __('Uploads path', ACF_UPPY_NAME),
                'instructions' => implode(
                    '<br>'.PHP_EOL,
                    [
                        __('Absolute path to the directory where to save all files.', ACF_UPPY_NAME),
                        __('It can also be outside the public directory.', ACF_UPPY_NAME),
                        // translators: %1$s: destPath
                        \sprintf(__('Default: %1$s', ACF_UPPY_NAME), '<code>'.$this->defaults['destPath'].'</code>'),
                    ]
                ),
                'type' => 'text',
                'name' => 'destPath',
            ]
        );
    }

    /**
     * Create the HTML interface for your field.
     *
     * @param array $field the $field being edited
     */
    public function render_field($field): void
    {
        global $post;

        $destFile = '';
        $hash = '';

        if (!empty($field['value'])) {
            $destPath = !empty($field['destPath']) ? trailingslashit($field['destPath']) : apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/dest_path/type='.$post->post_type, trailingslashit($this->settings['destPath']), $post->ID, $field);
            $destPath .= trailingslashit($post->ID).trailingslashit(sanitize_file_name($field['key']));

            $destFile = $destPath.$field['value'];

            if (file_exists($destFile)) {
                $found = true;

                $hash = apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/download_hash', wp_hash($destFile), $destFile, $post->ID);
                $hash = apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/download_hash/type='.$post->post_type, $hash, $destFile, $post->ID);
            }
        }

        if (!empty($field['allowedFileTypes'])) {
            $array = preg_split('/\r\n|[\r\n]/', $field['allowedFileTypes']);

            if (false !== $array) {
                // http://stackoverflow.com/a/8321709
                $array = array_flip(array_flip($array));

                $field['allowedFileTypes'] = wp_json_encode($array);
            }
        }
        ?>
		<input type="hidden" name="<?php esc_attr_e($field['name']); ?>" value="<?php esc_attr_e(!empty($found) ? $field['value'] : ''); ?>">
		<div class="UppyFileInput"
			data-fieldName="<?php esc_attr_e($field['name']); ?>"
			data-maxFileSize="<?php esc_attr_e((string) ($field['maxFileSize'] * 1024 * 1024)); ?>"
			data-allowedFileTypes="<?php esc_attr_e($field['allowedFileTypes']); ?>">
		</div>
		<div class="UppyStatusBar"></div>
		<div class="UppyInformer"></div>
		<div class="UppyResponse">
			<?php if (!empty($found)) { ?>
				<a data-field-name="<?php esc_attr_e($field['name']); ?>" class="UppyDelete" href="javascript:;">
					<span class="dashicons dashicons-trash"></span>
				</a>
				<a href="
				<?php
                echo esc_url(
                    home_url('/'.apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/base_path', ACF_UPPY_NAME).'/download/'.trailingslashit($post->ID).trailingslashit($hash))
                );
			    ?>
				"><?php esc_html_e($field['value']); ?></a> (<?php echo size_format((int) filesize($destFile), 2); ?>)
				<?php
			}
        ?>
		</div>
		<?php
    }

    /**
     * This action is called in the admin_enqueue_scripts action on the edit screen where your field is created.
     * Use this action to add CSS + JavaScript to assist your render_field() action.
     *
     * @throws ReadErrorException
     */
    public function input_admin_enqueue_scripts(): void
    {
        // register & include JS
        $paths = glob($this->settings['path'].'/asset/js'.(!empty(WP_DEBUG) ? '' : '/min').'/npm/*.js');

        if (false === $paths) {
            throw new ReadErrorException('error reading '.$this->settings['path'].'/asset/js'.(!empty(WP_DEBUG) ? '' : '/min').'/npm/*.js');
        }

        foreach ($paths as $file) {
            wp_register_script(
                $this->name.'-npm-'.basename($file, '.js'),
                $this->settings['url'].'asset/js'.(!empty(WP_DEBUG) ? '' : '/min').'/npm/'.basename($file),
                ['acf-input'],
                $this->settings['version'],
                true
            );
            wp_enqueue_script($this->name.'-npm-'.basename($file, '.js'));
        }

        $paths = glob($this->settings['path'].'/asset/js'.(!empty(WP_DEBUG) ? '' : '/min').'/*.js');

        if (false === $paths) {
            throw new ReadErrorException('error reading '.$this->settings['path'].'/asset/js'.(!empty(WP_DEBUG) ? '' : '/min').'/*.js');
        }

        foreach ($paths as $file) {
            wp_register_script(
                $this->name.'-'.basename($file, '.js'),
                $this->settings['url'].'asset/js'.(!empty(WP_DEBUG) ? '' : '/min').'/'.basename($file),
                ['acf-input'],
                $this->settings['version'],
                true
            );

            if ('main' === basename($file, '.js')) {
                wp_localize_script($this->name.'-'.basename($file, '.js'), $this->name.'L10n', $this->l10n);
            }

            wp_enqueue_script($this->name.'-'.basename($file, '.js'));
        }

        $files = [
            'asset/js/locales/@uppy/'.get_locale().'.min.js',
        ];

        foreach ($files as $file) {
            if (file_exists($this->settings['path'].'/'.$file)) {
                wp_register_script(
                    $this->name.'-'.basename(\dirname($file)).'-'.basename($file, '.js'),
                    $this->settings['url'].$file,
                    ['acf-input'],
                    $this->settings['version'],
                    true
                );
                wp_enqueue_script($this->name.'-'.basename(\dirname($file)).'-'.basename($file, '.js'));

                if ('@uppy' === basename(\dirname($file))) {
                    wp_add_inline_script($this->name.'-'.basename(\dirname($file)).'-'.basename($file, '.js'), 'window.Uppy.locales = []', 'before');
                }
            }
        }

        // register & include CSS
        $paths = glob($this->settings['path'].'/asset/css'.(!empty(WP_DEBUG) ? '' : '/min').'/npm/*.css');

        if (false === $paths) {
            throw new ReadErrorException('error reading '.$this->settings['path'].'/asset/css'.(!empty(WP_DEBUG) ? '' : '/min').'/npm/*.css');
        }

        foreach ($paths as $file) {
            wp_register_style(
                $this->name.'-npm-'.basename($file, '.css'),
                $this->settings['url'].'asset/css'.(!empty(WP_DEBUG) ? '' : '/min').'/npm/'.basename($file),
                ['acf-input'],
                $this->settings['version']
            );
            wp_enqueue_style($this->name.'-npm-'.basename($file, '.css'));
        }

        $paths = glob($this->settings['path'].'/asset/css'.(!empty(WP_DEBUG) ? '' : '/min').'/*.css');

        if (false === $paths) {
            throw new ReadErrorException($this->settings['path'].'/asset/css'.(!empty(WP_DEBUG) ? '' : '/min').'/*.css');
        }

        foreach ($paths as $path) {
            wp_register_style(
                $this->name.'-'.basename($path, '.css'),
                $this->settings['url'].'asset/css'.(!empty(WP_DEBUG) ? '' : '/min').'/'.basename($path),
                ['acf-input'],
                $this->settings['version']
            );
            wp_enqueue_style($this->name.'-'.basename($path, '.css'));
        }
    }

    /**
     * This filter is applied to the $value before it is saved in the db.
     *
     * @param array $field the field array holding all the field options
     *
     * @return mixed
     */
    public function update_value(mixed $value, mixed $post_id, $field)
    {
        // ACF saves drafts without validation!
        // https://support.advancedcustomfields.com/forums/topic/is-it-possible-to-apply-validation-to-draft-post/
        // https://github.com/AdvancedCustomFields/acf/blob/master/includes/forms/form-post.php#L311
        if (!empty($value) && empty($this->paths)) {
            $postTypes = array_merge(apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/custom_post_types', []), ['post', 'page']);

            if (\in_array(get_post_type($post_id), $postTypes, true)) {
                $post = get_post($post_id);

                if ('draft' === $post->post_status) {
                    acf_validate_save_post();
                }
            }
        }

        if (!empty($value) && !empty($this->paths)) {
            $value = sanitize_file_name($value);

            $paths = array_shift($this->paths);

            if (!empty($paths['tmp'])) {
                if (basename($paths['tmp']) !== $value) {
                    wp_die(
                        \sprintf(
                            // translators: %1$s: tmpPath, %2$s: file
                            __('Wrong tmpPath (%1$s) of file (%2$s)', ACF_UPPY_NAME),
                            $paths['tmp'],
                            $value
                        ),
                        500,
                        ['back_link' => true]
                    );
                }
            }

            if (!empty($paths['dest'])) {
                $destPath = \dirname($paths['dest']);
                $value = basename($paths['dest']);

                if (false === wp_mkdir_p($destPath)) {
                    wp_die(
                        \sprintf(
                            // translators: %1$s: destPath
                            __('Error creating destPath (%1$s)', ACF_UPPY_NAME),
                            $destPath
                        ),
                        500,
                        ['back_link' => true]
                    );
                }

                if (!empty($paths['tmp'])) {
                    // https://wordpress.stackexchange.com/a/370377/99214
                    if (!\function_exists('WP_Filesystem_Direct')) {
                        require_once ABSPATH.'wp-admin/includes/class-wp-filesystem-base.php';

                        require_once ABSPATH.'wp-admin/includes/class-wp-filesystem-direct.php';
                    }

                    $wpFilesystemDirect = new \WP_Filesystem_Direct(null);

                    if (false === $wpFilesystemDirect->move($paths['tmp'], $paths['dest'])) {
                        wp_die(
                            \sprintf(
                                // translators: %1$s: tmpPath, %2$s: destPath
                                __('Error moving file from (%1$s) to (%2$s)', ACF_UPPY_NAME),
                                $paths['tmp'],
                                $paths['dest']
                            ),
                            500,
                            ['back_link' => true]
                        );
                    }
                }
            }
        }

        return $value;
    }

    /**
     * This filter is used to perform validation on the value prior to saving.
     * All values are validated regardless of the field's required setting.
     * This allows you to validate and return messages to the user if the value is not correct.
     *
     * @param bool   $valid validation status based on the value and the field's required setting
     * @param array  $field the field array holding all the field options
     * @param string $input the corresponding input name for $_POST value
     *
     * @return bool
     */
    public function validate_value($valid, mixed $value, $field, $input)
    {
        $value = sanitize_file_name($value);

        $postId = (int) ($_POST['post_ID'] ?? $_POST['post_id']);

        $postType = get_post_type($postId);

        $tmpPath = trailingslashit($this->settings['tmpPath']).trailingslashit(sanitize_file_name($input));

        $destPath = !empty($field['destPath']) ? trailingslashit($field['destPath']) : apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/dest_path/type='.$postType, trailingslashit($this->settings['destPath']), $postId, $field);
        $destPath .= trailingslashit((string) $postId).trailingslashit(sanitize_file_name($field['key']));

        if (!empty($field['required']) && empty($value)) {
            $valid = false;
        } elseif (!empty($value) && !file_exists($tmpPath.$value) && !file_exists($destPath.$value)) {
            // Basic usage
            $valid = false;

            // Advanced usage
            // $valid = __('File doesn\'t exists!', ACF_UPPY_NAME);
        }

        if (true === $valid && !empty($value)) {
            $paths = [];

            $paths['tmp'] = file_exists($tmpPath.$value) ? $tmpPath.$value : false;

            if (!empty($paths['tmp'])) {
                $pathinfo = pathinfo($value);

                $counter = 0;

                while (file_exists($destPath.$value)) {
                    $value = apply_filters(
                        ACF_UPPY_NAME_UNDERSCORE.'/file_name_exists',
                        $pathinfo['filename'].
                        '-'.
                        ++$counter.
                        (isset($pathinfo['extension']) ? '.'.$pathinfo['extension'] : ''),
                        $destPath,
                        $pathinfo,
                        $counter
                    );
                }
            }

            $paths['dest'] = $destPath.apply_filters(ACF_UPPY_NAME_UNDERSCORE.'/file_name', $value, $destPath);

            $this->paths[] = $paths;
        }

        return $valid;
    }
}
