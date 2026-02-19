<script setup lang="ts">
import { Button } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'
import { ProfileFormCard } from './ui'
import { useEditTutorProfile } from './hooks'

const { user, form, isLoading, isSaving, handleSave, handleBack } = useEditTutorProfile()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="flex items-center justify-between mb-6">
      <Button variant="ghost" @click="handleBack" class="!p-2">
        <ArrowIcon class="w-5 h-5 rotate-180" />
      </Button>
      <h1 class="text-lg font-semibold text-telegram-text">Редактировать профиль</h1>
      <div class="w-9"></div>
    </div>

    <ProfileFormCard
      :form="form"
      :user="user"
      :is-loading="isLoading"
      @submit="handleSave"
    />

    <div class="space-y-3">
      <Button @click="handleSave" :loading="isSaving" class="w-full" :disabled="isLoading">
        Сохранить изменения
      </Button>
      <Button variant="ghost" @click="handleBack" class="w-full" :disabled="isLoading || isSaving">
        Отменить
      </Button>
    </div>
  </div>
</template>
