<template>
  <div id="detail-view">
    <div class="back-nav-button">
      <span @click="goSearch">{{ `< 돌아가기` }}</span>
    </div>
    <div class="contents-area-wrap">
      <div class="contents-title" style="padding: 1rem; text-align: center">
        <p style="font-size: 1.5rem">{{ item.title }}</p>
        <p style="margin: 1rem 0">
          {{ `${item.kindC}에 의한 ${item.kindB}에 대하여` }}
        </p>
        <p style="margin: 1.5rem 0">{{ item.accnum }}</p>
      </div>

      <div class="contents-area">
        <section class="preview">
          <p class="section-header">전체 요약</p>
          <p class="value" style="word-break: keep-all">{{ item.preview }}</p>
        </section>
        <section class="info">
          <p class="section-header">판결 정보</p>
          <p class="section-item">
            <span class="label">원고</span>
            <span class="value">{{ item.summarizedContents.p }}</span>
          </p>
          <p class="section-item">
            <span class="label">피고</span>
            <span class="value">{{ item.summarizedContents.d }}</span>
          </p>
          <p class="section-item">
            <span class="label">결과</span>
            <span class="value">{{
              `${item.kindA} (${item.summarizedContents.result})`
            }}</span>
          </p>
          <p class="section-item">
            <span class="label">판결 기관</span>
            <span class="value">{{
              `${item.courtName} (${item.courtLevel}심)`
            }}</span>
          </p>
        </section>

        <section class="summarized-contents">
          <p class="section-header">판결문 요약 내용</p>
          <p class="section-item">
            <span class="label">배경</span>
            <span class="value">{{ item.summarizedContents.background }}</span>
          </p>
          <p class="section-item">
            <span class="label">쟁점</span>
            <span class="value">{{ item.summarizedContents.issue }}</span>
          </p>
          <p class="section-item">
            <span class="label">판결 사유</span>
            <span class="value">{{ item.summarizedContents.reason }}</span>
          </p>
        </section>

        <section class="original-contents">
          <p class="section-header">원본 판결문</p>
          <button-card
            text="열기"
            theme="selected"
            @click="openOriginalContents"
            style="max-width: 128px; font-weight: bold"
          />
          <!-- <pre class="value" style="text-wrap: wrap; word-break: break-all">{{
          item.contents
        }}</pre> -->
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import ButtonCard from "@/components/ButtonCard.vue";
const router = useRouter();

// receive data from searchView
const { item } = history.state;
if (!item) {
  router.push("/");
}

// event handlers
function goSearch() {
  router.back();
}

function openOriginalContents() {
  const baseUrl = "https://sanjaecase.comwel.or.kr/service/dataView?id=";
  const id = `${item.accnum}_${item.courtName}`;
  window.open(`${baseUrl}${id}`, "_blank");
}
</script>

<style lang="scss" scoped>
#detail-view {
  padding: 2rem;
  padding-top: 0;

  .back-nav-button {
    padding: 2rem 0;
    span {
      cursor: pointer;
      color: $secondary-color;
      font-size: 1.3rem;
      font-weight: bold;
    }
  }

  .contents-area-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .contents-area {
    background-color: white;
    border: 1px solid $grey-medium;
    border-radius: 1rem;
    padding: 2rem;

    max-width: 60%;

    .section-header {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .section-item {
      margin-bottom: 0.5rem;
      display: flex;
      align-items: flex-start;
      padding: 0.2rem 0;
      .label {
        display: block;
        // width: fit-content;
        white-space: nowrap;
        word-break: keep-all;
        font-weight: bold;
        background-color: $primary-color;
        color: $on-primary-color;
        border-radius: 0.5rem;
        padding: 0.5rem;
        margin-right: 0.5rem;
        // color: $grey-strong;
      }

      .value {
        padding-top: 0.25rem;
        word-break: keep-all;
        line-height: 1.5rem;
        // color: $grey-medium;
      }
    }

    section {
      padding: 2rem 0;
    }
    .info {
      border-top: 1px solid $grey-medium;
    }
    .summarized-contents {
      border-top: 1px solid $grey-medium;
    }

    .original-contents {
      border-top: 1px solid $grey-medium;
    }
  }
}

@media (max-width: 1280px) {
  #detail-view {
    .contents-area {
      max-width: 100%;
    }
  }
}

@media (max-width: 768px) {
  #detail-view {
    .contents-area {
      padding: 1rem;
      section {
        padding: 1rem 0;
      }
      .section-item {
        flex-wrap: wrap;
      }
    }
  }
}
</style>
