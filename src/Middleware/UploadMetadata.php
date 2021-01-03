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

use Symfony\Component\HttpFoundation\HeaderUtils;
use TusPhp\Request;
use TusPhp\Response;
use TusPhp\Middleware\TusMiddleware;

class UploadMetadata implements TusMiddleware
{
    public function handle(Request $request, Response $response): void
    {
        if ($request->method() !== 'GET') {
            if (!empty($uploadMetadataArr = $request->extractAllMeta())) {
                if (!empty($uploadMetadataArr['name'])) {
                    $uploadMetadataArr['name'] = sanitize_file_name($uploadMetadataArr['name']);
                }

                if (!empty($uploadMetadataArr['filename'])) {
                    $uploadMetadataArr['filename'] = sanitize_file_name($uploadMetadataArr['filename']);
                }

                //https://stackoverflow.com/a/3432266
                $uploadMetadataArr = array_map('base64_encode', $uploadMetadataArr);

                //$uploadMetadata = HeaderUtils::toString($uploadMetadataArr, ',');

                $uploadMetadata = '';
                foreach ($uploadMetadataArr as $key => $value) {
                    if (!empty($uploadMetadata)) {
                        $uploadMetadata .= ',';
                    }

                    $uploadMetadata .= $key.' '.$value;
                }

                $request->getRequest()->headers->set('Upload-Metadata', $uploadMetadata);
            }
        }
    }
}
