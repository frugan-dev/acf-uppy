<?php declare(strict_types=1);

/*
 * This file is part of the ACF Uppy Field WordPress plugin.
 *
 * (ɔ) Frugan <dev@frugan.it>
 *
 * This source file is subject to the GPLv3 or later license that is bundled
 * with this source code in the file COPYING.
 */

namespace AcfUppy\Middleware;

use TusPhp\Request;
use TusPhp\Response;
use TusPhp\Middleware\TusMiddleware;
use TusPhp\Tus\Server;

class UploadDir implements TusMiddleware
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
     * @param array{version:string,fieldType:string,url:string,path:string,destPath:string,tmpPath:string,symlinkUrl:string,symlinkPath:string,cacheTtl:string} $settings
     */
    public function __construct(
        array $settings,
        Server $server
    ) {
        $this->settings = $settings;
        $this->server = $server;
    }

    /**
     * @throws \Exception
     */
    public function handle(Request $request, Response $response): void
    {
        if ($request->method() !== 'GET') {
            $fieldName = $request->header('Field-Name');
            if (null === $fieldName) {
                throw new \Exception(__('Wrong headers', ACF_UPPY_NAME));
            }

            $fieldName = sanitize_file_name($fieldName);

            $this->server->setUploadDir(trailingslashit($this->settings['tmpPath']) . $fieldName);

            if (!is_dir($this->server->getUploadDir())) {
                wp_mkdir_p($this->server->getUploadDir());

                //https://github.com/ankitpokhrel/tus-php/issues/102
                /*$cacheKeys = $this->server->getCache()->keys();
                //$this->server->getCache()->deleteAll( $cacheKeys );

                foreach( $cacheKeys as $cacheKey ) {

                    if ( $oldFileMeta = $this->server->getCache()->get($cacheKey) ) {

                        if( preg_match('~'.preg_quote( '/'.get_current_user_id().'/'.$fieldName.'/' ).'~', $oldFileMeta['file_path'] ) ) {
                            $this->server->getCache()->delete( $cacheKey );
                        }
                    }
                }*/
            }
        }
    }
}
