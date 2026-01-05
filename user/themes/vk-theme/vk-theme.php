<?php
namespace Grav\Theme;

use Grav\Common\Theme;
use Grav\Common\Grav;

class VkTheme extends Theme
{
    /**
     * @return array
     * The events subscribed to by this theme
     */
    public static function getSubscribedEvents(): array
    {
        return [
            'onTwigInitialized' => ['onTwigInitialized', 0],
            'onAssetsInitialized' => ['onAssetsInitialized', 0]
        ];
    }
    
public function onAssetsInitialized() {
    if ($this->isAdmin()) {
        $this->grav['assets']->addCss('user://themes/vk-theme/admin/admin.css', ['priority' => 10]);
    }
}

    /**
     * Listen to the onTwigInitialized event and add our custom data.
     */
    public function onTwigInitialized(): void
    {
        $productsPath = __DIR__ . '/_data/product-listing.json';
        $stonesPath = __DIR__ . '/_data/stone-options.json';

        // 1. Ładowanie produktów
        if (file_exists($productsPath)) {
            $productsJson = file_get_contents($productsPath);
            $productsData = json_decode($productsJson, true);
            if (is_array($productsData)) {
                $this->grav['twig']->twig_vars['all_products'] = $productsData;
            }
        }
        
        // 2. Ładowanie kamieni (POPRAWIONE)
        if (file_exists($stonesPath)) {
            $stonesJson = file_get_contents($stonesPath);
            $stonesData = json_decode($stonesJson, true);
            if (is_array($stonesData)) {
                // TU BYŁ BŁĄD: Zmieniamy nazwę zmiennej na 'stone_options'
                // żeby nie nadpisać 'all_products'
                $this->grav['twig']->twig_vars['stone_options'] = $stonesData;
            }
        }
    }

    /**
     * Funkcja dla Admina (Blueprint)
     */
    public static function getStoneOption() {
        $stonesPath = __DIR__ . '/_data/stone-options.json';
        $stoneOptionsListing = []; // Tablica wynikowa

        if (file_exists($stonesPath)) {
            $stonesJson = file_get_contents($stonesPath);
            $stonesData = json_decode($stonesJson, true);
            
            if ($stonesData && is_array($stonesData)) {
                foreach ($stonesData as $key => $item) {
                    $label = isset($item['name']) ? $item['name'] : $key;
                    
                    // TU BYŁ BŁĄD: Musimy dodawać do tablicy WYNIKOWEJ ($stoneOptionsListing),
                    // a nie nadpisywać tablicę źródłową ($stonesData)
                    $stoneOptionsListing[$key] = $label;
                }
            }
        }
        
        // Teraz zwracamy pełną tablicę
        return $stoneOptionsListing;
    }
}

    //     // 1. Zbuduj ścieżkę do Twojego pliku JSON
    //     $productsPath = __DIR__ . '/_data/product-listing.json';

    //     // 2. Sprawdź, czy plik istnieje, zanim spróbujesz go odczytać
    //     if (file_exists($productsPath)) {
    //         // 3. Odczytaj zawartość pliku
    //         $jsonContent = file_get_contents($productsPath);
            
    //         // 4. Zdekoduj JSON na tablicę PHP (parametr `true`)
    //         $productsData = json_decode($jsonContent, true);

    //         // 5. Jeśli dane są poprawne, dodaj je do globalnych zmiennych Twiga
    //         if (is_array($productsData)) {
    //             $this->grav['twig']->twig_vars['all_products'] = $productsData;
    //         }
    //     }
    // }

    // public static function getStoneOption() {
    //     $stonesPath = __DIR__ . '/_data/stone-options.json';

    //     if (file_exists($stonesPath)) {
    //         $jsonContent = file_get_contents($stonesPath);
    //         $stonesData = json_decode($jsonContent, true);

    //         $stonesData = [];
    //         if ($stonesData && is_array($stonesData)) {
    //             foreach ($stonesData as $key => $item) {
    //                 $label = isset($item['name']) ? $item['name'] : $key;
    //                 $stonesData[$key] = $label;
    //             }
    //         }
    //         return $stonesData;
    //     }
