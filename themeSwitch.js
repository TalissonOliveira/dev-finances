const html = document.querySelector('html')

// Function para definir o tema
function setTheme (themeName) {
    localStorage.setItem('theme', themeName) //Salvar informação no localStorage(chave, valor)
    html.classList.add('dark-mode')
}

function removeTheme () {
    localStorage.setItem('theme', '') //Salvar informação no localStorage(chave, valor)
    html.classList.remove('dark-mode')
}

// Function para trocar entre tema light e dark
function toggleTheme() {
    if (localStorage.getItem('theme') === 'dark-mode') {
        removeTheme()
    } else {
        setTheme('dark-mode')
    }
}

// Function auto executável (IIFE) para definir o tema no carregamento inicial
(function () {
    if (localStorage.getItem('theme') === 'dark-mode') {
        setTheme('dark-mode')
        document.querySelector('#checkbox').checked = true
    } else {
        removeTheme()
    }
}) ()
