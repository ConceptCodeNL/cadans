<template>
  <div class="min-h-screen bg-bg">
    <!-- Header -->
    <header class="border-b border-border bg-surface">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <span class="font-heading text-3xl tracking-wide">CADANS</span>
        <span
          v-if="verified"
          class="text-xs font-medium px-2 py-1 rounded-full"
          :class="role === 'student'
            ? 'bg-primary-light text-primary-dark'
            : 'bg-info-light text-info-text'"
        >
          {{ role === 'student' ? $t('sessions.studentRow') : $t('sessions.reviewerRow') }}
        </span>
      </div>
    </header>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading -->
      <div v-if="pageLoading" class="text-center py-12">
        <p class="text-text-secondary">{{ $t('common.loading') }}</p>
      </div>

      <!-- Invalid link -->
      <div
        v-else-if="invalidLink"
        class="text-center py-12 bg-surface rounded-xl border border-border max-w-md mx-auto"
      >
        <svg
          class="w-16 h-16 mx-auto text-text-tertiary mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        <p class="text-text-secondary text-lg">
          {{ $t('publicAccess.invalidLink') }}
        </p>
      </div>

      <!-- Code entry screen -->
      <div v-else-if="!verified" class="max-w-sm mx-auto">
        <div class="bg-surface rounded-2xl p-8 border border-border">
          <div class="text-center mb-8">
            <span class="font-heading text-3xl tracking-wide">CADANS</span>
            <h1 class="font-heading text-2xl mt-4 mb-2">
              {{ $t('publicAccess.title') }}
            </h1>
            <p class="text-text-secondary text-sm">
              {{ role === 'student' ? $t('sessions.studentRow') : $t('sessions.reviewerRow') }}
              — {{ meetingData?.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${meetingData?.meeting_number}` }}
            </p>
          </div>

          <!-- Locked state -->
          <div v-if="locked" class="text-center">
            <div class="bg-error/10 border border-error rounded-xl p-6 mb-4">
              <svg
                class="w-12 h-12 mx-auto text-error mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h2 class="font-heading text-xl text-error mb-2">
                {{ $t('publicAccess.locked') }}
              </h2>
              <p class="text-sm text-error/80">
                {{ $t('publicAccess.lockedMessage') }}
              </p>
            </div>
          </div>

          <!-- Code entry form -->
          <div v-else>
            <label class="block text-sm font-medium mb-2">
              {{ $t('publicAccess.enterCode') }}
            </label>
            <input
              v-model="codeInput"
              type="text"
              maxlength="8"
              :placeholder="$t('publicAccess.codePlaceholder')"
              class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase text-center font-mono text-lg tracking-widest mb-4"
              @input="codeInput = codeInput.toUpperCase().replace(/[^A-Z0-9]/g, '')"
              @keydown.enter="handleVerify"
            >

            <div
              v-if="codeError"
              class="text-error text-sm mb-4 text-center"
            >
              {{ codeError }}
            </div>

            <button
              type="button"
              :disabled="!codeInput.trim() || verifying"
              class="w-full px-4 py-3 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
              @click="handleVerify"
            >
              {{ verifying ? $t('common.loading') : $t('publicAccess.verify') }}
            </button>
          </div>
        </div>
      </div>

      <!-- ===== GRADING FORM (after verification) ===== -->
      <div
        v-else
        class="max-w-3xl mx-auto"
      >
        <!-- Thank you page after submission -->
        <div v-if="submitCompleted" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
            <svg class="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="font-heading text-4xl mb-4">{{ $t('publicAccess.thankYouTitle') }}</h1>
          <p class="text-text-secondary text-lg mb-2">{{ $t('publicAccess.thankYouMessage') }}</p>
          <p class="text-text-tertiary text-sm">{{ $t('publicAccess.thankYouClose') }}</p>
        </div>

        <!-- Grading form -->
        <div v-else>
        <div class="mb-8">
          <h1 class="font-heading text-4xl">
            {{ meetingData.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${meetingData.meeting_number}` }}
          </h1>
          <p class="text-text-secondary text-sm mt-1">
            {{ role === 'student' ? $t('sessions.studentRow') : $t('sessions.reviewerRow') }}
          </p>
        </div>

        <form
          class="space-y-8"
          @submit.prevent="handleSubmit"
        >
          <!-- Meeting Date & Overall Grade side by side -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Meeting Date -->
            <div>
              <label class="block text-sm font-medium mb-2">
                {{ $t('meetings.date') }}
              </label>
              <input
                v-model="formData.meetingDate"
                type="date"
                class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
            </div>

            <!-- Overall Grade (hidden for end grade) -->
            <div v-if="!(meetingData && meetingData.is_end_grade)" class="md:col-span-3">
              <label class="block text-sm font-medium mb-2">
                {{ $t('meetings.overallGrade') }} *
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  :class="[
                    'px-3 py-3 rounded-xl font-semibold text-sm transition-all',
                    formData.overallGrade === 'bad'
                      ? 'bg-error text-white scale-105'
                      : 'bg-surface border-2 border-border hover:border-error'
                  ]"
                  @click="formData.overallGrade = 'bad'"
                >
                  {{ $t('meetings.bad') }}
                </button>
                <button
                  type="button"
                  :class="[
                    'px-3 py-3 rounded-xl font-semibold text-sm transition-all',
                    formData.overallGrade === 'go_but_needs_attention'
                      ? 'bg-warning text-white scale-105'
                      : 'bg-surface border-2 border-border hover:border-warning'
                  ]"
                  @click="formData.overallGrade = 'go_but_needs_attention'"
                >
                  {{ $t('meetings.goButNeedsAttention') }}
                </button>
                <button
                  type="button"
                  :class="[
                    'px-3 py-3 rounded-xl font-semibold text-sm transition-all',
                    formData.overallGrade === 'all_good'
                      ? 'bg-success text-white scale-105'
                      : 'bg-surface border-2 border-border hover:border-success'
                  ]"
                  @click="formData.overallGrade = 'all_good'"
                >
                  {{ $t('meetings.allGood') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Competency Scores -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-heading text-2xl">
                {{ $t('meetings.competencyScores') }}
              </h2>
            </div>

            <!-- Advice banner -->
            <div class="flex gap-4 mb-6">
              <div
                :class="[
                  'rounded-xl p-4 border flex items-center gap-3 transition-all flex-1',
                  averageAdvice.bannerClass
                ]"
              >
                <div
                  :class="[
                    'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white',
                    averageAdvice.iconClass
                  ]"
                >
                  {{ averageAdvice.numericAvg ?? '–' }}
                </div>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wide opacity-75">
                    {{ $t('meetings.scoreAdvice') }}
                  </p>
                  <p class="font-heading text-lg">
                    {{ averageAdvice.label }}
                  </p>
                </div>
              </div>
              <!-- Average numeric grade (end grade only) -->
              <div
                v-if="meetingData && meetingData.is_end_grade"
                class="rounded-xl p-4 border border-border bg-surface-elevated flex items-center gap-3 transition-all"
              >
                <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                  :class="averageGrade != null ? 'bg-primary' : 'bg-border'"
                >
                  {{ averageGrade ?? '–' }}
                </div>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wide opacity-75">{{ $t('meetings.averageGrade') }}</p>
                  <p class="font-heading text-lg">{{ averageGrade != null ? averageGrade : '–' }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div
                v-for="comp in visibleCompetencies"
                :key="comp.id"
                :class="[
                  'bg-surface rounded-xl p-6',
                  comp.endGradeOnly ? 'border-2 border-primary' : 'border border-border'
                ]"
              >
                <div class="flex gap-6">
                  <!-- Left: competency content -->
                  <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-2">
                  <h3 class="font-heading text-xl">
                    {{ localized(comp.name) }}
                  </h3>
                  <span class="text-sm text-text-secondary">Weight: {{ comp.weight }}x</span>
                </div>

                <!-- Competency description accordion -->
                <div
                  v-if="localized(comp.description)"
                  class="mb-4"
                >
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                    @click="toggleCompetencyInfo(comp.id)"
                  >
                    <svg
                      class="w-4 h-4 transition-transform duration-200"
                      :class="{ 'rotate-90': expandedCompetencies[comp.id] }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {{ $t('meetings.competencyInfo') }}
                  </button>
                  <Transition name="accordion">
                    <div
                      v-if="expandedCompetencies[comp.id]"
                      class="mt-2 p-4 bg-surface-elevated rounded-lg border border-border text-sm text-text-secondary whitespace-pre-line leading-relaxed"
                    >
                      {{ localized(comp.description) }}
                    </div>
                  </Transition>
                </div>

                <!-- Score buttons -->
                <div class="mb-4">
                  <div class="grid grid-cols-5 gap-2">
                    <button
                      v-for="level in scoreLevels"
                      :key="level.value"
                      type="button"
                      :class="[
                        'px-2 py-2.5 rounded-xl font-semibold text-xs transition-all text-center',
                        formData.competencyScores[comp.id] === level.value
                          ? level.activeClass
                          : 'bg-surface border-2 border-border ' + level.hoverClass
                      ]"
                      @click="formData.competencyScores[comp.id] = level.value"
                    >
                      {{ $t(level.label) }}
                    </button>
                  </div>
                </div>

                <!-- Tips & Tops per competency -->
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium">{{ $t('meetings.tipsAndTops') }}</span>
                    <div class="flex gap-2">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warning-light text-warning-text border border-warning-border rounded-lg text-xs font-semibold hover:bg-warning hover:text-white transition-all"
                        @click="openTipTopModal('tip', comp.id)"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        {{ $t('meetings.addTip') }}
                      </button>
                      <button
                        type="button"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success-light text-success-text border border-success-border rounded-lg text-xs font-semibold hover:bg-success hover:text-white transition-all"
                        @click="openTipTopModal('top', comp.id)"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                        {{ $t('meetings.addTop') }}
                      </button>
                    </div>
                  </div>

                  <!-- Tips & Tops list -->
                  <div
                    v-if="getCompetencyTipsTops(comp.id).length === 0"
                    class="text-center py-4 rounded-lg border border-dashed border-border"
                  >
                    <p class="text-text-tertiary text-xs">
                      {{ $t('meetings.noTipsTops') }}
                    </p>
                  </div>

                  <div
                    v-else
                    class="space-y-2"
                  >
                    <div
                      v-for="(item, index) in getCompetencyTipsTops(comp.id)"
                      :key="item.id"
                      :class="[
                        'flex items-start gap-3 p-3 rounded-lg border transition-all',
                        item.type === 'tip'
                          ? 'bg-warning-light border-warning-border'
                          : 'bg-success-light border-success-border'
                      ]"
                    >
                      <div
                        :class="[
                          'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center',
                          item.type === 'tip' ? 'bg-warning text-white' : 'bg-success text-white'
                        ]"
                      >
                        <svg
                          v-if="item.type === 'tip'"
                          class="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <svg
                          v-else
                          class="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                      </div>

                      <div class="flex-1 min-w-0">
                        <span
                          :class="[
                            'inline-block text-xs font-bold uppercase tracking-wide mb-0.5',
                            item.type === 'tip' ? 'text-warning-text' : 'text-success-text'
                          ]"
                        >
                          {{ item.type === 'tip' ? $t('meetings.tip') : $t('meetings.top') }}
                        </span>
                        <p class="text-sm text-text-primary">
                          {{ item.text }}
                        </p>
                      </div>

                      <div class="flex-shrink-0 flex gap-1">
                        <button
                          type="button"
                          class="p-1.5 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-surface transition-colors"
                          :aria-label="$t('common.edit')"
                          @click="editTipTop(comp.id, index)"
                        >
                          <svg
                            class="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          class="p-1.5 text-text-tertiary hover:text-error rounded-lg hover:bg-surface transition-colors"
                          :aria-label="$t('common.delete')"
                          @click="deleteTipTop(comp.id, index)"
                        >
                          <svg
                            class="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                  </div>
                  <!-- Right: numeric grade input (end grade only) -->
                  <div
                    v-if="meetingData && meetingData.is_end_grade"
                    class="flex-shrink-0 flex flex-col items-center justify-center"
                  >
                    <label class="text-xs text-text-tertiary font-medium mb-2 uppercase tracking-wide">{{ $t('meetings.competencyGrade') }}</label>
                    <input
                      v-model.number="formData.competencyGrades[comp.id]"
                      type="number"
                      min="1"
                      max="10"
                      step="0.5"
                      class="w-24 h-24 text-center text-3xl font-bold border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-surface-elevated"
                      placeholder="–"
                      @focus="$event.target.select()"
                      @blur="validateGrade(comp.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- General Notes -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ $t('meetings.generalNotes') }}
            </label>
            <textarea
              v-model="formData.generalNotes"
              rows="4"
              class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div
            v-if="saveError"
            class="text-error text-sm"
          >
            {{ saveError }}
          </div>

          <div
            v-if="saveSuccess"
            class="text-success text-sm font-medium"
          >
            {{ $t('common.success') }}!
          </div>

          <div class="flex gap-4">
            <button
              type="button"
              :disabled="saving"
              class="flex-1 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-hover transition-colors disabled:opacity-50"
              @click="handleSaveDraft"
            >
              {{ saving ? $t('common.loading') : $t('meetings.saveDraft') }}
            </button>
            <button
              type="submit"
              :disabled="!canSubmit || submitting"
              class="flex-1 px-6 py-3 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {{ submitting ? $t('common.loading') : $t('meetings.submit') }}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>

    <!-- Tip/Top Modal -->
    <Transition name="modal">
      <div
        v-if="showTipTopModal"
        class="fixed inset-0 flex items-center justify-center z-50 p-4"
        style="background-color: rgba(0,0,0,0.5);"
        @click.self="closeTipTopModal"
      >
        <Transition name="modal-content">
          <div
            v-if="showTipTopModal"
            :class="[
              'rounded-2xl p-8 max-w-lg w-full shadow-xl bg-surface-elevated border-2',
              tipTopModalType === 'tip' ? 'border-warning-border' : 'border-success-border'
            ]"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  tipTopModalType === 'tip' ? 'bg-warning text-white' : 'bg-success text-white'
                ]"
              >
                <svg
                  v-if="tipTopModalType === 'tip'"
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <h2 class="font-heading text-3xl">
                {{ editingTipTopIndex !== null
                  ? $t('meetings.editTipTop', { type: tipTopModalType === 'tip' ? $t('meetings.tip') : $t('meetings.top') })
                  : (tipTopModalType === 'tip' ? $t('meetings.addTip') : $t('meetings.addTop'))
                }}
              </h2>
            </div>

            <textarea
              ref="tipTopInput"
              v-model="tipTopText"
              rows="4"
              :placeholder="tipTopModalType === 'tip' ? $t('meetings.tipPlaceholder') : $t('meetings.topPlaceholder')"
              class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-6"
              @keydown.meta.enter="saveTipTop"
              @keydown.ctrl.enter="saveTipTop"
            />

            <div class="flex gap-4">
              <button
                type="button"
                class="flex-1 px-4 py-3 border border-border rounded-lg font-semibold hover:bg-hover transition-colors"
                @click="closeTipTopModal"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                type="button"
                :disabled="!tipTopText.trim()"
                :class="[
                  'flex-1 px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 text-white',
                  tipTopModalType === 'tip'
                    ? 'bg-warning hover:bg-warning-dark'
                    : 'bg-success hover:bg-success-dark'
                ]"
                @click="saveTipTop"
              >
                {{ $t('common.save') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'

const { t: $t, locale } = useI18n()
const route = useRoute()

// Helper for multilingual competency fields (backward compatible with old string format)
function localized(value) {
  if (typeof value === 'object' && value !== null) {
    return value[locale.value] || value['nl'] || value['en'] || ''
  }
  return value || ''
}

// Page state
const pageLoading = ref(true)
const invalidLink = ref(false)
const verified = ref(false)
const locked = ref(false)
const verifying = ref(false)
const codeInput = ref('')
const codeError = ref('')

// Data
const role = ref('') // 'student' or 'reviewer'
const meetingData = ref(null)
const sessionData = ref(null)

// Grading form state
const saving = ref(false)
const submitting = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)
const submitCompleted = ref(false)

// Score levels
const scoreLevels = [
  {
    value: 1,
    label: 'meetings.scoreBad',
    activeClass: 'bg-error text-white scale-105',
    hoverClass: 'hover:border-error',
  },
  {
    value: 2,
    label: 'meetings.scoreNeedsAttention',
    activeClass: 'bg-warning text-white scale-105',
    hoverClass: 'hover:border-warning',
  },
  {
    value: 3,
    label: 'meetings.scoreNeutral',
    activeClass: 'bg-info text-white scale-105',
    hoverClass: 'hover:border-info',
  },
  {
    value: 4,
    label: 'meetings.scoreGood',
    activeClass: 'bg-primary text-primary-text scale-105',
    hoverClass: 'hover:border-primary',
  },
  {
    value: 5,
    label: 'meetings.scorePerfect',
    activeClass: 'bg-success text-white scale-105',
    hoverClass: 'hover:border-success',
  },
]

// Accordion state
const expandedCompetencies = reactive({})

function toggleCompetencyInfo(compId) {
  expandedCompetencies[compId] = !expandedCompetencies[compId]
}

// Tip/Top modal state
const showTipTopModal = ref(false)
const tipTopModalType = ref('tip')
const tipTopText = ref('')
const editingTipTopIndex = ref(null)
const editingCompetencyId = ref(null)
const tipTopInput = ref(null)

// Form data
const formData = ref({
  meetingDate: '',
  overallGrade: '',
  competencyScores: {},
  competencyGrades: {},
  competencyTipsTops: {},
  generalNotes: '',
})

// ---- Lifecycle ----
onMounted(async () => {
  const token = route.params.token
  const path = route.path

  if (path.startsWith('/m/s/')) {
    role.value = 'student'
  } else if (path.startsWith('/m/r/')) {
    role.value = 'reviewer'
  } else {
    invalidLink.value = true
    pageLoading.value = false
    return
  }

  // Fetch meeting by token
  const tokenField = role.value === 'student' ? 'student_token' : 'reviewer_token'
  const { data: meeting, error: fetchError } = await supabase
    .from('meetings')
    .select('*')
    .eq(tokenField, token)
    .single()

  if (fetchError || !meeting) {
    invalidLink.value = true
    pageLoading.value = false
    return
  }

  meetingData.value = meeting

  // Fetch session
  const { data: session } = await supabase
    .from('grading_sessions')
    .select('*')
    .eq('id', meeting.grading_session_id)
    .single()

  if (session) {
    sessionData.value = session

    const lockedField = role.value === 'student' ? 'student_code_locked' : 'reviewer_code_locked'
    const codeField = role.value === 'student' ? 'student_access_code' : 'reviewer_access_code'

    if (session[lockedField]) {
      locked.value = true
    }

    if (!session[codeField] && !session[lockedField]) {
      invalidLink.value = true
    }
  } else {
    invalidLink.value = true
  }

  pageLoading.value = false
})

// ---- Code verification ----
async function handleVerify() {
  if (!codeInput.value.trim() || verifying.value) return

  verifying.value = true
  codeError.value = ''

  const codeField = role.value === 'student' ? 'student_access_code' : 'reviewer_access_code'
  const attemptsField = role.value === 'student' ? 'student_code_attempts' : 'reviewer_code_attempts'
  const lockedField = role.value === 'student' ? 'student_code_locked' : 'reviewer_code_locked'

  const { data: session } = await supabase
    .from('grading_sessions')
    .select('id, ' + codeField + ', ' + attemptsField + ', ' + lockedField)
    .eq('id', meetingData.value.grading_session_id)
    .single()

  if (!session) {
    codeError.value = 'Session not found'
    verifying.value = false
    return
  }

  if (session[lockedField]) {
    locked.value = true
    verifying.value = false
    return
  }

  if (session[codeField] === codeInput.value.toUpperCase()) {
    // Correct code – reset attempts
    await supabase
      .from('grading_sessions')
      .update({ [attemptsField]: 0 })
      .eq('id', session.id)

    // Initialize grading form with existing data
    initFormData()
    verified.value = true
  } else {
    // Wrong code
    const newAttempts = (session[attemptsField] || 0) + 1
    const updates = { [attemptsField]: newAttempts }

    if (newAttempts >= 10) {
      updates[lockedField] = true
      updates[codeField] = null
    }

    await supabase
      .from('grading_sessions')
      .update(updates)
      .eq('id', session.id)

    if (newAttempts >= 10) {
      locked.value = true
    } else {
      codeError.value = $t('publicAccess.wrongCode', { attemptsLeft: 10 - newAttempts })
    }
  }

  verifying.value = false
}

// ---- Form initialization ----
function initFormData() {
  const m = meetingData.value
  const competencyTipsTops = m.competency_notes || {}

  formData.value = {
    meetingDate: m.meeting_date || '',
    overallGrade: m.overall_grade || '',
    competencyScores: m.competency_scores || {},
    competencyGrades: m.competency_grades || {},
    competencyTipsTops,
    generalNotes: m.general_notes || '',
  }

  // Initialize missing competency arrays
  if (sessionData.value) {
    sessionData.value.competencies.forEach(comp => {
      if (!formData.value.competencyScores[comp.id]) {
        formData.value.competencyScores[comp.id] = null
      }
      if (formData.value.competencyGrades[comp.id] == null) {
        formData.value.competencyGrades[comp.id] = null
      }
      if (!formData.value.competencyTipsTops[comp.id] || !Array.isArray(formData.value.competencyTipsTops[comp.id])) {
        formData.value.competencyTipsTops[comp.id] = []
      }
    })
  }
}

// ---- Computed ----
// Filter competencies: hide endGradeOnly competencies for regular meetings
const visibleCompetencies = computed(() => {
  if (!sessionData.value) return []
  const isEndGrade = meetingData.value?.is_end_grade
  return sessionData.value.competencies.filter(comp => isEndGrade || !comp.endGradeOnly)
})

const canSubmit = computed(() => {
  if (!sessionData.value) return false
  const isEndGrade = meetingData.value?.is_end_grade
  if (!isEndGrade && !formData.value.overallGrade) return false
  return visibleCompetencies.value.every(
    comp => formData.value.competencyScores[comp.id] != null
  )
})

const averageAdvice = computed(() => {
  if (!sessionData.value) {
    return { label: $t('meetings.noScoresYet'), numericAvg: null, bannerClass: 'bg-surface-elevated border-border', iconClass: 'bg-border' }
  }

  const comps = visibleCompetencies.value
  let totalWeighted = 0
  let totalWeight = 0
  let hasAny = false

  comps.forEach(comp => {
    const score = formData.value.competencyScores[comp.id]
    if (score != null) {
      hasAny = true
      const w = comp.weight || 1
      totalWeighted += score * w
      totalWeight += w
    }
  })

  if (!hasAny || totalWeight === 0) {
    return { label: $t('meetings.noScoresYet'), numericAvg: null, bannerClass: 'bg-surface-elevated border-border', iconClass: 'bg-border' }
  }

  const avg = totalWeighted / totalWeight
  const rounded = Math.round(avg * 10) / 10

  if (avg <= 1.5) {
    return { label: $t('meetings.scoreBad'), numericAvg: rounded, bannerClass: 'bg-error/10 border-error text-error', iconClass: 'bg-error' }
  } else if (avg <= 2.5) {
    return { label: $t('meetings.scoreNeedsAttention'), numericAvg: rounded, bannerClass: 'bg-warning/10 border-warning text-warning-text', iconClass: 'bg-warning' }
  } else if (avg <= 3.5) {
    return { label: $t('meetings.scoreNeutral'), numericAvg: rounded, bannerClass: 'bg-info/10 border-info text-info-text', iconClass: 'bg-info' }
  } else if (avg < 4.5) {
    return { label: $t('meetings.scoreGood'), numericAvg: rounded, bannerClass: 'bg-primary/10 border-primary text-primary-dark', iconClass: 'bg-primary' }
  } else {
    return { label: $t('meetings.scorePerfect'), numericAvg: rounded, bannerClass: 'bg-success/10 border-success text-success-text', iconClass: 'bg-success' }
  }
})

// Compute average of numeric competency grades (1-10) for end grade meetings
const averageGrade = computed(() => {
  if (!sessionData.value || !meetingData.value?.is_end_grade) return null

  const comps = visibleCompetencies.value
  let total = 0
  let count = 0

  comps.forEach(comp => {
    const grade = formData.value.competencyGrades[comp.id]
    if (grade != null && grade !== '' && !isNaN(grade)) {
      total += Number(grade)
      count++
    }
  })

  if (count === 0) return null
  return Math.round((total / count) * 2) / 2
})

// ---- Tip/Top helpers ----
function getCompetencyTipsTops(compId) {
  return formData.value.competencyTipsTops[compId] || []
}

function openTipTopModal(type, compId) {
  tipTopModalType.value = type
  tipTopText.value = ''
  editingTipTopIndex.value = null
  editingCompetencyId.value = compId
  showTipTopModal.value = true
  nextTick(() => {
    tipTopInput.value?.focus()
  })
}

function editTipTop(compId, index) {
  const items = formData.value.competencyTipsTops[compId]
  const item = items[index]
  tipTopModalType.value = item.type
  tipTopText.value = item.text
  editingTipTopIndex.value = index
  editingCompetencyId.value = compId
  showTipTopModal.value = true
  nextTick(() => {
    tipTopInput.value?.focus()
  })
}

function deleteTipTop(compId, index) {
  formData.value.competencyTipsTops[compId].splice(index, 1)
}

function saveTipTop() {
  if (!tipTopText.value.trim()) return
  const compId = editingCompetencyId.value

  if (!formData.value.competencyTipsTops[compId]) {
    formData.value.competencyTipsTops[compId] = []
  }

  if (editingTipTopIndex.value !== null) {
    formData.value.competencyTipsTops[compId][editingTipTopIndex.value].text = tipTopText.value.trim()
  } else {
    formData.value.competencyTipsTops[compId].push({
      id: Date.now().toString(),
      type: tipTopModalType.value,
      text: tipTopText.value.trim(),
    })
  }

  closeTipTopModal()
}

function closeTipTopModal() {
  showTipTopModal.value = false
  tipTopText.value = ''
  editingTipTopIndex.value = null
  editingCompetencyId.value = null
}

// ---- Grade validation ----
function validateGrade(compId) {
  const val = formData.value.competencyGrades[compId]
  if (val == null || val === '') {
    formData.value.competencyGrades[compId] = null
    return
  }
  const num = Number(val)
  if (isNaN(num) || num < 1 || num > 10 || (num * 2) % 1 !== 0) {
    // Round to nearest 0.5 if possible, otherwise clear
    const rounded = Math.round(num * 2) / 2
    if (rounded >= 1 && rounded <= 10) {
      formData.value.competencyGrades[compId] = rounded
    } else {
      formData.value.competencyGrades[compId] = null
    }
  }
}

function sanitizeGrades() {
  const sanitized = {}
  for (const [key, val] of Object.entries(formData.value.competencyGrades)) {
    if (val == null || val === '') {
      sanitized[key] = null
      continue
    }
    const num = Number(val)
    const rounded = Math.round(num * 2) / 2
    sanitized[key] = (!isNaN(rounded) && rounded >= 1 && rounded <= 10) ? rounded : null
  }
  return sanitized
}

// ---- Save / Submit ----
function buildMeetingData(status) {
  const data = {
    meeting_date: formData.value.meetingDate || null,
    overall_grade: formData.value.overallGrade || null,
    competency_scores: formData.value.competencyScores,
    competency_grades: sanitizeGrades(),
    competency_notes: formData.value.competencyTipsTops,
    general_notes: formData.value.generalNotes || null,
    status,
  }
  // Also store reviewer grades in a separate field for teacher reference
  if (role.value === 'reviewer') {
    data.reviewer_competency_grades = sanitizeGrades()
  }
  return data
}

async function handleSaveDraft() {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = false

  const data = buildMeetingData('draft')

  const { error } = await supabase
    .from('meetings')
    .update(data)
    .eq('id', meetingData.value.id)

  if (error) {
    saveError.value = error.message
  } else {
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 3000)
  }

  saving.value = false
}

async function handleSubmit() {
  if (!canSubmit.value) return

  submitting.value = true
  saveError.value = ''
  saveSuccess.value = false

  const data = buildMeetingData('submitted')
  data.submitted_at = new Date().toISOString()

  const { error } = await supabase
    .from('meetings')
    .update(data)
    .eq('id', meetingData.value.id)

  if (error) {
    saveError.value = error.message
  } else {
    submitCompleted.value = true
  }

  submitting.value = false
}
</script>

<style scoped>
/* Accordion animations */
.accordion-enter-active {
  transition: all 0.25s ease-out;
}
.accordion-leave-active {
  transition: all 0.2s ease-in;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}
.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* Modal animations */
.modal-enter-active {
  transition: opacity 0.2s ease;
}
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-content-leave-active {
  transition: all 0.2s ease;
}
.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
