<template>
  <AppLayout>
    <div v-if="loading" class="text-center py-12">
      <p class="text-text-secondary">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="!session" class="text-center py-12">
      <p class="text-text-secondary">Session not found</p>
      <RouterLink to="/sessions" class="text-primary-text hover:underline mt-4 inline-block">
        ← {{ $t('common.back') }}
      </RouterLink>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="mb-8">
        <RouterLink
          to="/sessions"
          class="text-text-secondary hover:text-text-primary mb-4 inline-block"
        >
          ← {{ $t('common.back') }}
        </RouterLink>

        <div class="flex items-center gap-4 mt-4">
          <h1 class="font-heading text-4xl">{{ session.code }}</h1>
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
            :class="getTypeClass(session.type)"
          >
            {{ $t(`sessions.types.${session.type}`) }}
          </span>
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
            :class="getStatusClass(session.status)"
          >
            {{ $t(`sessions.${session.status}`) }}
          </span>
          <div class="ml-auto flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
              @click="handleExportPdf"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11V3m0 8l-3-3m3 3l3-3M6 21h12a2 2 0 002-2v-5H4v5a2 2 0 002 2z" />
              </svg>
              {{ $t('sessions.exportPdf') }}
            </button>
            <RouterLink
              :to="`/session/${session.id}/edit`"
              class="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ $t('common.edit') }}
            </RouterLink>
          </div>
        </div>

        <!-- Session details -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 bg-surface rounded-xl p-6 border border-border">
          <div class="space-y-3">
            <div>
              <p class="text-xs text-text-tertiary uppercase tracking-wide">{{ $t('sessions.ownReference') }}</p>
              <p class="font-medium">{{ session.own_reference || $t('common.notSet') }}</p>
            </div>
            <div>
              <p class="text-xs text-text-tertiary uppercase tracking-wide">{{ $t('sessions.company') }}</p>
              <p class="font-medium">{{ session.company || $t('common.notSet') }}</p>
            </div>
            <div>
              <p class="text-xs text-text-tertiary uppercase tracking-wide">{{ $t('sessions.meetings') }}</p>
              <p class="font-medium">{{ session.number_of_meetings }}</p>
            </div>
          </div>
          <div class="space-y-3">
            <div>
              <p class="text-xs text-text-tertiary uppercase tracking-wide">{{ $t('sessions.startDate') }}</p>
              <p class="font-medium">{{ session.start_date ? formatDate(session.start_date) : $t('common.notSet') }}</p>
            </div>
            <div>
              <p class="text-xs text-text-tertiary uppercase tracking-wide">{{ $t('sessions.endDate') }}</p>
              <p class="font-medium">{{ session.end_date ? formatDate(session.end_date) : $t('common.notSet') }}</p>
            </div>
          </div>
          <!-- Access Codes -->
          <div class="space-y-3">
            <!-- Student code -->
            <div>
              <p class="text-xs text-text-tertiary uppercase tracking-wide mb-1">{{ $t('sessions.studentAccessCode') }}</p>
              <div v-if="session.student_code_locked" class="flex items-center gap-2">
                <span class="text-xs font-semibold text-error">{{ $t('sessions.codeLocked') }}</span>
                <button
                  type="button"
                  class="px-3 py-1.5 bg-primary text-primary-text rounded-lg font-semibold text-xs hover:bg-primary-hover transition-colors"
                  @click="requestRegenerateCode('student')"
                >
                  {{ $t('sessions.regenerateAccessCode') }}
                </button>
              </div>
              <div v-else-if="session.student_access_code" class="flex items-center gap-2 flex-wrap">
                <span class="font-mono text-sm font-bold tracking-widest">{{ session.student_access_code }}</span>
                <button
                  type="button"
                  class="p-1 text-text-tertiary hover:text-text-primary rounded hover:bg-hover transition-colors"
                  title="Copy code"
                  @click="copyToClipboard(session.student_access_code)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="p-1 text-text-tertiary hover:text-primary rounded hover:bg-hover transition-colors"
                  :title="$t('sessions.emailTemplate')"
                  @click="openEmailModal('student')"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="px-3 py-1 bg-surface-elevated border border-border rounded-lg text-xs font-semibold hover:border-primary hover:text-primary transition-colors"
                  @click="requestRegenerateCode('student')"
                >
                  {{ $t('sessions.regenerateAccessCode') }}
                </button>
              </div>
              <button
                v-else
                type="button"
                class="px-3 py-1.5 bg-primary text-primary-text rounded-lg font-semibold text-xs hover:bg-primary-hover transition-colors"
                @click="handleGenerateStudentCode"
              >
                {{ $t('sessions.generateAccessCode') }}
              </button>
            </div>
            <!-- Reviewer code -->
            <div>
              <p class="text-xs text-text-tertiary uppercase tracking-wide mb-1">{{ $t('sessions.reviewerAccessCode') }}</p>
              <div v-if="session.reviewer_code_locked" class="flex items-center gap-2">
                <span class="text-xs font-semibold text-error">{{ $t('sessions.codeLocked') }}</span>
                <button
                  type="button"
                  class="px-3 py-1.5 bg-primary text-primary-text rounded-lg font-semibold text-xs hover:bg-primary-hover transition-colors"
                  @click="requestRegenerateCode('reviewer')"
                >
                  {{ $t('sessions.regenerateAccessCode') }}
                </button>
              </div>
              <div v-else-if="session.reviewer_access_code" class="flex items-center gap-2 flex-wrap">
                <span class="font-mono text-sm font-bold tracking-widest">{{ session.reviewer_access_code }}</span>
                <button
                  type="button"
                  class="p-1 text-text-tertiary hover:text-text-primary rounded hover:bg-hover transition-colors"
                  title="Copy code"
                  @click="copyToClipboard(session.reviewer_access_code)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="p-1 text-text-tertiary hover:text-primary rounded hover:bg-hover transition-colors"
                  :title="$t('sessions.emailTemplate')"
                  @click="openEmailModal('reviewer')"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="px-3 py-1 bg-surface-elevated border border-border rounded-lg text-xs font-semibold hover:border-primary hover:text-primary transition-colors"
                  @click="requestRegenerateCode('reviewer')"
                >
                  {{ $t('sessions.regenerateAccessCode') }}
                </button>
              </div>
              <button
                v-else
                type="button"
                class="px-3 py-1.5 bg-primary text-primary-text rounded-lg font-semibold text-xs hover:bg-primary-hover transition-colors"
                @click="handleGenerateReviewerCode"
              >
                {{ $t('sessions.generateAccessCode') }}
              </button>
            </div>
            <!-- Viewer code -->
            <div>
              <p class="text-xs text-text-tertiary uppercase tracking-wide mb-1">{{ $t('sessions.viewerAccessCode') }}</p>
              <div v-if="session.viewer_code_locked" class="flex items-center gap-2">
                <span class="text-xs font-semibold text-error">{{ $t('sessions.codeLocked') }}</span>
                <button
                  type="button"
                  class="px-3 py-1.5 bg-primary text-primary-text rounded-lg font-semibold text-xs hover:bg-primary-hover transition-colors"
                  @click="requestRegenerateCode('viewer')"
                >
                  {{ $t('sessions.regenerateAccessCode') }}
                </button>
              </div>
              <div v-else-if="session.viewer_access_code" class="flex items-center gap-2 flex-wrap">
                <span class="font-mono text-sm font-bold tracking-widest">{{ session.viewer_access_code }}</span>
                <button
                  type="button"
                  class="p-1 text-text-tertiary hover:text-text-primary rounded hover:bg-hover transition-colors"
                  title="Copy code"
                  @click="copyToClipboard(session.viewer_access_code)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="p-1 text-text-tertiary hover:text-primary rounded hover:bg-hover transition-colors"
                  :title="$t('sessions.emailTemplate')"
                  @click="openEmailModal('viewer')"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="px-3 py-1 bg-surface-elevated border border-border rounded-lg text-xs font-semibold hover:border-primary hover:text-primary transition-colors"
                  @click="requestRegenerateCode('viewer')"
                >
                  {{ $t('sessions.regenerateAccessCode') }}
                </button>
              </div>
              <button
                v-else
                type="button"
                class="px-3 py-1.5 bg-primary text-primary-text rounded-lg font-semibold text-xs hover:bg-primary-hover transition-colors"
                @click="handleGenerateViewerCode"
              >
                {{ $t('sessions.generateAccessCode') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Teacher Meetings Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-heading text-2xl">{{ $t('sessions.teacherRow') }} — {{ $t('meetings.title') }}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="meeting in meetings"
            :key="meeting.id"
            class="bg-surface rounded-xl border border-border flex flex-col"
          >
            <RouterLink
              :to="`/session/${session.id}/meeting/${meeting.id}`"
              class="flex-1 p-5 hover:border-primary transition-colors rounded-t-xl"
            >
              <!-- Title + status badge -->
              <div class="flex items-start justify-between gap-2 mb-3">
                <h3 class="font-heading text-xl">
                  {{ meeting.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${meeting.meeting_number}` }}
                </h3>
                <span
                  class="flex-shrink-0 inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                  :class="meeting.status === 'submitted' ? 'bg-success-light text-success-text' : 'bg-warning-light text-warning-text'"
                >
                  {{ $t(`meetings.${meeting.status}`) }}
                </span>
              </div>

              <!-- 4 rows -->
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs text-text-tertiary">{{ $t('meetings.date') }}</span>
                  <span class="text-xs text-text-primary">
                    {{ meeting.meeting_date ? formatDate(meeting.meeting_date) : '—' }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-text-tertiary mb-1">{{ $t('sessions.teacherRow') }}</p>
                  <span
                    class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                    :class="meeting.overall_grade ? getReviewerOverallGradeClass(meeting.overall_grade) : 'bg-surface-elevated text-text-tertiary'"
                  >
                    {{ meeting.overall_grade ? $t(`meetings.${meeting.overall_grade}`) : '—' }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-text-tertiary mb-1">{{ $t('sessions.reviewerRow') }}</p>
                  <span
                    class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                    :class="meeting.reviewer_overall_grade ? getReviewerOverallGradeClass(meeting.reviewer_overall_grade) : 'bg-surface-elevated text-text-tertiary'"
                  >
                    {{ meeting.reviewer_overall_grade ? $t(`meetings.${meeting.reviewer_overall_grade}`) : '—' }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-text-tertiary mb-1">{{ $t('sessions.studentRow') }}</p>
                  <span
                    class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                    :class="meeting.student_overall_grade ? getReviewerOverallGradeClass(meeting.student_overall_grade) : 'bg-surface-elevated text-text-tertiary'"
                  >
                    {{ meeting.student_overall_grade ? $t(`meetings.${meeting.student_overall_grade}`) : '—' }}
                  </span>
                </div>
              </div>
            </RouterLink>
            <div class="px-4 pb-4 flex flex-col gap-2">
              <RouterLink
                :to="`/session/${session.id}/meeting/${meeting.id}`"
                class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-elevated text-text-primary border border-border rounded-lg text-xs font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ $t('meetings.viewTeacher') }}
              </RouterLink>
              <RouterLink
                :to="`/session/${session.id}/meeting/${meeting.id}/reviewer`"
                class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-info-light text-info-text border border-info-border rounded-lg text-xs font-semibold hover:bg-info hover:text-white hover:border-info transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ $t('meetings.viewReviewer') }}
              </RouterLink>
              <RouterLink
                :to="`/session/${session.id}/meeting/${meeting.id}/student`"
                class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-light text-primary-dark border border-primary rounded-lg text-xs font-semibold hover:bg-primary hover:text-primary-text hover:border-primary transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ $t('meetings.viewStudent') }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Share Links Section -->
      <div class="mb-8">
        <h2 class="font-heading text-2xl mb-4">{{ $t('sessions.shareLinks') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Student share links -->
          <div class="bg-surface rounded-xl p-6 border border-border">
            <h3 class="font-heading text-lg mb-3">{{ $t('sessions.studentRow') }}</h3>
            <div v-if="!session.student_access_code" class="text-sm text-text-tertiary">
              {{ $t('sessions.noCodeYet') }}
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="meeting in meetings"
                :key="'sl-' + meeting.id"
                class="flex items-center gap-2"
              >
                <span class="text-xs text-text-secondary flex-1 truncate">
                  {{ meeting.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${meeting.meeting_number}` }}
                </span>
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-surface-elevated border border-border rounded text-xs font-medium hover:border-primary transition-colors"
                    @click="copyMeetingLink(meeting.student_token, 'student')"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {{ $t('sessions.copyLink') }}
                  </button>
                  <button
                    type="button"
                    class="p-1 bg-surface-elevated border border-border rounded hover:border-primary text-text-tertiary hover:text-primary transition-colors"
                    :title="$t('sessions.openInNewTab')"
                    @click="openMeetingLink(meeting.student_token, 'student')"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Reviewer share links -->
          <div class="bg-surface rounded-xl p-6 border border-border">
            <h3 class="font-heading text-lg mb-3">{{ $t('sessions.reviewerRow') }}</h3>
            <div v-if="!session.reviewer_access_code" class="text-sm text-text-tertiary">
              {{ $t('sessions.noCodeYet') }}
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="meeting in meetings"
                :key="'rl-' + meeting.id"
                class="flex items-center gap-2"
              >
                <span class="text-xs text-text-secondary flex-1 truncate">
                  {{ meeting.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${meeting.meeting_number}` }}
                </span>
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-surface-elevated border border-border rounded text-xs font-medium hover:border-primary transition-colors"
                    @click="copyMeetingLink(meeting.reviewer_token, 'reviewer')"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {{ $t('sessions.copyLink') }}
                  </button>
                  <button
                    type="button"
                    class="p-1 bg-surface-elevated border border-border rounded hover:border-primary text-text-tertiary hover:text-primary transition-colors"
                    :title="$t('sessions.openInNewTab')"
                    @click="openMeetingLink(meeting.reviewer_token, 'reviewer')"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Viewer share links -->
          <div class="bg-surface rounded-xl p-6 border border-border">
            <h3 class="font-heading text-lg mb-3">{{ $t('sessions.viewerRow') }}</h3>
            <div v-if="!session.viewer_access_code" class="text-sm text-text-tertiary">
              {{ $t('sessions.noCodeYet') }}
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="meeting in meetings"
                :key="'vl-' + meeting.id"
                class="flex items-center gap-2"
              >
                <span class="text-xs text-text-secondary flex-1 truncate">
                  {{ meeting.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${meeting.meeting_number}` }}
                </span>
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-surface-elevated border border-border rounded text-xs font-medium hover:border-primary transition-colors"
                    @click="copyMeetingLink(meeting.viewer_token, 'viewer')"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {{ $t('sessions.copyLink') }}
                  </button>
                  <button
                    type="button"
                    class="p-1 bg-surface-elevated border border-border rounded hover:border-primary text-text-tertiary hover:text-primary transition-colors"
                    :title="$t('sessions.openInNewTab')"
                    @click="openMeetingLink(meeting.viewer_token, 'viewer')"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Email Template Modal -->
    <Teleport to="body">
      <div
        v-if="emailModal.show"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/50" @click="emailModal.show = false"></div>
        <div class="relative bg-surface rounded-xl border border-border shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
          <div class="flex items-center justify-between p-4 border-b border-border">
            <h3 class="font-heading text-lg">{{ $t('sessions.emailTemplate') }}</h3>
            <button
              type="button"
              class="p-1 text-text-tertiary hover:text-text-primary rounded hover:bg-hover transition-colors"
              @click="emailModal.show = false"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-4 overflow-y-auto flex-1">
            <pre class="whitespace-pre-wrap text-sm text-text-primary font-sans leading-relaxed bg-surface-elevated rounded-lg p-4 border border-border">{{ emailModal.body }}</pre>
          </div>
          <div class="flex justify-end gap-2 p-4 border-t border-border">
            <button
              type="button"
              class="px-4 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-hover transition-colors"
              @click="emailModal.show = false"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="button"
              class="px-4 py-2 bg-primary text-primary-text rounded-lg font-semibold text-sm hover:bg-primary-hover transition-colors"
              @click="copyEmailBody"
            >
              {{ $t('sessions.copyEmail') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </AppLayout>

  <!-- Regenerate Access Code Confirmation Dialog -->
  <ConfirmDialog
    v-model="showRegenerateConfirm"
    :title="$t('common.confirm')"
    :message="$t('sessions.regenerateConfirm')"
    :confirm-text="$t('sessions.regenerateAccessCode')"
    :cancel-text="$t('common.cancel')"
    variant="default"
    @confirm="confirmRegenerateCode"
  />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSessionsStore } from '@/stores/sessions'
import { useMeetingsStore } from '@/stores/meetings'
import AppLayout from '@/components/AppLayout.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { exportSessionToPdf } from '@/utils/exportPdf'

const { t: $t } = useI18n()
const route = useRoute()
const router = useRouter()
const sessionsStore = useSessionsStore()
const meetingsStore = useMeetingsStore()

const loading = ref(true)
const showRegenerateConfirm = ref(false)
const regenerateRole = ref(null) // 'student' | 'reviewer' | 'viewer' | null
const session = ref(null)
const meetings = ref([])

const emailModal = reactive({
  show: false,
  body: '',
})

onMounted(async () => {
  const sessionId = route.params.id
  
  const [sessionResult] = await Promise.all([
    sessionsStore.fetchSession(sessionId),
    meetingsStore.fetchMeetings(sessionId),
  ])
  
  session.value = sessionResult.data
  meetings.value = meetingsStore.meetings
  loading.value = false
})

async function handleGenerateStudentCode() {
  const { data } = await sessionsStore.generateStudentCode(session.value.id)
  if (data) {
    session.value = data
  }
}

async function handleGenerateReviewerCode() {
  const { data } = await sessionsStore.generateReviewerCode(session.value.id)
  if (data) {
    session.value = data
  }
}

async function handleGenerateViewerCode() {
  const { data } = await sessionsStore.generateViewerCode(session.value.id)
  if (data) {
    session.value = data
  }
}

function requestRegenerateCode(role) {
  regenerateRole.value = role
  showRegenerateConfirm.value = true
}

async function confirmRegenerateCode() {
  if (!session.value || !regenerateRole.value) return

  if (regenerateRole.value === 'student') {
    const { data } = await sessionsStore.generateStudentCode(session.value.id)
    if (data) session.value = data
  } else if (regenerateRole.value === 'reviewer') {
    const { data } = await sessionsStore.generateReviewerCode(session.value.id)
    if (data) session.value = data
  } else if (regenerateRole.value === 'viewer') {
    const { data } = await sessionsStore.generateViewerCode(session.value.id)
    if (data) session.value = data
  }

  regenerateRole.value = null
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
}

function getMeetingUrl(token, role) {
  const baseUrl = window.location.origin
  if (role === 'student') return `${baseUrl}/m/s/${token}`
  if (role === 'reviewer') return `${baseUrl}/m/r/${token}`
  return `${baseUrl}/m/v/${token}`
}

function copyMeetingLink(token, role) {
  navigator.clipboard.writeText(getMeetingUrl(token, role))
}

function openMeetingLink(token, role) {
  window.open(getMeetingUrl(token, role), '_blank', 'noopener')
}

function buildMeetingLinks(role) {
  const baseUrl = window.location.origin
  return meetings.value.map(m => {
    let token, url
    if (role === 'student') { token = m.student_token; url = `${baseUrl}/m/s/${token}` }
    else if (role === 'reviewer') { token = m.reviewer_token; url = `${baseUrl}/m/r/${token}` }
    else { token = m.viewer_token; url = `${baseUrl}/m/v/${token}` }
    const label = m.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${m.meeting_number}`
    return `${label}: ${url}`
  }).join('\n')
}

function openEmailModal(role) {
  let code
  if (role === 'student') code = session.value.student_access_code
  else if (role === 'reviewer') code = session.value.reviewer_access_code
  else code = session.value.viewer_access_code
  const links = buildMeetingLinks(role)
  let bodyKey
  if (role === 'student') bodyKey = 'sessions.emailBodyStudent'
  else if (role === 'reviewer') bodyKey = 'sessions.emailBodyReviewer'
  else bodyKey = 'sessions.emailBodyViewer'
  emailModal.body = $t(bodyKey, { code, links })
  emailModal.show = true
}

function copyEmailBody() {
  navigator.clipboard.writeText(emailModal.body)
  emailModal.show = false
}

function handleExportPdf() {
  if (!session.value || !meetings.value) return
  const locale = $t('app.name') ? (localStorage.getItem('locale') || 'nl') : 'nl'
  exportSessionToPdf(session.value, meetings.value, locale)
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

function getTypeClass(type) {
  const classes = {
    standard_intern: 'bg-info-light text-info-text border border-info-border',
    graduation: 'bg-success-light text-success-text border border-success-border',
  }
  return classes[type] || classes.standard_intern
}

function getStatusClass(status) {
  const classes = {
    active: 'bg-success-light text-success-text',
    completed: 'bg-success-light text-success-text',
    archived: 'bg-muted text-muted-text',
  }
  return classes[status] || classes.active
}

function getMeetingStatusClass(status) {
  const classes = {
    draft: 'bg-warning-light text-warning-text',
    submitted: 'bg-success-light text-success-text',
  }
  return classes[status] || classes.draft
}

function getReviewerOverallGradeClass(grade) {
  const classes = {
    bad: 'bg-error/10 text-error',
    go_but_needs_attention: 'bg-warning-light text-warning-text',
    all_good: 'bg-success-light text-success-text',
  }
  return classes[grade] || ''
}
</script>
