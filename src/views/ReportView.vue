<template>
  <div id="report-view-loading" v-if="isLoading">
    <span>입력해주신 내용을 분석하고 있어요</span>
    <loading-bounce />
  </div>
  <div v-else id="report-view">
    <div class="back-nav-button">
      <span @click="$router.back()">{{ `< 판결문 목록으로 돌아가기` }}</span>
    </div>
    <div v-if="pagemode == 'form'">
      <div class="description-container">
        <p>상황을 조금만 더 자세히 알려주세요</p>
        <p>입력해주신 내용을 바탕으로 상황을 분석해볼게요</p>
      </div>

      <div class="form-container">
        <div class="sample-fill-buttons">
          <p>
            혹시 어떻게 입력할지 감이 잡히지 않으시면, 아래 버튼을 눌러보세요
          </p>
          <div style="display: flex; gap: 1rem">
            <button-card
              text="입력 예시 1번"
              theme="unselected"
              @click="fillSample(1)"
              style="width: 150px; margin-top: 2rem; background-color: beige"
            />
            <button-card
              text="입력 예시 2번"
              theme="unselected"
              @click="fillSample(2)"
              style="width: 150px; margin-top: 2rem; background-color: beige"
            />
          </div>
        </div>
        <card-radio
          title=""
          description="어떤 업종에서 일하셨었나요?"
          :options="apiOptions.industry"
          :labels="apiOptions.industryLabel"
          v-model="industry"
        />
        <keyword-input
          description="산재로 인정받지 못한 질병(상병) 이름들을 알려주세요"
          v-model="diseases"
          :autoSplit="false"
        />
        <text-input
          title=""
          description="상세한 상황을 자유롭게 입력해주세요 (어떤 일이 있었고, 어떤 이유로 불승인이 발생했는지 등을 알려주세요)"
          v-model="freeResponse"
        />
        <button-card
          text="📋 내 상황 분석하기"
          theme="selected"
          @click="analyze"
          style="font-size: 1.5rem; margin: 2rem 0"
        />
      </div>
    </div>
    <div v-else-if="pagemode == 'result'">
      <div class="back-nav-button" style="padding-top: 0">
        <button-card
          text="✏️ 내용 다시 입력하기"
          theme="selected"
          @click="pagemode = 'form'"
          style="font-size: 1.2rem; width: 256px; color: white"
        />
      </div>
      <div class="page-description">
        <div class="description-container">
          <p style="text-align: center">
            입력하신 내용에 따라 현재 상황을 분석했어요
          </p>
        </div>
        <div class="contents-area-wrap">
          <div class="contents-area">
            <section class="precedent">
              <p class="section-header">재해 상황 추정</p>
              <p class="section-item">
                <span class="label">쟁점</span>
                <span class="value">{{
                  report_data.precedent.main_topic
                }}</span>
              </p>
              <p class="section-item">
                <span class="label">판단</span>
                <span class="value">{{
                  report_data.precedent.is_correct_disapproval
                    ? "산재 불승인이 올바를 가능성이 높습니다."
                    : "산재로 승인될 여지가 있습니다."
                }}</span>
              </p>
              <p class="section-item">
                <span class="label">사유</span>
                <span class="value">{{ report_data.precedent.reason }}</span>
              </p>
            </section>
          </div>
          <!-- <button-card
            text="해결 방법 추천받기"
            theme="selected"
            @click="getSolution"
            style="
              font-size: 1.2rem;
              width: 256px;
              color: white;
              margin-top: 2rem;
            "
          /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { apiOptions } from "@/globalConst.js";
import LoadingBounce from "@/components/LoadingBounce.vue";
import CardRadio from "@/components/CardRadio.vue";
import ButtonCard from "@/components/ButtonCard.vue";
import TextInput from "@/components/TextInput.vue";
import KeywordInput from "@/components/KeywordInput.vue";

const isLoading = ref(false);
const pagemode = ref("form");

const industry = ref("");
const diseases = ref([]);
const freeResponse = ref("");

const report_data = ref({
  disease: {},
  precedent: {},
});

let reps = 0;

async function analyze() {
  if (
    industry.value === "" ||
    freeResponse.value.trim() === "" ||
    diseases.value.length === 0
  ) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  try {
    isLoading.value = true;

    const res = await axios.post(
      "https://us-central1-sanjae.cloudfunctions.net/gemma",
      JSON.stringify({
        // industry: industry.value,
        // diseases: diseases.value,
        freeResponse: freeResponse.value,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);

    if (!res.data) {
      throw new Error("분석 결과를 가져오는데 실패했습니다.");
    }
    if (res.data === "NOT_AVAILABLE") {
      alert("서버를 깨우고 있습니다. 10분 뒤에 다시 시도해주세요.");
      return;
    }

    // precedent
    const cleaned_precedent_result = res.data.replace(/```json|```/g, "");

    const prec_obj = JSON.parse(cleaned_precedent_result);
    const parsed_precedent_result = {
      main_topic: prec_obj.issue,
      is_correct_disapproval: Boolean(prec_obj.is_correct),
      reason: prec_obj.reason,
    };
    report_data.value.precedent = parsed_precedent_result;

    // disease
    // const cleaned_disease_result = res.data.disease_result.replace(
    //   /```json|```/g,
    //   ""
    // );
    // const parsed_disease_result = JSON.parse(cleaned_disease_result);
    // report_data.value.disease = parsed_disease_result;

    console.log(report_data.value);

    pagemode.value = "result";
    reps = 0;
  } catch (error) {
    console.error(error);
    if (reps < 3) {
      console.log("재시도. reps:", reps);
      reps++;
      analyze();
    } else {
      alert("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  } finally {
    isLoading.value = false;
  }
}

function get_disease_level(count, rank, total) {
  if (count < 3) {
    return "낮음";
  }
  const level = Math.floor((rank / total) * 100);
  if (level > 0.9) {
    return "높음";
  } else if (level > 0.7) {
    return "보통";
  } else {
    return "낮음";
  }
  return level;
}

function fillSample(num) {
  if (num == 1) {
    industry.value = "건설업";
    diseases.value = ["자발성 두개 내 출혈(우측)", "뇌실 내 출혈"];
    freeResponse.value =
      "회사의 출장 중 강원도의 놀이시설 건립 타당성 조사를 위해 현장을 방문했습니다. 현장 방문 중 동료와 시설 관계자와 함께 점심 식사를 하던 중, 동료들과의 대화에서 수상스키에 대해 이야기 나누게 되었고, 동료와 시설 관계자의 권유와 개인적인 흥미로 수상스키를 처음 타보기로 했습니다. 수상스키를 타는 중 갑작스러운 이상 증세를 느껴 병원으로 이송되었고, 뇌출혈로 진단받았습니다. 이 사고와 관련해 산업재해로 요양 신청을 했으나, 불승인 처분을 받았습니다.";
  } else if (num == 2) {
    industry.value = "운수창고및통신업";
    diseases.value = ["요추 4-5번 추간판 탈출증"];
    freeResponse.value =
      "작업 중 발생한 사고로 인해 허리 부상을 입었습니다. 사고 당시, 무거운 물건을 들어올리던 중 무게 중심이 맞지 않아 부상을 당했습니다. 병원에서 치료를 받았으며, 이후 산업재해 신청을 진행하였으나, 불승인 처분이 내려졌습니다. 불승인 이유는 사고 이전에 이미 허리 질환이 있었던 것으로 확인되어, 기존 질환의 악화로 판단되었기 때문입니다.";
  }
  console.log(freeResponse.value);
}

function getSolution() {
  alert("아직 준비중인 기능입니다");
}
</script>

<style lang="scss" scoped>
#report-view-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4rem;
  height: 100%;
  font-size: 1.3rem;
  background-color: $grey-light;
}
#report-view {
  display: flex;
  flex-direction: column;

  .back-nav-button {
    padding: 2rem;
    span {
      cursor: pointer;
      color: $secondary-color;
      font-size: 1.3rem;
      font-weight: bold;
    }
  }

  .description-container {
    padding: 3rem 2rem;
    background-color: white;
    line-height: 2rem;
    p {
      font-size: 1.3rem;
      font-weight: bold;
    }
  }
  .form-container {
    background-color: $grey-light;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
  }

  ////
  .contents-area-wrap {
    padding: 4rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: $grey-light;
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
  #report-view {
    .contents-area {
      max-width: 100%;
    }
  }
}

@media (max-width: 768px) {
  #report-view {
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
