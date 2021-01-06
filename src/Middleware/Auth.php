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

class Auth implements TusMiddleware
{
    /**
     * @throws \Exception
     */
    public function handle(Request $request, Response $response): void
    {
        if (!is_user_logged_in()) {
            throw new \Exception(__('Unauthorized', ACF_UPPY_NAME));
        }
    }
}
