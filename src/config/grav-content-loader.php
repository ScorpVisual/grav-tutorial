<?php
// test-frontend/src/config/grav-content-loader.php

// KROK 1: Zdefiniuj ścieżkę do stron Grav (tak jak już to zrobiłeś)
if (!defined('GRAV_PAGES_PATH')) {
    define('GRAV_PAGES_PATH', 'C:/Users/marce/Documents/GitHub/grav-tutorial/user/pages/');
}

// KROK 2: Dodaj instrukcje 'use' dla potrzebnych bibliotek
// Te biblioteki zostały zainstalowane przez Composer w Twoim projekcie test-frontend
use Symfony\Component\Yaml\Yaml;
use Parsedown;

// KROK 3: Dodaj funkcje do pobierania i parsowania treści

/**
 * Pobiera i parsuje zawartość pojedynczej strony/postu Grav.
 * @param string $relativePagePath Ścieżka względna do pliku .md wewnątrz GRAV_PAGES_PATH
 * np. '01.blog/moj-pierwszy-post/item.md'
 * @return array|null Dane strony lub null, jeśli nie znaleziono lub błąd.
 */
function get_grav_page_content(string $relativePagePath): ?array {
    $fullPath = rtrim(GRAV_PAGES_PATH, '/') . '/' . ltrim($relativePagePath, '/');

    if (!file_exists($fullPath) || !is_readable($fullPath)) {
        error_log("Plik nie istnieje lub nie jest czytelny: " . $fullPath);
        return null;
    }

    $fileContent = file_get_contents($fullPath);
    if ($fileContent === false) {
        error_log("Nie można odczytać zawartości pliku: " . $fullPath);
        return null;
    }

    // Wzorzec do rozdzielenia frontmatter (YAML) od reszty treści (Markdown)
    // Zakłada, że frontmatter jest na początku, między potrójnymi myślnikami ---
    preg_match('/^---\s*[\r\n]+(.*?[\r\n]+)---[\r\n]+(.*)$/s', $fileContent, $matches);

    $frontmatter = [];
    $markdownContent = '';

    if (count($matches) === 3) {
        try {
            $frontmatter = Yaml::parse(trim($matches[1]));
        } catch (\Symfony\Component\Yaml\Exception\ParseException $e) {
            error_log("Błąd parsowania YAML dla pliku " . $fullPath . ": " . $e->getMessage());
            $frontmatter = ['title' => 'Błąd Parsowania Frontmatter']; // Domyślne w razie błędu
        }
        $markdownContent = trim($matches[2]);
    } else {
        // Jeśli nie znaleziono frontmatter, cała zawartość jest traktowana jako Markdown
        // (lub możesz zdecydować o zwróceniu błędu/null)
        $markdownContent = trim($fileContent);
        error_log("Nie znaleziono frontmatter (lub wzorzec nie pasował) dla pliku: " . $fullPath);
    }

    $parsedown = new Parsedown();
    $htmlContent = $parsedown->text($markdownContent);

    return [
        'header' => $frontmatter, // Cały sparsowany frontmatter jako tablica
        'content_html' => $htmlContent, // Treść Markdown przekonwertowana na HTML
        'title' => $frontmatter['title'] ?? 'Brak Tytułu', // Dostęp do konkretnego pola 'title'
        'slug' => basename(dirname($fullPath)), // Nazwa katalogu nadrzędnego jako slug
        'modified_time' => filemtime($fullPath) // Data ostatniej modyfikacji pliku
    ];
}

/**
 * Pobiera listę postów/stron z danej kolekcji (katalogu) w Grav.
 * @param string $collectionPath Ścieżka do kolekcji wewnątrz GRAV_PAGES_PATH, np. '01.blog/'
 * @return array Lista stron/postów, gdzie każdy element to tablica zwrócona przez get_grav_page_content.
 */
function get_grav_blog_posts(string $collectionPath = '01.blog/'): array {
    $fullCollectionPath = rtrim(GRAV_PAGES_PATH, '/') . '/' . trim($collectionPath, '/');
    $posts = [];

    if (!is_dir($fullCollectionPath)) {
        error_log("Katalog kolekcji nie istnieje: " . $fullCollectionPath);
        return $posts; // Zwróć pustą tablicę, jeśli katalog kolekcji nie istnieje
    }

    // Używamy DirectoryIterator do przeglądania katalogów
    try {
        $iterator = new DirectoryIterator($fullCollectionPath);
        foreach ($iterator as $fileinfo) {
            // Interesują nas tylko podkatalogi (każdy post w osobnym folderze)
            if ($fileinfo->isDir() && !$fileinfo->isDot()) {
                $postDirName = $fileinfo->getFilename();
                // Standardowo w Grav, główny plik treści w kolekcji to 'item.md'
                // Jeśli używasz innej nazwy (np. page.md), dostosuj poniżej
                $itemMdPath = trim($collectionPath, '/') . '/' . $postDirName . '/item.md';
                
                $pageData = get_grav_page_content($itemMdPath);
                if ($pageData) {
                    $posts[] = $pageData;
                }
            }
        }
    } catch (Exception $e) {
        error_log("Błąd podczas iteracji po katalogu " . $fullCollectionPath . ": " . $e->getMessage());
        return []; // Zwróć pustą tablicę w razie błędu
    }
    

    // Sortowanie postów po dacie (od najnowszych do najstarszych)
    // Zakładamy, że data jest w $pageData['header']['date'] lub używamy daty modyfikacji pliku
    usort($posts, function ($a, $b) {
        $dateA = isset($a['header']['date']) ? strtotime($a['header']['date']) : $a['modified_time'];
        $dateB = isset($b['header']['date']) ? strtotime($b['header']['date']) : $b['modified_time'];
        return $dateB <=> $dateA; // Dla sortowania malejącego (najnowsze pierwsze)
    });

    return $posts;
}
?>