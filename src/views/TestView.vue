<template>
  <div class="min-h-screen bg-telegram-bg p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-telegram-text mb-8 text-center">
        Тестовая страница иконок
      </h1>

      <!-- Заказы -->
      <div class="mb-12">
        <h2 class="text-xl font-semibold text-telegram-text mb-6">📋 Заказы</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
          <!-- Вариант 1 - Clipboard (лучший) -->
          <div
            class="flex flex-col items-center p-4 bg-telegram-card rounded-lg border-2 border-telegram-accent"
          >
            <div class="w-8 h-8 text-telegram-accent mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text font-medium">Clipboard</span>
            <span class="text-xs text-telegram-accent">✨ Лучший</span>
          </div>

          <!-- Вариант 2 - Document -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Document</span>
          </div>

          <!-- Вариант 3 - List -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">List</span>
          </div>

          <!-- Вариант 4 - Shopping bag -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Shopping</span>
          </div>

          <!-- Вариант 5 - Folder -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Folder</span>
          </div>

          <!-- Вариант 6 - File text -->
          <div
            class="flex flex-col items-center p-4 bg-telegram-card rounded-lg border-2 border-blue-500"
          >
            <div class="w-8 h-8 text-blue-500 mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6M16 13H8M16 17H8M10 9H8"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text font-medium">File Text</span>
            <span class="text-xs text-blue-500">💙 Хорош</span>
          </div>

          <!-- Вариант 7 - Check square -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Check</span>
          </div>

          <!-- Вариант 8 - Package -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M12 11L4 7"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Package</span>
          </div>

          <!-- Вариант 9 - Inbox -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0l-2.172-2.172a2 2 0 00-1.414-.586H7.586a2 2 0 00-1.414.586L4 13"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Inbox</span>
          </div>

          <!-- Вариант 10 - Calendar -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Calendar</span>
          </div>

          <!-- Вариант 11 - Clock -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Clock</span>
          </div>

          <!-- Вариант 12 - Bookmark -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Bookmark</span>
          </div>
        </div>
      </div>

      <!-- Услуги -->
      <div class="mb-12">
        <h2 class="text-xl font-semibold text-telegram-text mb-6">🛠️ Услуги</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
          <!-- Вариант 1 - Briefcase (лучший) -->
          <div
            class="flex flex-col items-center p-4 bg-telegram-card rounded-lg border-2 border-telegram-accent"
          >
            <div class="w-8 h-8 text-telegram-accent mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2m0 0v.01M6 6h12l1 12H5L6 6z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text font-medium">Briefcase</span>
            <span class="text-xs text-telegram-accent">✨ Лучший</span>
          </div>

          <!-- Вариант 2 - Tools -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Tools</span>
          </div>

          <!-- Вариант 3 - Grid -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Grid</span>
          </div>

          <!-- Вариант 4 - Collection -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Collection</span>
          </div>

          <!-- Вариант 5 - Star -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Star</span>
          </div>

          <!-- Вариант 6 - Service -->
          <div
            class="flex flex-col items-center p-4 bg-telegram-card rounded-lg border-2 border-purple-500"
          >
            <div class="w-8 h-8 text-purple-500 mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m0 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text font-medium">Service</span>
            <span class="text-xs text-purple-500">💜 Хорош</span>
          </div>

          <!-- Вариант 7 - Lightbulb -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Lightbulb</span>
          </div>

          <!-- Вариант 8 - Puzzle -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Puzzle</span>
          </div>

          <!-- Вариант 9 - Wrench -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Wrench</span>
          </div>

          <!-- Вариант 10 - Hand -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 113 0v1m0 0V11m0-5.5a1.5 1.5 0 113 0v3m-3 0a1.5 1.5 0 103 0m-3 3V20a2 2 0 104 0v-2m-4 2v-4m4 0V9a2 2 0 10-4 0v11"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Hand</span>
          </div>

          <!-- Вариант 11 - Shield -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Shield</span>
          </div>

          <!-- Вариант 12 - Target -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Target</span>
          </div>
        </div>
      </div>

      <!-- Репетитор -->
      <div class="mb-12">
        <h2 class="text-xl font-semibold text-telegram-text mb-6">👨‍🏫 Репетитор</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
          <!-- Вариант 1 - Presentation (лучший) -->
          <div
            class="flex flex-col items-center p-4 bg-telegram-card rounded-lg border-2 border-telegram-accent"
          >
            <div class="w-8 h-8 text-telegram-accent mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v10a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1h10zM7 21h10M12 17v4"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text font-medium">Presentation</span>
            <span class="text-xs text-telegram-accent">✨ Лучший</span>
          </div>

          <!-- Вариант 2 - Chalkboard -->
          <div
            class="flex flex-col items-center p-4 bg-telegram-card rounded-lg border-2 border-green-500"
          >
            <div class="w-8 h-8 text-green-500 mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21h10M7 21V7a2 2 0 012-2h6a2 2 0 012 2v14M7 21l-3-3M17 21l3-3M12 3v4M8 8h8M8 12h8M8 16h8"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text font-medium">Chalkboard</span>
            <span class="text-xs text-green-500">🔥 Топ</span>
          </div>

          <!-- Вариант 3 - Teacher -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Teacher</span>
          </div>

          <!-- Вариант 4 - Brain -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Brain</span>
          </div>

          <!-- Вариант 5 - Book -->
          <div
            class="flex flex-col items-center p-4 bg-telegram-card rounded-lg border-2 border-orange-500"
          >
            <div class="w-8 h-8 text-orange-500 mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text font-medium">Book</span>
            <span class="text-xs text-orange-500">🔶 Простой</span>
          </div>

          <!-- Вариант 6 - Graduation -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Graduation</span>
          </div>

          <!-- Вариант 7 - Calculator -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Calculator</span>
          </div>

          <!-- Вариант 8 - Globe -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Globe</span>
          </div>

          <!-- Вариант 9 - Microscope -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Science</span>
          </div>

          <!-- Вариант 10 - Music -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Music</span>
          </div>

          <!-- Вариант 11 - Trophy -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Trophy</span>
          </div>

          <!-- Вариант 12 - Clock -->
          <div class="flex flex-col items-center p-4 bg-telegram-card rounded-lg">
            <div class="w-8 h-8 text-telegram-text mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span class="text-xs text-telegram-text">Schedule</span>
          </div>
        </div>
      </div>

      <!-- Рекомендации -->
      <div class="bg-telegram-card p-6 rounded-lg border border-telegram-border">
        <h3 class="text-lg font-semibold text-telegram-text mb-4">
          💡 Мои обновленные рекомендации:
        </h3>
        <div class="space-y-3 text-sm text-telegram-textSecondary">
          <div class="p-3 bg-telegram-secondary rounded">
            <div class="font-medium text-telegram-text">📋 Заказы — ТОП-3:</div>
            <div>1. <strong>Clipboard</strong> ✨ — четко показывает список задач</div>
            <div>2. <strong>File Text</strong> 💙 — понятно для документов</div>
            <div>3. <strong>Check</strong> — простой и знакомый символ</div>
          </div>

          <div class="p-3 bg-telegram-secondary rounded">
            <div class="font-medium text-telegram-text">🛠️ Услуги — ТОП-3:</div>
            <div>1. <strong>Briefcase</strong> ✨ — профессиональные услуги</div>
            <div>2. <strong>Service</strong> 💜 — прямо по назначению</div>
            <div>3. <strong>Grid</strong> — каталог услуг</div>
          </div>

          <div class="p-3 bg-telegram-secondary rounded">
            <div class="font-medium text-telegram-text">👨‍🏫 Репетитор — ТОП-3:</div>
            <div>1. <strong>Chalkboard</strong> 🔥 — классический символ обучения</div>
            <div>2. <strong>Presentation</strong> ✨ — современное преподавание</div>
            <div>3. <strong>Book</strong> 🔶 — простой и понятный</div>
          </div>

          <div class="text-xs text-telegram-textSecondary mt-4">
            <strong>Принципы выбора:</strong> простота, узнаваемость, интуитивность для
            пользователей любого возраста
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Пустой script setup для компонента
</script>
