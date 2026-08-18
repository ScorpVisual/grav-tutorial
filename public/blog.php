<?php
ini_set('display_errors', 1); error_reporting(E_ALL); // Dla developmentu
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/config/grav-content-loader.php';

$pageTitle = "Nasz Blog";
$posts = get_grav_blog_posts('01.blog/'); // Pobierz wszystkie posty
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
    <link href="css/tailwind-output.css" rel="stylesheet"> {/* Lub css/style.css jeśli to Twój główny plik */}
</head>
<body class="bg-gray-100 text-gray-800"> {/* Przykładowe klasy dla jasnego tła */}
    <div class="container mx-auto p-4">
        <h1 class="text-4xl font-bold mb-6"><?php echo htmlspecialchars($pageTitle); ?></h1>

        <?php if (!empty($posts)): ?>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <?php foreach ($posts as $post): ?>
                    <article class="bg-white p-6 rounded-lg shadow-md">
                        <h2 class="text-2xl font-semibold mb-2">
                            <a href="artykul.php?slug=<?php echo htmlspecialchars($post['slug']); ?>" class="text-blue-600 hover:text-blue-800">
                                <?php echo htmlspecialchars($post['title']); ?>
                            </a>
                        </h2>
                        <?php if (isset($post['header']['date'])): ?>
                            <p class="text-sm text-gray-500 mb-2">
                                Opublikowano: <?php echo date('d.m.Y', strtotime($post['header']['date'])); ?>
                            </p>
                        <?php endif; ?>
                        <?php if (isset($post['header']['summary'])): ?>
                            <p class="text-gray-700 mb-4"><?php echo htmlspecialchars($post['header']['summary']); ?></p>
                        <?php endif; ?>
                        <a href="artykul.php?slug=<?php echo htmlspecialchars($post['slug']); ?>" class="text-blue-600 hover:text-blue-800 font-semibold">Czytaj dalej &rarr;</a>
                    </article>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <p>Brak postów do wyświetlenia.</p>
        <?php endif; ?>
        <p class="mt-8"><a href="index.php" class="text-blue-600 hover:text-blue-800">&larr; Powrót na stronę główną</a></p>
    </div>
</body>
</html>