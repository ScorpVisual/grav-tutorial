<?php
ini_set('display_errors', 1); error_reporting(E_ALL);
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/config/grav-content-loader.php';

$slug = $_GET['slug'] ?? null;
$articleData = null;
$pageTitle = "Artykuł"; // Domyślny tytuł

if ($slug) {
    // Pamiętaj, że Twoje posty blogowe są w '01.blog/' i mają plik 'item.md'
    $articleData = get_grav_page_content('01.blog/' . $slug . '/item.md');
}

if ($articleData) {
    $pageTitle = $articleData['title'];
} else {
    http_response_code(404); // Ustaw kod błędu, jeśli artykuł nie istnieje
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
    <link href="css/tailwind-output.css" rel="stylesheet">
</head>
<body class="bg-gray-100 text-gray-800">
    <div class="container mx-auto p-4">
        <?php if ($articleData): ?>
            <article class="bg-white p-6 md:p-8 rounded-lg shadow-md">
                <h1 class="text-4xl font-bold mb-4"><?php echo htmlspecialchars($articleData['title']); ?></h1>
                <?php if (isset($articleData['header']['date'])): ?>
                    <p class="text-sm text-gray-500 mb-6">
                        Opublikowano: <?php echo date('d.m.Y', strtotime($articleData['header']['date'])); ?>
                    </p>
                <?php endif; ?>

                <div class="prose lg:prose-xl max-w-none"> {/* Klasy 'prose' od Tailwind mogą pomóc w stylowaniu treści z Markdown */}
                    <?php echo $articleData['content_html']; // Ta treść jest już HTML, nie używaj htmlspecialchars ?>
                </div>
            </article>
        <?php else: ?>
            <h1 class="text-4xl font-bold mb-4">404 - Nie znaleziono artykułu</h1>
            <p>Przepraszamy, artykuł, którego szukasz, nie istnieje.</p>
        <?php endif; ?>
        <p class="mt-8"><a href="blog.php" class="text-blue-600 hover:text-blue-800">&larr; Powrót do listy postów</a></p>
    </div>
</body>
</html>