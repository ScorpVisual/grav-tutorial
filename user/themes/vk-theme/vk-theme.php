<?php
namespace Grav\Theme;

use Grav\Common\Theme;

class VkTheme extends Theme
{
    /**
     * @return array
     * The events subscribed to by this theme
     */
    public static function getSubscribedEvents(): array
    {
        return [
            'onTwigInitialized' => ['onTwigInitialized', 0]
        ];
    }

    /**
     * Listen to the onTwigInitialized event and add our custom data.
     */
    public function onTwigInitialized(): void
    {
        // 1. Zbuduj ścieżkę do Twojego pliku JSON
        $jsonFilePath = __DIR__ . '/_data/product-listing.json';

        // 2. Sprawdź, czy plik istnieje, zanim spróbujesz go odczytać
        if (file_exists($jsonFilePath)) {
            // 3. Odczytaj zawartość pliku
            $jsonContent = file_get_contents($jsonFilePath);
            
            // 4. Zdekoduj JSON na tablicę PHP (parametr `true`)
            $productsData = json_decode($jsonContent, true);

            // 5. Jeśli dane są poprawne, dodaj je do globalnych zmiennych Twiga
            if (is_array($productsData)) {
                $this->grav['twig']->twig_vars['all_products'] = $productsData;
            }
        }
    }
}