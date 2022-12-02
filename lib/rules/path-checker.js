/* eslint-disable eslint-plugin/prefer-message-ids */
"use strict";

const path = require("path");

module.exports = {
  meta: {
    // eslint-disable-next-line eslint-plugin/require-meta-type
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
      category: "Fill me in",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const importTo = node.source.value
        const currentFile = context.getFilename()

        if (checkRelative(currentFile, importTo)) {
          context.report({node: node, message: "В пределах одного слайса импорты должны быть относительными"})
        }
      }
    };
  }
}

// перечень папок, импорты в которых обрабатываются плагином. Плагин не затрагивает
// импорт сторонних библиотек типа Redux
const layers = {
  'entities': 'entities',
  'app': 'app',
  'features': 'features',
  'widgets': 'widgets',
  'pages': 'pages',
  'shared': 'shared'
}

// если путь соответствует или начинается с данных строк, он относительный
function isPathRelative(path) {
  return path === '.' || path.startsWith('./') || path.startsWith('../')
}

function checkRelative(from, to) {
  // если путь относительный, завершаем проверку
  if (isPathRelative(to)) {
    return false
  }
  // поделим путь к файлу, куда импортируют, на части, например: features, LoginForm, ui, LoginForm.ts
  const toArray = to.split('/')
  // слой
  const toLayer = toArray[0]
  // слайс архитектурного слоя. Не путай с редаксовскими слайсами
  const toSlice = toArray[1]

  // если слоя, сегмента нет, или в перечне отслеживаемых папок нет такого слоя
  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false
  }


  // переобразуем путь к одному виду что на Windows, что на Ubuntu
  const normalizeFromPath = path.toNamespacedPath(from)
  // поскольку нас интересует только происходящее в проекте, все, что выше папки src
  // - отбрасываем, и берем слой, откуда импортируется значение
  const projectFrom = normalizeFromPath.split('src')[1]
  // теперь преобразуем в массив путь, откуда экспортируется файл
  const fromArray = projectFrom.split('\\')
  // слой
  const fromLayer = fromArray[1]
  // слайс
  const fromSlice = fromArray[2]

  // по аналогии
  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false
  }
  // собственно. если импорт идет из того же слайса и слоя, то он должен быть относительным
  return fromSlice === toSlice && fromLayer === toLayer
}


// // // импорт из той же фичи, где и находимся, т.е. внутри модуля - должен быть относительным
// console.log(checkRelative('C:/dev/Advanced-project/ULBI-project/src/features/AuthByUsername/LoginModal', 'features/AuthByUsername/LoginModal'));
// // // импорт в пределах слоя фичей, но из одной фичи в другую - должен быть абсолютным
// console.log(checkRelative('C:/dev/Advanced-project/ULBI-project/src/features/AuthByUsername/LoginModal', 'features/SomeOtherDirectory/SomeComponent'));
// // // импорт из одного слоя в другой - должен быть абсолютным
// console.log(checkRelative('C:/dev/Advanced-project/ULBI-project/src/features/AuthByUsername/LoginModal', 'widgets/SomeOtherDirectory/SomeComponent'));
// // // импорт из слоя в вышестоящий слой должен быть абсолютным
// console.log(checkRelative('C:/dev/Advanced-project/ULBI-project/src/features/AuthByUsername/LoginModal', 'app/index.ts'));