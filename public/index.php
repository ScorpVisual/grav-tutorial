<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Poniżej reszta Twojego kodu HTML/PHP dla index.php
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moja Strona Główna</title>
    <link href="css/tailwind-output.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
    
    <div class="text-center p-8">
        <h1 class="text-5xl font-bold mb-4">Witaj na Mojej Stronie!</h1>
        <p class="text-xl text-gray-300 mb-8">
            Ta strona używa Tailwind CSS i ma ciemne tło.
        </p>
        <p class="mb-2">
            Treści blogowe i SEO będą pobierane z Grava (Headless CMS).
        </p>
        <a href="blog.php" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Przejdź do Bloga (placeholder)
        </a>
    </div>

    <footer class="absolute bottom-4 text-gray-500 text-sm">
        &copy; <?php echo date("Y"); ?> Moja Strona. Wszelkie prawa zastrzeżone.
    </footer>

</body>
</html>