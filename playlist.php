<?php
header('Content-Type: application/json; charset=utf-8');

$playlistFile = __DIR__ . '/database/playlist.json';
$items = [];

if (file_exists($playlistFile)) {
    $json = file_get_contents($playlistFile);
    $data = json_decode($json, true);

    if (is_array($data)) {
        $items = array_values(array_filter($data, function ($item) {
            return is_array($item)
                && !empty($item['name'])
                && !empty($item['url']);
        }));
    }
}

echo json_encode([
    'ok' => true,
    'items' => $items
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
