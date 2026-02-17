---
template: documentation_block
title: 'Jak używać modułu "Tekst i Obraz (Podstawowy)"'
intro_text: "Hej! To jest Twój najważniejszy i najbardziej elastyczny moduł. Służy do tworzenia wszystkich sekcji, które mają układ \"Obraz + Tekst\". Możesz go używać do opisywania usług, prezentowania produktów, dodawania cenników i wielu innych.\n\nOto jak wypełnić jego pola:\n"
sections:
    -
        title: '1. Zakładka: 📜 Treść'
        description: 'To są podstawowe elementy bloku.'
        fields:
            -
                name: Tytuł
                help: 'Główny nagłówek sekcji (np. "Wylewki, płytki, okładziny").'
            -
                name: 'Podtytuł (opcjonalny)'
                help: 'Mały tekst, który pojawia się *nad* głównym tytułem. Użyj go, jeśli chcesz coś wyróżnić (jak w sekcji "Potrzebujesz pomocy?").'
            -
                name: Zdjęcie
                help: 'Wybierz obrazek z galerii, który pojawi się w jednej z kolumn.'
            -
                name: 'Tekst alternatywny dla zdjęcia (SEO)'
                help: 'Ważne dla Google. Opisz krótko, co jest na zdjęciu (np. "Renowacja starego nagrobka granitowego").'
            -
                name: 'Główny tekst'
                help: 'Najważniejsze pole. To duży edytor tekstu, w którym możesz używać Markdown (np. `**pogrubienie**` lub `* lista`).'
    -
        title: '2. Zakładka: ℹ️ Linie Informacyjne'
        description: 'Ta zakładka służy do dodawania wyróżnionych linii z informacjami, najczęściej o **cenie** lub **dostępności**.'
        fields:
            -
                name: Etykieta
                help: 'Tekst przed wartością (np. "Cena:", "Pomnik granitowy:", "Dostępność:").'
            -
                name: Wartość
                help: 'Właściwa informacja (np. "od 1000 PLN", "trudno dostępne").'
            -
                name: Styl
                help: '"Standardowy" (normalny) lub "Wyróżniony" (doda ciemne tło).'
    -
        title: '3. Zakładka: 🔘 Przyciski'
        description: 'Tutaj możesz dodać jeden lub więcej przycisków na dole sekcji. **Jeśli zostawisz tę listę pustą, żadne przyciski się nie pojawią.**'
        fields:
            -
                name: 'Tekst na przycisku'
                help: 'To, co widzi użytkownik (np. "Skontaktuj się").'
            -
                name: Link
                help: 'Dokąd ma prowadzić przycisk (np. "#kontakt" lub "/oferta").'
            -
                name: 'Wygląd przycisku'
                help: 'Wybierz z listy styl (np. "CTA (Czerwony)").'
    -
        title: '4. Zakładka: ⚙️ Ustawienia'
        description: 'Tutaj kontrolujesz ogólny wygląd modułu.'
        fields:
            -
                name: 'Układ (Kolejność)'
                help: 'Pozwala Ci wybrać, czy chcesz mieć "Obraz po lewej, Tekst po prawej" czy odwrotnie.'
            -
                name: 'Styl obrazka'
                help: 'Możesz wybrać, czy obrazek ma mieć "złotą ramkę", czy ma być np. "zaokrąglony".'
            -
                name: 'ID Sekcji (opcjonalne)'
                help: 'Jeśli chcesz, aby można było do tej sekcji zalinkować (np. z menu), wpisz tu krótką nazwę bez spacji (np. "wylewki").'
---

