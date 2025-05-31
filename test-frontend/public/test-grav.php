<?php
// test-frontend/public/test-grav.php

// KROK 1: Włącz pełne raportowanie błędów i dodaj znacznik debugujący
// Umieść to na SAMEJ GÓRZE pliku, przed jakimkolwiek innym kodem!
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
echo "DEBUG: Uruchomiono plik: " . __FILE__ . "<br><hr>"; // To potwierdzi, że ten plik się uruchamia

// KROK 2: Popraw ścieżki do plików i załaduj konfigurację oraz funkcje
// Zakładamy, że ten plik (test-grav.php) jest w test-frontend/public/
// a Twoje pliki vendor/ i src/ są w test-frontend/

// Autoloader Composera dla projektu test-frontend
require_once __DIR__ . '/../vendor/autoload.php'; 

// Załaduj plik z funkcjami do pobierania treści z Grav.
// Zakładamy, że grav-content-loader.php jest w test-frontend/src/config/
// i że ten plik (lub dołączany przez niego config.php) definiuje GRAV_PAGES_PATH.
require_once __DIR__ . '/../src/config/grav-content-loader.php'; 

echo "<h1>Test odczytu danych z Grav CMS</h1>";

// KROK 3: Sprawdź, czy stała GRAV_PAGES_PATH jest zdefiniowana
if (defined('GRAV_PAGES_PATH')) {
    echo "<p>INFO: Stała <strong>GRAV_PAGES_PATH</strong> jest zdefiniowana jako: <code>" . htmlspecialchars(GRAV_PAGES_PATH) . "</code></p>";
} else {
    echo "<p style='color:red; font-weight:bold;'>BŁĄD KRYTYCZNY: Stała GRAV_PAGES_PATH nie jest zdefiniowana! Sprawdź plik <code>test-frontend/src/config/config.php</code> (który powinien być ładowany przez `grav-content-loader.php`).</p>";
    exit; // Zakończ wykonywanie, jeśli ścieżka nie jest zdefiniowana
}

// KROK 4: Test pobrania konkretnego posta
// Upewnij się, że masz plik np. C:\Users\marce\Documents\GitHub\grav-tutorial\user\pages\01.blog\testowy-post\item.md
$relativePostPath = '01.blog/testowy-post/item.md'; 
echo "<hr><h2>Próba pobrania posta: <code>" . htmlspecialchars($relativePostPath) . "</code></h2>";

// Wywołanie funkcji z grav-content-loader.php
$postData = get_grav_page_content($relativePostPath); 

if ($postData) {
    echo "<p style='color:green;'>Sukces! Dane posta:</p>";
    echo "<pre>" . htmlspecialchars(print_r($postData, true)) . "</pre>";
} else {
    echo "<p style='color:red;'>Nie udało się pobrać posta. Możliwe przyczyny:</p>";
    echo "<ul>";
    echo "<li>Niepoprawna ścieżka względna do posta: <code>" . htmlspecialchars($relativePostPath) . "</code>.</li>";
    echo "<li>Plik nie istnieje w lokalizacji: <code>" . htmlspecialchars(GRAV_PAGES_PATH . $relativePostPath) . "</code>.</li>";
    echo "<li>Problem z uprawnieniami do odczytu pliku.</li>";
    echo "<li>Błąd w funkcji <code>get_grav_page_content</code> (sprawdź logi PHP, jeśli są).</li>";
    echo "</ul>";
}

// KROK 5: Test pobrania listy postów
echo "<hr><h2>Próba pobrania listy postów z kolekcji '01.blog/'</h2>";
// Upewnij się, że masz katalog C:\Users\marce\Documents\GitHub\grav-tutorial\user\pages\01.blog\
// i w nim jakieś podfoldery z plikami item.md
$blogCollectionPath = '01.blog/';
$blogPosts = get_grav_blog_posts($blogCollectionPath); // Wywołanie funkcji z grav-content-loader.php

if (!empty($blogPosts)) {
    echo "<p style='color:green;'>Sukces! Znaleziono postów: " . count($blogPosts) . "</p>";
    echo "<pre>Lista postów:\n" . htmlspecialchars(print_r($blogPosts, true)) . "</pre>";
} else {
    echo "<p style='color:red;'>Nie udało się pobrać listy postów lub kolekcja jest pusta. Możliwe przyczyny:</p>";
    echo "<ul>";
    echo "<li>Katalog kolekcji <code>" . htmlspecialchars(GRAV_PAGES_PATH . $blogCollectionPath) . "</code> nie istnieje lub jest pusty.</li>";
    echo "<li>Brak plików <code>item.md</code> w podkatalogach kolekcji.</li>";
    echo "<li>Problem z uprawnieniami do odczytu.</li>";
    echo "<li>Błąd w funkcji <code>get_grav_blog_posts</code>.</li>";
    echo "</ul>";
}
?>